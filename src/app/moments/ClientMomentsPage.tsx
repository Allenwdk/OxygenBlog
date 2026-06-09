'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MomentForm from '@/components/moments/MomentForm';
import MomentCard from '@/components/moments/MomentCard';
import LazyMarkdown from '@/components/LazyMarkdown';
import { useBackgroundStyle } from '@/hooks/useBackgroundStyle';

/**
 * 动态文章接口
 */
interface MomentPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  slug: string;
  images?: string[]; // base64 image URLs extracted from content
}

interface MomentDetail {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  content: string;
  images?: string[];
}

interface ClientMomentsPageProps {
  initialPosts: MomentPost[];
}

/**
 * 客户端动态列表页面 - 社交媒体时间线风格
 */
export default function ClientMomentsPage({ initialPosts }: ClientMomentsPageProps) {
  const [posts] = useState<MomentPost[]>(initialPosts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<MomentDetail | null>(null);
  const { containerStyle } = useBackgroundStyle('moments');

  const openDetail = useCallback((slug: string) => {
    setSelectedSlug(slug);
    const post = posts.find(p => p.slug === slug);
    if (post) {
      setDetailData({
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        author: post.author,
        content: post.content,
        images: post.images
      });
    }
    window.history.pushState({ slug }, '', `?view=${encodeURIComponent(slug)}`);
  }, [posts]);

  const closeDetail = useCallback(() => {
    setSelectedSlug(null);
    setDetailData(null);
    window.history.back();
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/moments/revalidate`, { method: 'POST' });
      if (res.ok) {
        window.location.reload();
      } else {
        window.location.reload();
      }
    } catch {
      window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handlePublishSuccess = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  // Handle browser back/forward when closing detail view
  useEffect(() => {
    const handlePopState = () => {
      if (!window.location.search.includes('view=')) {
        setSelectedSlug(null);
        setDetailData(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sort posts by date descending (newest first)
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Format date for detail view
  const formattedDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={containerStyle.className} style={containerStyle.style}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-[70px] pb-16">

        {/* Header section */}
        {!selectedSlug && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              动态
            </h1>
          </motion.div>
        )}

        {/* Publish form */}
        {!selectedSlug && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8"
          >
            <MomentForm onPublishSuccess={handlePublishSuccess} />
          </motion.div>
        )}

        {/* Detail View - clean single post layout */}
        <AnimatePresence>
          {selectedSlug && detailData && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="mb-8"
            >
              <button
                onClick={closeDetail}
                className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                返回动态
              </button>

              {/* Detail card - minimal styling */}
              <div className="px-4 py-5">
                {/* Author header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-primary-foreground font-semibold shadow-sm ring-2 ring-background/50">
                    {detailData.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{detailData.author}</div>
                    <div className="text-xs text-muted-foreground/70">
                      {formattedDate(detailData.date)}
                    </div>
                  </div>
                </div>

                {/* Content - full rendering */}
                <div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed mb-4">
                  <LazyMarkdown content={detailData.content} />
                </div>

                {/* Images from post.images[] - tiled below text */}
                {detailData.images && detailData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {detailData.images.map((src, i) => (
                      <img key={i} src={src} alt="" className="w-full h-auto rounded-xl border border-border/30 shadow-sm object-cover" />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Refresh indicator */}
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mb-6"
          >
            <span className="text-sm text-muted-foreground">刷新中...</span>
          </motion.div>
        )}

        {/* Timeline feed */}
        {!selectedSlug && (
          <>
            {sortedPosts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {sortedPosts.map((post) => (
                  <MomentCard
                    key={post.id}
                    post={{ ...post, onClick: () => openDetail(post.slug) }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center justify-center py-24 px-4"
              >
                <div className="text-5xl mb-4 opacity-60">✨</div>
                <h2 className="text-lg font-medium text-foreground/80 mb-2">
                  还没有动态
                </h2>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  开启你的第一条动态，记录生活中的精彩瞬间吧
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Footer */}
        {!selectedSlug && sortedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <div className="w-px h-8 bg-gradient-to-b from-border/50 to-transparent mx-auto mb-4" />
            <p className="text-xs text-muted-foreground/50">
              共 {sortedPosts.length} 条动态
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
