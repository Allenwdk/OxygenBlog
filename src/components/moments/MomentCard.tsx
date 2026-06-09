'use client';

import { motion } from 'motion/react';
import { useState, useCallback } from 'react';
import { processImagePath } from '@/lib/process-image-path';

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

interface MomentCardProps {
  post: MomentPost & { onClick?: () => void; images?: string[] };
  onImageClick?: (index: number) => void;
  slug: string;
}

/**
 * 将时间戳转换为相对时间
 */
function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return dateStr;
  }
}

/**
 * 动态卡片组件 - 社交媒体时间线风格
 */
export default function MomentCard({ post, onImageClick, slug }: MomentCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showContentExpanded, setShowContentExpanded] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? Math.max(0, prev - 1) : prev + 1);
  }, [liked]);

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/moments?view=${encodeURIComponent(slug)}`;
      await navigator.clipboard.writeText(url);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, [slug]);

  const handleComment = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    post.onClick?.();
  }, [post]);

  const LINE_CLAMP = 4;
  const isLongContent = post.excerpt.split('\n').length > LINE_CLAMP || post.excerpt.length > 200;

// Images from post.images[] (populated by scanImagesInDirectory)
  const images = post.images || [];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: 'easeOut' }
        }
      }}
      className="relative pl-8 pb-8 group"
    >
      {/* Timeline line */}
      <div className="absolute left-[19px] top-2 bottom-0 w-px bg-gradient-to-b from-border via-border/60 to-transparent" />

      {/* Timeline dot */}
      <div className="absolute left-[14px] top-2.5 z-10">
        <div className="w-3 h-3 rounded-full bg-primary/70 ring-4 ring-background/90" />
      </div>

      {/* Card content - glass morphism style */}
      <div className="glass-card shadow-glass-md rounded-2xl p-4 cursor-pointer select-none transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-1">
        {/* Author line */}
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md ring-2 ring-background/80 flex-shrink-0">
            {post.author.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-foreground text-sm truncate">{post.author}</span>
              <span className="text-xs text-muted-foreground/70 flex-shrink-0">
                · {formatRelativeTime(post.date)}
              </span>
            </div>
          </div>

          {/* More actions button placeholder */}
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="19" r="2"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="text-foreground text-[15px] leading-relaxed mb-3 relative">
          <div className={`whitespace-pre-wrap ${!showContentExpanded ? 'line-clamp-4' : ''}`}>
            {post.excerpt}
          </div>
          {!showContentExpanded && isLongContent && (
            <div className="relative">
              <div className="absolute inset-x-0 -bottom-1 h-8 bg-gradient-to-t from-card/90 to-transparent pointer-events-none" />
              <button
                onClick={(e) => { e.stopPropagation(); setShowContentExpanded(true); }}
                className="relative z-10 text-primary/80 hover:text-primary text-sm font-medium mt-1 transition-colors"
              >
                展开全文
              </button>
            </div>
          )}
          {showContentExpanded && isLongContent && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowContentExpanded(false); }}
              className="text-primary/80 hover:text-primary text-sm font-medium mt-1 transition-colors"
            >
              收起
            </button>
          )}
        </div>

        {/* Image gallery */}
        {images.length > 0 && (
          <div className={`grid gap-2 mb-3 ${
            images.length === 1 ? 'grid-cols-1' : 
            images.length === 2 ? 'grid-cols-2' : 
            'grid-cols-3'
          }`}>
            {images.slice(0, 9).map((src, i) => (
              <div key={i} className={`relative overflow-hidden rounded-xl ${
                images.length === 1 ? 'aspect-video' : 'aspect-square'
              }`}>
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={(e) => { e.stopPropagation(); onImageClick?.(i); }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-1 pt-3 mt-1 border-t border-border/30">
          {/* Like button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
              liked ? 'text-red-500 hover:bg-red-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <motion.svg
              animate={liked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </motion.svg>
            <span>{likeCount > 0 ? likeCount : '赞'}</span>
          </motion.button>

          {/* Comment button */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            onClick={handleComment}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>评论</span>
          </button>

          {/* Share button */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ml-auto relative"
            onClick={handleShare}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            {showCopiedToast && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-foreground text-background px-2 py-1 rounded-md shadow-md"
              >
                已复制
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
