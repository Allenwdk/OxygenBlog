'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import LazyMarkdown from '@/components/LazyMarkdown';
import { formatBlogDate } from '@/lib/utils';
import { copyrightConfig, getCCLicenseInfo, EndWord } from '@/setting/blogSetting';

interface ArticleMetadata {
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  readTime: number;
}

interface PreviewPanelProps {
  content: string;
  metadata: ArticleMetadata;
}

/**
 * 文章预览组件
 * 显示文章的最终效果
 */
export default function PreviewPanel({ content, metadata }: PreviewPanelProps) {
  const [showFrontmatter, setShowFrontmatter] = useState(false);

  /**
   * 生成 Frontmatter
   */
  const generateFrontmatter = () => {
    const frontmatter = `---
title: ${metadata.title}
date: ${metadata.date}
category: ${metadata.category}
tags: [${metadata.tags.map(tag => `"${tag}"`).join(', ')}]
readTime: ${metadata.readTime}
excerpt: "${metadata.excerpt}"
---`;

    return frontmatter;
  };

  /**
   * 完整的文章内容（包含 frontmatter）
   */
  const fullContent = `${generateFrontmatter()}

${content}`;

  /**
   * 检查是否有足够的内容显示
   */
  const hasEnoughContent = metadata.title && content.trim().length > 0;

  if (!hasEnoughContent) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-6xl mb-4">👀</div>
          <p className="text-lg mb-2">请先填写文章标题和内容</p>
          <p className="text-sm">在左侧编辑器和元数据表单中开始创作</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-none px-6 py-6">
        {/* 元数据头部 */}
        <motion.div 
          className="mb-8 pb-6 border-b border-border"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 标题 */}
          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            {metadata.title}
          </h1>

          {/* 文章信息 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              📅 {formatBlogDate(metadata.date)}
            </span>
            <span className="flex items-center gap-1">
              📂 {metadata.category}
            </span>
            <span className="flex items-center gap-1">
              ⏱️ {metadata.readTime} 分钟阅读
            </span>
            {metadata.tags.length > 0 && (
              <span className="flex items-center gap-1">
                🏷️ {metadata.tags.map(tag => `#${tag}`).join(' ')}
              </span>
            )}
          </div>

          {/* 摘要 */}
          {metadata.excerpt && (
            <div className="bg-muted/30 rounded-lg p-4 text-muted-foreground border-l-4 border-primary">
              <p className="italic">{metadata.excerpt}</p>
            </div>
          )}
        </motion.div>

        {/* 文章内容 */}
        <motion.div 
          className="prose prose-lg dark:prose-invert max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LazyMarkdown content={content} />
        </motion.div>

        {/* 文章结尾 */}
        {content.trim().length > 0 && (
          <motion.div 
            className="mt-12 pt-6 border-t border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* 结尾语 */}
            <div className="text-center mb-6">
              <p className="text-muted-foreground text-lg italic">
                {EndWord}
              </p>
            </div>

            {/* 版权声明 */}
            {copyrightConfig.showCopyright && (
              <div className="bg-muted/20 rounded-lg p-4 text-sm text-muted-foreground">
                <h4 className="font-semibold text-foreground mb-2">版权声明</h4>
                <p className="mb-2">
                  本文由 <strong>{copyrightConfig.author}</strong> 首发于 <strong>{copyrightConfig.siteName}</strong>。
                </p>
                <p className="mb-2">
                  采用 
                  <a 
                    href={getCCLicenseInfo(copyrightConfig.defaultLicense).url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline mx-1"
                  >
                    {getCCLicenseInfo(copyrightConfig.defaultLicense).name}
                  </a> 
                  协议共享。
                </p>
                <p>
                  原文链接：<span className="break-all">{copyrightConfig.siteUrl}/blogs/{metadata.title.toLowerCase().replace(/\s+/g, '-')}</span>
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Frontmatter 预览切换 */}
        <motion.div 
          className="mt-8 pt-6 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button
            onClick={() => setShowFrontmatter(!showFrontmatter)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            📄 {showFrontmatter ? '隐藏' : '显示'} Frontmatter 配置
            <motion.span
              animate={{ rotate: showFrontmatter ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          </button>

          <motion.div
            initial={false}
            animate={{ 
              height: showFrontmatter ? 'auto' : 0,
              opacity: showFrontmatter ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 bg-muted/20 rounded-lg p-4 font-mono text-sm">
              <pre className="whitespace-pre-wrap text-foreground">
                {generateFrontmatter()}
              </pre>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}