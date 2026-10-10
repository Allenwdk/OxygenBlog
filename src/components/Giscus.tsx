'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface GiscusProps {
  className?: string;
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  mappingSpecific?: string | number;
  /**
   * mapping 为 'specific' 时使用的讨论标题
   * giscus 只认 data-term，不会读取 data-mapping-specific
   */
  term?: string;
  /** 讨论分类名，默认 Announcements */
  category?: string;
  /** 讨论分类 ID，需与 category 配套 */
  categoryId?: string;
}

export function Giscus({
  className = '',
  mapping = 'pathname',
  mappingSpecific,
  term,
  category = 'Announcements',
  categoryId = 'DIC_kwDOP18nO84Cv1_o',
}: GiscusProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const ref = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState(isDark ? 'dark_dimmed' : 'light');

  useEffect(() => {
    setTheme(isDark ? 'dark_dimmed' : 'light');

    // 如果已经存在giscus脚本，先移除
    const existingScript = document.querySelector('script[src*="giscus"]');
    if (existingScript) {
      existingScript.remove();
    }

    // 清空容器
    if (ref.current) {
      ref.current.innerHTML = '';
    }

    // 创建新的giscus脚本
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'Allenwdk/OxygenBlog');
    script.setAttribute('data-repo-id', 'R_kgDOP18nOw');
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    if (term !== undefined) {
      script.setAttribute('data-term', term);
    }
    if (mappingSpecific !== undefined) {
      script.setAttribute('data-mapping-specific', String(mappingSpecific));
    }
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');

    if (ref.current) {
      ref.current.appendChild(script);
    }

    return () => {
      // 清理函数
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [theme, mapping, mappingSpecific, term, category, categoryId]);

  return (
    <div className={`giscus-container ${className}`}>
      <div ref={ref} className="w-full" />
    </div>
  );
}
