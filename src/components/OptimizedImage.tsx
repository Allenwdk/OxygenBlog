'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { processImagePath, isExternalImage } from '@/lib/process-image-path';
interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  title,
  className = '',
  width = 800,
  height = 600,
  priority = false
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority); // 优先级图片默认可见
  const [isMounted, setIsMounted] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  
  // 防止重复请求的状态管理
  const loadingStateRef = useRef<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  // 使用 useMemo 缓存处理后的图片路径和外部链接判断，避免重复计算
  const processedSrc = useMemo(() => processImagePath(src), [src]);
  const isExternal = useMemo(() => isExternalImage(src), [src]);
  
  // 重置加载状态当图片源改变时
  useEffect(() => {
    loadingStateRef.current = 'idle';
    setIsLoaded(false);
    setHasError(false);
  }, [processedSrc]);

  // 确保组件已挂载，避免水合不匹配
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 使用 Intersection Observer 实现懒加载
  useEffect(() => {
    // 如果是优先级图片，直接返回，不需要观察器
    if (priority) {
      return;
    }

    if (!imgRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // 提前50px开始加载
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // 服务端渲染时返回简单占位符，避免水合不匹配
  if (!isMounted) {
    return (
      <div ref={imgRef} className={`relative overflow-hidden rounded-lg max-w-full shadow-lg ${className}`}>
        <div className="bg-gray-200 dark:bg-gray-700 flex items-center justify-center" style={{ width, height: Math.min(height, 600) }}>
          <div className="text-gray-400 dark:text-gray-500 text-sm">加载中...</div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <motion.div
        ref={imgRef}
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-8 rounded-lg min-h-[200px] max-w-full shadow-lg ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-sm">图片加载失败</div>
          {alt && <div className="text-xs text-gray-400 mt-1">{alt}</div>}
        </div>
      </motion.div>
    );
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden rounded-lg ${className || 'max-w-full shadow-lg'}`}>
      {/* 加载占位符 */}
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-gray-400 dark:text-gray-500">
            <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </motion.div>
      )}

      {/* 实际图片 */}
      {isInView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {isExternal ? (
            <img
              src={processedSrc}
              alt={alt}
              title={title}
              loading={priority ? 'eager' : 'lazy'}
              className="w-full h-auto object-contain"
              style={{ maxHeight: '600px' }}
              onLoad={() => {
                if (loadingStateRef.current === 'idle' || loadingStateRef.current === 'loading') {
                  loadingStateRef.current = 'loaded';
                  setIsLoaded(true);
                }
              }}
              onError={() => {
                if (loadingStateRef.current === 'idle' || loadingStateRef.current === 'loading') {
                  loadingStateRef.current = 'error';
                  setHasError(true);
                }
              }}
              onLoadStart={() => {
                if (loadingStateRef.current === 'idle') {
                  loadingStateRef.current = 'loading';
                }
              }}
              decoding="async"
            />
          ) : (
            <Image
              src={processedSrc}
              alt={alt}
              title={title}
              width={width}
              height={height}
              className="w-full h-auto object-contain"
              style={{ maxHeight: '600px' }}
              loading={priority ? 'eager' : 'lazy'}
              priority={priority}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              onLoad={() => {
                if (loadingStateRef.current === 'idle' || loadingStateRef.current === 'loading') {
                  loadingStateRef.current = 'loaded';
                  setIsLoaded(true);
                }
              }}
              onError={() => {
                if (loadingStateRef.current === 'idle' || loadingStateRef.current === 'loading') {
                  loadingStateRef.current = 'error';
                  setHasError(true);
                }
              }}
              onLoadStart={() => {
                if (loadingStateRef.current === 'idle') {
                  loadingStateRef.current = 'loading';
                }
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          )}
        </motion.div>
      )}

      {/* 图片标题 */}
      {(alt || title) && isLoaded && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm p-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {alt || title}
        </motion.div>
      )}
    </div>
  );
}