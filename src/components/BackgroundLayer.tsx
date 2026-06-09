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
  const containerRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const mousePosRef = useRef({ x: -200, y: -200 });

  // 确保组件在客户端挂载后再渲染，避免主题不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  // 所有 hooks 必须在条件返回之前调用（遵守 Hooks 规则）
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const fullImagePath = `${basePath}${backgroundImage}`;
  const isDark = resolvedTheme === 'dark';
  const LIGHT_RADIUS = 200;

  // 监听鼠标移动，更新光照位置（使用requestAnimationFrame优化）
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      
      // 使用requestAnimationFrame避免过度渲染
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        if (lightRef.current) {
          const { x, y } = mousePosRef.current;
          lightRef.current.style.background = 
            `radial-gradient(${LIGHT_RADIUS}px circle at ${x}px ${y}px, ${isDark ? 'oklch(0.627 0.400 188.7 / 0.12)' : 'oklch(0.327 0.400 188.7 / 0.15)'}, transparent ${LIGHT_RADIUS}px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDark]);

  if (!enableBackground || !backgroundImage || !mounted) {
    return null;
  }

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
        ref={lightRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(${LIGHT_RADIUS}px circle at ${mousePosRef.current.x}px ${mousePosRef.current.y}px, ${isDark ? 'oklch(0.627 0.400 188.7 / 0.12)' : 'oklch(0.327 0.400 188.7 / 0.15)'}, transparent ${LIGHT_RADIUS}px)`,
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