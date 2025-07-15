'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * 404 页面组件
 * 当用户访问不存在的页面时显示
 * 支持主题色管理和响应式设计
 * 
 * @returns 404 错误页面
 */
export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  // 确保组件已挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  // 获取 CSS 变量中的主题色
  const getThemeColor = (colorName: string): string => {
    if (typeof window === 'undefined') return '#3b82f6'; // 默认蓝色
    return getComputedStyle(document.documentElement).getPropertyValue(`--theme-${colorName}`).trim() || '#3b82f6';
  };

  // 获取当前主题色
  const primaryColor = getThemeColor('primary');
  const accentColor = getThemeColor('accent');

  // 如果还没有挂载，显示默认样式避免闪烁
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 数字 */}
        <div className="mb-8">
          <h1 
            className="text-8xl md:text-9xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`
            }}
          >
            404
          </h1>
        </div>

        {/* 错误信息 */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            页面未找到
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            抱歉，您访问的页面不存在或已被移动。
            <br />
            让我们帮您找到正确的方向。
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: primaryColor,
              color: 'white'
            }}
          >
            🏠 返回首页
          </Link>
          <Link
            href="/blogs"
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: accentColor,
              color: 'white'
            }}
          >
            📚 浏览博客
          </Link>
        </div>

        {/* 装饰性元素 */}
        <div className="mt-12 opacity-50">
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: primaryColor,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}