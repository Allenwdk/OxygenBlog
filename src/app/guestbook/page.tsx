/**
 * 留言板页面
 * 使用与其他页面统一的布局风格：PageHeader + 内容区域
 */
'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'motion/react';
import PageHeader from '@/components/ui/PageHeader';
import { useBackgroundStyle } from '@/hooks/useBackgroundStyle';

// 动态导入大型组件
const LazyGiscusGuestbookBoard = lazy(() => import('@/components/GiscusGuestbookBoard'));

/**
 * 加载占位组件
 *
 * 骨架的作用是让「加载中」与「加载完成」两种状态的高度尽量接近，
 * 避免评论区出现时把页面内容整体顶下去；因此按真实结构分块：
 * 卡片外壳、标题行、输入框、若干条评论。
 */
function GuestbookSkeleton() {
  return (
    <div className="w-full">
      {/* 卡片外壳：圆角、底色、描边、阴影与真实卡片逐项对齐，避免加载完成瞬间外形跳变 */}
      <div className="relative bg-card/60 backdrop-blur-sm rounded-2xl shadow-sm border border-border/40 overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{
            background: 'linear-gradient(90deg, var(--primary) 0%, var(--color-chart-2) 50%, var(--color-secondary) 100%)'
          }}
        />

        <div className="p-6 md:p-8">
          {/* 标题行占位 */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-5 h-5 rounded bg-muted animate-pulse" />
            <div className="w-16 h-6 rounded bg-muted animate-pulse" />
          </div>

          {/* 评论输入框占位 */}
          <div className="h-24 rounded-xl bg-muted/60 animate-pulse mb-6" />

          {/* 评论条目占位 */}
          <div className="space-y-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-muted animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-4 rounded bg-muted animate-pulse" />
                  <div className="w-full h-4 rounded bg-muted/60 animate-pulse" />
                  <div className="w-3/5 h-4 rounded bg-muted/60 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Guestbook() {
  const { theme } = useTheme();
  const { containerStyle } = useBackgroundStyle('guestbook');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [theme]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden ${containerStyle.className}`} style={containerStyle.style}>
      {/* 背景装饰元素 - 柔和的主题色光晕 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 25%, transparent) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, color-mix(in srgb, var(--color-chart-2) 25%, transparent) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* 页面标题 - 使用统一的 PageHeader 组件 */}
        <PageHeader
          title="留言板"
          description="留下点什么吧 awa"
          size="lg"
          className="mb-12"
          gradientStyle="primary"
          showDivider
        />

        {/* 留言板主体 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Suspense fallback={<GuestbookSkeleton />}>
            <LazyGiscusGuestbookBoard />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
