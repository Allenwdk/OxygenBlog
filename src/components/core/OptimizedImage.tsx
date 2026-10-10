'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { processImagePath } from '@/lib/process-image-path';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  quality?: number;
  onClick?: () => void;
  /**
   * 模糊占位符图片URL（低分辨率版本）
   * 用于实现渐进式加载效果
   */
  blurDataURL?: string;
  /**
   * 是否启用WebP格式自动转换
   * 默认不启用：静态导出到 GitHub Pages 后不会自动生成 .webp，
   * 贸然改写扩展名会导致请求不存在的资源
   */
  enableWebP?: boolean;
  /**
   * 图片填充模式
   */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /**
   * 图片圆角
   */
  borderRadius?: string;
}

/**
 * 优化的图片组件 - 增强版懒加载实现
 *
 * 核心功能：
 * 1. 智能懒加载 - 使用 Intersection Observer 实现精确的图片进入视口检测
 * 2. 模糊占位符 - 支持渐进式加载，先显示模糊小图再过渡到清晰大图
 * 3. WebP自动转换 - 默认关闭，仅在传入 enableWebP=true 且存在对应 .webp 资源时启用
 * 4. 加载状态管理 - 优雅的加载动画和错误处理
 * 5. 性能优化 - 减少重绘重排，使用GPU加速
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  loading = 'lazy',
  placeholder,
  quality = 80,
  onClick,
  blurDataURL,
  enableWebP = false,
  objectFit = 'cover',
  borderRadius,
}: OptimizedImageProps) {
  // 状态管理
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [shouldLoad, setShouldLoad] = useState(priority || loading === 'eager');
  const [isInViewport, setIsInViewport] = useState(false);

  // 引用管理
  const imgRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /**
   * 检测浏览器是否支持WebP格式
   */
  const checkWebPSupport = useCallback((): boolean => {
    try {
      const canvas = document.createElement('canvas');
      if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  /**
   * 将图片URL转换为WebP格式
   * 仅对本地图片进行转换，外部URL保持原样
   */
  const convertToWebP = useCallback((url: string): string => {
    // 不转换外部URL、Data URL和已经是WebP的图片
    if (url.startsWith('http') || url.startsWith('data:') || url.endsWith('.webp')) {
      return url;
    }

    if (!checkWebPSupport()) {
      return url;
    }

    const webpExtensions = ['.jpg', '.jpeg', '.png'];
    const hasConvertibleExtension = webpExtensions.some(ext =>
      url.toLowerCase().endsWith(ext)
    );

    if (hasConvertibleExtension) {
      const baseUrl = url.replace(/\.(jpg|jpeg|png)$/i, '');
      return `${baseUrl}.webp`;
    }

    return url;
  }, [checkWebPSupport]);

  /**
   * 处理图片路径和格式
   */
  useEffect(() => {
    const srcString = String(src);
    const isLocalAsset = !srcString.startsWith('http') && !srcString.startsWith('data:');

    let processedSrc = isLocalAsset ? processImagePath(srcString) : srcString;

    if (enableWebP && shouldLoad) {
      processedSrc = convertToWebP(processedSrc);
    }

    setImageSrc(processedSrc);
  }, [src, enableWebP, shouldLoad, convertToWebP]);

  /**
   * 设置 Intersection Observer 实现智能懒加载
   */
  useEffect(() => {
    if (priority || loading === 'eager' || shouldLoad) {
      return;
    }

    const element = imgRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true);
            setShouldLoad(true);
            observerRef.current?.unobserve(element);
          }
        });
      },
      {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0.01,
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, loading, shouldLoad]);

  /**
   * 图片加载完成回调
   */
  const handleLoad = useCallback(() => {
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });
  }, []);

  /**
   * 图片加载错误回调
   * 如果WebP加载失败，尝试回退到原格式
   */
  const handleError = useCallback(() => {
    const srcString = String(src);

    if (imageSrc.endsWith('.webp') && !srcString.endsWith('.webp')) {
      const isLocalAsset = !srcString.startsWith('http') && !srcString.startsWith('data:');
      const originalSrc = isLocalAsset ? processImagePath(srcString) : srcString;
      setImageSrc(originalSrc);
    } else {
      setIsError(true);
    }
  }, [imageSrc, src]);

  // 生成默认的SVG占位符
  const defaultPlaceholder = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="${width || 400}" height="${height || 300}" viewBox="0 0 ${width || 400} ${height || 300}"%3E%3Crect width="${width || 400}" height="${height || 300}" fill="%23f3f4f6"/%3E%3C/svg%3E`;

  const finalPlaceholder = placeholder || defaultPlaceholder;

  // 错误状态下的回退图片
  const errorPlaceholder = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="${width || 400}" height="${height || 300}" viewBox="0 0 ${width || 400} ${height || 300}"%3E%3Crect width="${width || 400}" height="${height || 300}" fill="%23fee2e2"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%23dc2626" text-anchor="middle" dominant-baseline="middle"%3E加载失败%3C/text%3E%3C/svg%3E`;

  const finalSrc = isError ? errorPlaceholder : (shouldLoad ? imageSrc : finalPlaceholder);

  const showBlurPlaceholder = blurDataURL && !isLoaded && !isError && shouldLoad;

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        borderRadius,
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    >
      {/* 模糊占位符 - 渐进式加载效果 */}
      {showBlurPlaceholder && (
        <div
          className="absolute inset-0 z-10 transition-opacity duration-500"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: objectFit,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: isLoaded ? 'blur(0px)' : 'blur(20px)',
            opacity: isLoaded ? 0 : 1,
            transform: isLoaded ? 'scale(1)' : 'scale(1.1)',
          }}
        />
      )}

      {/* 骨架屏加载动画 - 在没有模糊占位符时显示 */}
      {!blurDataURL && !isLoaded && shouldLoad && !isError && (
        <div
          className="absolute inset-0 z-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse"
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      )}

      {/* 实际图片 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full transition-all duration-500"
        style={{
          objectFit,
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'scale(1)' : 'scale(1.05)',
          willChange: isLoaded ? 'auto' : 'transform, opacity',
        }}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        crossOrigin="anonymous"
        decoding={priority ? 'sync' : 'async'}
      />

      {/* 错误提示覆盖层 */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-20">
          <div className="text-center">
            <svg
              className="w-8 h-8 mx-auto mb-2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs text-muted-foreground">图片加载失败</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 生成图片的模糊占位符
 */
export async function generateBlurPlaceholder(
  src: string,
  width: number = 16
): Promise<string> {
  return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width}"%3E%3Crect width="100%25" height="100%25" fill="%23f3f4f6"/%3E%3C/svg%3E`;
}
