'use client';

import { motion } from 'motion/react';

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
  post: MomentPost & { onClick?: () => void };
}

/**
 * 动态卡片组件 - 时间线样式
 */
export default function MomentCard({ post }: MomentCardProps) {
  const handleClick = () => {
    if (post.onClick) {
      post.onClick();
    }
  };

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.3, ease: 'easeOut' }
        }
      }}
      onClick={handleClick}
      className="cursor-pointer bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      <div className="p-6">
        {/* 头部信息 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {post.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium text-foreground">{post.author}</h3>
              <p className="text-sm text-muted-foreground">{post.date}</p>
            </div>
          </div>
        </div>

        {/* 内容 */}
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            {post.excerpt || '暂无内容'}
          </p>
        </div>

        {/* 底部元信息 */}
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">ID: {post.id}</span>
        </div>
      </div>
    </motion.article>
  );
}
