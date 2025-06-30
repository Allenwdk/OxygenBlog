'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

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
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // 使用 Intersection Observer 实现懒加载
  useEffect(() => {
    if (!imgRef.current || priority) {
      setIsInView(true);
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

  const isExternal = src.startsWith('http');

  if (hasError) {
    return (
      <motion.div
        ref={imgRef}
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-8 rounded-lg min-h-[200px] ${className}`}
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
    <div ref={imgRef} className={`relative overflow-hidden rounded-lg ${className}`}>
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
              src={src}
              alt={alt}
              title={title}
              loading={priority ? 'eager' : 'lazy'}
              className="w-full h-auto object-contain"
              style={{ maxHeight: '600px' }}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              decoding="async"
            />
          ) : (
            <Image
              src={src}
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
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
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