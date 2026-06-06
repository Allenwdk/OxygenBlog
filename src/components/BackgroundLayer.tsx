'use client';

import { 
  backgroundImage, 
  enableBackground, 
  backgroundMode, 
  backgroundFixed
} from '@/setting/WebSetting';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';

/**
 * 网站背景组件
 * 使用 CSS background-image 在最底层显示背景图片
 * 光照效果跟随鼠标指针移动
 */

export default function BackgroundLayer() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 确保组件在客户端挂载后再渲染，避免主题不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  // 监听鼠标移动，更新光照位置
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 所有 hooks 必须在条件返回之前调用（遵守 Hooks 规则）
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const fullImagePath = `${basePath}${backgroundImage}`;
  const isDark = resolvedTheme === 'dark';

  if (!enableBackground || !backgroundImage || !mounted) {
    return null;
  }

  // 光照半径
  const LIGHT_RADIUS = 200;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-10] pointer-events-none"
      style={{
        backgroundImage: isDark 
          ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("${fullImagePath}")`
          : `url("${fullImagePath}")`,
        backgroundSize: backgroundMode === 'cover' ? 'cover' : backgroundMode === 'contain' ? 'contain' : 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: backgroundFixed ? 'fixed' : 'scroll',
      }}
      aria-hidden="true"
    >
      {/* 跟随鼠标的光照效果 */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(${LIGHT_RADIUS}px circle at ${mousePos.x}px ${mousePos.y}px, ${isDark ? 'oklch(0.627 0.400 188.7 / 0.12)' : 'oklch(0.327 0.400 188.7 / 0.15)'}, transparent ${LIGHT_RADIUS}px)`,
        }}
      />

      {/* 静态径向渐变叠加层 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 30% 20%, oklch(0.627 0.400 188.7 / 0.1) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 30% 20%, oklch(0.327 0.400 188.7 / 0.12) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}