'use client';

import { ReactNode } from 'react';

/**
 * EvervaultCard 组件占位实现
 * 原组件应为带噪点或网格纹理的特效卡片
 * 此处保持接口一致，使构建能够通过
 */
export function EvervaultCard() {
  return (
    <div className="w-full h-48 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/40 flex items-center justify-center">
      <span className="text-muted-foreground text-sm">Card</span>
    </div>
  );
}

/**
 * Icon 占位组件
 * 原组件应为装饰性角标图标
 */
export function Icon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
