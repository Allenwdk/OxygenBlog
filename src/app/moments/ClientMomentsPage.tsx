'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MomentForm from '@/components/moments/MomentForm';
import MomentCard from '@/components/moments/MomentCard';
import ImageLightbox from '@/components/moments/ImageLightbox';
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
  images?: string[];
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
 * 返回固定的日期标签（用于服务端渲染，避免 hydration 不匹配）
 */
function getStaticDateLabel(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
  } catch {
    return '';
  }
}

/**
 * 将日期格式化为友好的分组标签（仅客户端使用）
 */
function getDateGroupLabel(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((today.getTime() - targetDay.getTime()) / 86400000);

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays === 2) return '前天';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (year === now.getFullYear()) {
      return `${month}月${day}日`;
    }
    return `${year}年${month}月${day}日`;
  } catch {
    return '';
  }
}

/**
 * 格式化完整日期时间
 */
function formatFullDate(dateStr: string): string {
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
}

/**
 * 客户端动态列表页面 - 社交媒体时间线风格
 */
export default function ClientMomentsPage({ initialPosts }: ClientMomentsPageProps) {
  const [posts] = useState<MomentPost[]>(initialPosts);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<MomentDetail | null>(null);
  const { containerStyle } = useBackgroundStyle('moments');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);

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
    window.location.reload();
  }, []);

  const handlePublishSuccess = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  const openLightbox = useCallback((images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

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
  const sortedPosts = useMemo(() =>
    [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [posts]
  );

  // Group posts by date
  const groupedPosts = useMemo(() => {
    const getDateLabel = mounted ? getDateGroupLabel : getStaticDateLabel;
    const groups: { label: string; posts: MomentPost[] }[] = [];
    let currentLabel = '';

    for (const post of sortedPosts) {
      const label = getDateLabel(post.date);
      if (label !== currentLabel) {
        currentLabel = label;
        groups.push({ label, posts: [post] });
      } else {
        groups[groups.length - 1].posts.push(post);
      }
    }

    return groups;
  }, [sortedPosts, mounted]);

  // Stats
  const totalCount = sortedPosts.length;
  const latestDate = sortedPosts.length > 0 ? formatFullDate(sortedPosts[0].date) : '';

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
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
              动态
            </h1>
            <p className="text-sm text-muted-foreground/70">
              {totalCount > 0 ? (
                <>
                  共 <span className="text-foreground/80 font-medium">{totalCount}</span> 条动态
                  {latestDate && <span> · 最近更新于 {latestDate}</span>}
                </>
              ) : (
                '记录生活中的点滴'
              )}
            </p>
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

        {/* Detail View */}
        <AnimatePresence>
          {selectedSlug && detailData && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="mb-8"
            >
              {/* Back button */}
              <button
                onClick={closeDetail}
                className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors glass-card shadow-glass-sm rounded-full px-4 py-2 hover:shadow-glass-md"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                返回动态
              </button>

              {/* Detail card - glass morphism */}
              <div className="glass-card shadow-glass-md rounded-2xl p-6">
                {/* Author header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground font-bold shadow-md ring-2 ring-background/80">
                    {detailData.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{detailData.author}</div>
                    <div className="text-xs text-muted-foreground/70">
                      {formatFullDate(detailData.date)}
                    </div>
                  </div>
                </div>

                {/* Content - full rendering */}
                <div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed mb-5">
                  <LazyMarkdown content={detailData.content} />
                </div>

                {/* Images - responsive grid */}
                {detailData.images && detailData.images.length > 0 && (
                  <div className={`grid gap-3 ${
                    detailData.images.length === 1 ? 'grid-cols-1' :
                    detailData.images.length === 2 ? 'grid-cols-2' :
                    'grid-cols-2 sm:grid-cols-3'
                  }`}>
                    {detailData.images.map((src, i) => (
                      <div
                        key={i}
                        className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                          detailData.images!.length === 1 ? 'aspect-video' : 'aspect-square'
                        }`}
                        onClick={() => openLightbox(detailData.images!, i)}
                      >
                        <img
                          src={src}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline feed with date grouping */}
        {!selectedSlug && (
          <>
            {sortedPosts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {groupedPosts.map((group) => (
                  <div key={group.label}>
                    {/* Date group separator */}
                    <div className="flex items-center gap-3 mb-4 mt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {group.label}
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent" />
                    </div>

                    {/* Posts in this group */}
                    {group.posts.map((post) => (
                      <MomentCard
                        key={post.id}
                        slug={post.slug}
                        post={{ ...post, onClick: () => openDetail(post.slug) }}
                        onImageClick={(index) => openLightbox(post.images || [], index)}
                      />
                    ))}
                  </div>
                ))}
              </motion.div>
            ) : (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center justify-center py-24 px-4"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    <line x1="9" y1="10" x2="15" y2="10"/>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-foreground/80 mb-2">
                  还没有动态
                </h2>
                <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
                  点击上方「分享此刻的想法」，记录生活中的精彩瞬间吧
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
              已经到底啦
            </p>
          </motion.div>
        )}

        {/* Image Lightbox */}
        <ImageLightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      </div>
    </div>
  );
}
