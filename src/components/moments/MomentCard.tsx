'use client';

import { motion } from 'motion/react';
import { useState, useCallback, useEffect } from 'react';

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
export default function MomentCard({ post }: MomentCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showContentExpanded, setShowContentExpanded] = useState(false);
  const [showCommentTip, setShowCommentTip] = useState(false);

  // 从 localStorage 恢复点赞状态（以 slug 为唯一标识）
  useEffect(() => {
    try {
      const key = `moment-like-${post.slug}`;
      const stored = localStorage.getItem(key);
      if (stored === '1') {
        setLiked(true);
        setLikeCount(1);
      }
    } catch {
      // localStorage 不可用时静默失败
    }
  }, [post.slug]);

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(newLiked ? 1 : 0);
    try {
      const key = `moment-like-${post.slug}`;
      if (newLiked) {
        localStorage.setItem(key, '1');
      } else {
        localStorage.removeItem(key);
      }
    } catch {
      // localStorage 不可用时静默失败
    }
  }, [liked, post.slug]);

  // Truncate long content for feed view
  const isLongContent = post.excerpt.length > 200;
  const displayContent = showContentExpanded ? post.excerpt :
    isLongContent ? `${post.excerpt.slice(0, 200)}...` : post.excerpt;

  // 处理图片路径中的 basePath（GitHub Pages 子路径部署需要）
  const resolveImgPath = (src: string): string => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    if (src.startsWith('/moments/') && basePath) {
      return `${basePath}${src}`;
    }
    return src;
  };

  // Determine images to render: prefer extracted images, fall back to regex from content
  const images = post.images || (() => {
    if (!post.excerpt) return [];
    const results: string[] = [];
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    while ((match = imgRegex.exec(post.excerpt)) !== null) {
      results.push(resolveImgPath(match[2]));
    }
    return results;
  })();

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

      {/* Card content - no border, no shadow, just floating content */}
      <div className="cursor-pointer select-none transition-all duration-200 hover:bg-card/50 rounded-xl px-4 py-3 -mx-4">
        {/* Author line */}
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-sm ring-2 ring-background/50 flex-shrink-0">
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
        <div className="text-foreground text-[15px] leading-relaxed mb-3">
          {isLongContent && !showContentExpanded ? (
            <>
              <p className="whitespace-pre-wrap">{displayContent}</p>
              <button
                onClick={() => setShowContentExpanded(true)}
                className="text-primary/80 hover:text-primary text-sm font-medium mt-1 transition-colors"
              >
                展开
              </button>
            </>
          ) : (
            <p className="whitespace-pre-wrap">{displayContent}</p>
          )}
        </div>

        {/* Image gallery */}
        {images.length > 0 && (
          <div className={`flex flex-wrap gap-2 mb-3 ${images.length === 1 ? 'justify-center' : ''}`}>
            {images.slice(0, 4).map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                className="max-w-[200px] w-full h-auto rounded-xl border border-border/30 shadow-sm object-cover cursor-pointer hover:opacity-90 transition-opacity"
              />
            ))}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-5 pt-1">
          {/* Like button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition-colors group/like ${
              liked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform duration-200 group-hover/like:scale-110"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>{likeCount > 0 ? likeCount : '赞'}</span>
          </button>

          {/* Comment button */}
          <button
            className="relative flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowCommentTip(true);
              setTimeout(() => setShowCommentTip(false), 2000);
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform duration-200 hover:scale-110"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>评论</span>
            {showCommentTip && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-popover text-popover-foreground px-2 py-1 rounded shadow border">
                评论功能开发中
              </span>
            )}
          </button>

          {/* Share button */}
          <button
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform duration-200 hover:scale-110"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
