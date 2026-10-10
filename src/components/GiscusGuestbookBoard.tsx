'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { Giscus } from './Giscus';

export default function GiscusGuestbookBoard() {
  return (
    <div className="w-full">
      {/* 主卡片：沿用全站语义令牌（card / border），与其它卡片保持同一套视觉语言 */}
      <motion.div
        className="relative bg-card/60 backdrop-blur-sm rounded-2xl shadow-sm border border-border/40 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 顶部渐变装饰条 */}
        <div
          className="h-1.5 w-full"
          style={{
            background: 'linear-gradient(90deg, var(--primary) 0%, var(--color-chart-2) 50%, var(--color-secondary) 100%)'
          }}
        />

        {/* 内容区域 */}
        <div className="p-6 md:p-8">
          {/* 区域标题：与首屏 PageHeader 构成 h1 → h2 的层级关系 */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-5">
            <MessageSquare className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-foreground">留言区</h2>
            <span className="text-sm text-muted-foreground">
              （使用 GitHub 账号登录后即可留言）
            </span>
          </div>

          {/* Giscus 评论区：用 specific 映射 + 固定 term，使留言板拥有独立于博客评论的讨论串 */}
          <div className="relative">
            <Giscus
              mapping="specific"
              term="guestbook"
              category="General"
              categoryId="DIC_kwDOP18nO84Cv1_p"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
