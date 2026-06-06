'use client';

import { useState, useCallback } from 'react';
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
}

interface MomentDetail {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  content: string;
}

interface ClientMomentsPageProps {
  initialPosts: MomentPost[];
}

/**
 * 客户端动态列表页面
 * 处理交互、发布和展示效果
 */
export default function ClientMomentsPage({ initialPosts }: ClientMomentsPageProps) {
  const [posts] = useState<MomentPost[]>(initialPosts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<MomentDetail | null>(null);
  const { containerStyle } = useBackgroundStyle('moments');

  /**
   * 打开详情视图
   */
  const openDetail = useCallback((slug: string) => {
    setSelectedSlug(slug);
    // 从 posts 中查找对应的完整内容
    const post = posts.find(p => p.slug === slug);
    if (post) {
      setDetailData({
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        author: post.author,
        content: post.content
      });
    }
    // Update URL without reload
    window.history.pushState({ slug }, '', `?view=${encodeURIComponent(slug)}`);
  }, [posts]);

  /**
   * 关闭详情视图
   */
  const closeDetail = useCallback(() => {
    setSelectedSlug(null);
    setDetailData(null);
    window.history.back();
  }, []);

  /**
   * 重新加载动态列表
   */
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 通过 revalidatePath 刷新服务端数据
      const res = await fetch(`/api/moments/revalidate`, { method: 'POST' });
      if (res.ok) {
        window.location.reload();
      } else {
        // 如果 revalidate API 不可用，直接刷新页面
        window.location.reload();
      }
    } catch {
      window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  /**
   * 处理发布成功回调
   */
  const handlePublishSuccess = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  // Handle browser back/forward when closing detail view
  useCallback(() => {
    const handlePopState = () => {
      if (!window.location.search.includes('view=')) {
        setSelectedSlug(null);
        setDetailData(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /**
   * 容器动画配置
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  // Format date for display
  const formattedDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}年${month}月${day}日`;
      }
    } catch {
      // ignore
    }
    return dateStr;
  };

  return (
    <div className={containerStyle.className} style={containerStyle.style}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[65px] pb-12">
        {/* 页面标题 */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-3">
            💬 我的动态
          </h1>
          <p className="text-muted-foreground text-lg">
            记录生活中的点点滴滴
          </p>
        </motion.div>

        {/* 发布表单 */}
        {!selectedSlug && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-10"
          >
            <MomentForm onPublishSuccess={handlePublishSuccess} />
          </motion.div>
        )}

        {/* 刷新状态 */}
        {isRefreshing && (
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <span className="animate-spin">⏳</span>
              正在刷新动态...
            </span>
          </div>
        )}

        {/* Detail View */}
        <AnimatePresence>
          {selectedSlug && detailData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-10"
            >
              <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <button
                  onClick={closeDetail}
                  className="mb-6 inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  ← 返回动态列表
                </button>

                {/* Detail content */}
                <div className="glass-card rounded-xl shadow-md overflow-hidden border backdrop-blur-md bg-card/80 supports-[backdrop-filter]:bg-card/60 border-border/50">
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                      <span>{formattedDate(detailData.date)}</span>
                      <span>•</span>
                      <span>👤 {detailData.author}</span>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <LazyMarkdown content={detailData.content} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic list */}
        {!selectedSlug && (
          <>
            {posts.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {posts.map((post) => (
                  <MomentCard 
                    key={post.id} 
                    post={{ ...post, onClick: () => openDetail(post.slug) }} 
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-6">📝</div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    暂无动态
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    还没有发布任何动态，快来发布第一条吧！
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
