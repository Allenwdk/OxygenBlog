'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import path from 'path';
import matter from 'gray-matter';

interface ArticleMetadata {
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  readTime: number;
}

interface FileSaveHandlerProps {
  content: string;
  metadata: ArticleMetadata;
  onSave?: (isSaving: boolean) => void;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

/**
 * 生成文章slug
 * @param title - 文章标题
 * @returns 格式化后的slug
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 将空格、下划线、连字符替换为单连字符
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
}

/**
 * 生成完整的markdown内容（包含frontmatter）
 * @param content - 原始内容
 * @param metadata - 文章元数据
 * @returns 完整的markdown字符串
 */
function generateMarkdownContent(content: string, metadata: ArticleMetadata): string {
  const frontmatter = `---
title: ${metadata.title}
date: ${metadata.date}
category: ${metadata.category}
tags: [${metadata.tags.map(tag => `"${tag}"`).join(', ')}]
readTime: ${metadata.readTime}
excerpt: "${metadata.excerpt}"
---`;

  return `${frontmatter}

${content}`;
}

/**
 * 文件保存处理组件
 * 处理文章保存到文件系统的逻辑
 */
export default function FileSaveHandler({ 
  content, 
  metadata, 
  onSave, 
  onSuccess, 
  onError 
}: FileSaveHandlerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 保存文章为草稿
   */
  const saveAsDraft = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    onSave?.(true);
    
    try {
      const response = await fetch('/api/blogs/save-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: generateMarkdownContent(content, metadata),
          metadata: {
            ...metadata,
            slug: generateSlug(metadata.title),
            isDraft: true
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess?.(`草稿已保存: ${metadata.title}`);
      } else {
        throw new Error(result.error || '保存失败');
      }
    } catch (error) {
      console.error('保存草稿失败:', error);
      onError?.(`保存草稿失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsSubmitting(false);
      onSave?.(false);
    }
  };

  /**
   * 发布文章
   */
  const publishArticle = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    onSave?.(true);
    
    try {
      const response = await fetch('/api/blogs/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: generateMarkdownContent(content, metadata),
          metadata: {
            ...metadata,
            slug: generateSlug(metadata.title),
            isDraft: false
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess?.(`文章已发布: ${metadata.title}`);
      } else {
        throw new Error(result.error || '发布失败');
      }
    } catch (error) {
      console.error('发布文章失败:', error);
      onError?.(`发布文章失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsSubmitting(false);
      onSave?.(false);
    }
  };

  /**
   * 验证表单数据
   */
  const validateForm = (): boolean => {
    if (!metadata.title.trim()) {
      onError?.('请填写文章标题');
      return false;
    }
    
    if (!content.trim()) {
      onError?.('请填写文章内容');
      return false;
    }
    
    if (!metadata.category.trim()) {
      onError?.('请选择文章分类');
      return false;
    }
    
    return true;
  };

  /**
   * 导出为markdown文件
   */
  const exportAsMarkdown = () => {
    if (!validateForm()) return;

    const markdownContent = generateMarkdownContent(content, metadata);
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const filename = `${generateSlug(metadata.title)}.md`;
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    onSuccess?.(`已导出文件: ${filename}`);
  };

  /**
   * 获取文章统计信息
   */
  const getArticleStats = () => {
    const contentLength = content.trim().length;
    const wordCount = content.trim().split(/\s+/).length;
    const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 300)); // 按每分钟300字计算
    
    return {
      contentLength,
      wordCount,
      estimatedReadTime
    };
  };

  const stats = getArticleStats();

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 文章统计 */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">📊 文章统计</h3>
        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{stats.contentLength}</div>
            <div>字符数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{stats.wordCount}</div>
            <div>词数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{stats.estimatedReadTime}</div>
            <div>预估阅读(分钟)</div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-3">
        {/* 主要操作 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 保存草稿按钮 */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveAsDraft}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
            ) : (
              <span>💾</span>
            )}
            保存草稿
          </motion.button>

          {/* 发布文章按钮 */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={publishArticle}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <span>🚀</span>
            )}
            发布文章
          </motion.button>
        </div>

        {/* 导出选项 */}
        <div className="pt-2 border-t border-border">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportAsMarkdown}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors disabled:opacity-50"
          >
            <span>📄</span>
            导出为Markdown文件
          </motion.button>
        </div>
      </div>

      {/* 文章预览信息 */}
      <div className="bg-muted/10 rounded-lg p-3 text-xs text-muted-foreground">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">标题:</span> {metadata.title || '未设置'}
          </div>
          <div>
            <span className="font-medium">分类:</span> {metadata.category || '未选择'}
          </div>
          <div>
            <span className="font-medium">日期:</span> {metadata.date || format(new Date(), 'yyyy-MM-dd', { locale: zhCN })}
          </div>
          <div>
            <span className="font-medium">标签:</span> {metadata.tags.length > 0 ? metadata.tags.join(', ') : '无'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}