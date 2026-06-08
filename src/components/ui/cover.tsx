'use client';

import { ReactNode } from 'react';

/**
 * Cover 组件占位实现
 * 原组件应为带光效或遮罩动画的文本包装器
 * 此处保持接口一致，使构建能够通过
 */
export function Cover({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
      {children}
    </span>
  );
}
