'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { categories } from '@/setting/blogSetting';
import { calculateReadingTime } from '@/lib/utils';

interface ArticleMetadata {
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  readTime: number;
}

interface MetadataFormProps {
  metadata: ArticleMetadata;
  onChange: (metadata: ArticleMetadata) => void;
  content: string;
}

/**
 * 文章元数据编辑表单组件
 */
export default function MetadataForm({ metadata, onChange, content }: MetadataFormProps) {
  const [tagInput, setTagInput] = useState('');

  /**
   * 计算阅读时间
   */
  useEffect(() => {
    if (content && !metadata.readTime) {
      const readTime = calculateReadingTime(content);
      onChange({ ...metadata, readTime });
    }
  }, [content, metadata.readTime, onChange, metadata]);

  /**
   * 更新字段值
   */
  const updateField = (field: keyof ArticleMetadata, value: any) => {
    onChange({ ...metadata, [field]: value });
  };

  /**
   * 添加标签
   */
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !metadata.tags.includes(trimmedTag)) {
      updateField('tags', [...metadata.tags, trimmedTag]);
      setTagInput('');
    }
  };

  /**
   * 删除标签
   */
  const removeTag = (tagToRemove: string) => {
    updateField('tags', metadata.tags.filter(tag => tag !== tagToRemove));
  };

  /**
   * 处理标签输入回车事件
   */
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          📝 文章标题
        </label>
        <input
          type="text"
          value={metadata.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="请输入文章标题"
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
      </div>

      {/* 日期和分类 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            📅 发布日期
          </label>
          <input
            type="date"
            value={metadata.date}
            onChange={(e) => updateField('date', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            📂 文章分类
          </label>
          <select
            value={metadata.category}
            onChange={(e) => updateField('category', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          >
            {categories.filter(cat => cat !== 'all').map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 标签 */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          🏷️ 文章标签
        </label>
        <div className="space-y-2">
          {/* 已添加的标签 */}
          {metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-primary/60 hover:text-primary transition-colors"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>
          )}

          {/* 标签输入 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="输入标签后按回车添加"
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={!tagInput.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              添加
            </button>
          </div>
        </div>
      </div>

      {/* 摘要 */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          📄 文章摘要
        </label>
        <textarea
          value={metadata.excerpt}
          onChange={(e) => updateField('excerpt', e.target.value)}
          placeholder="请输入文章摘要，显示在文章列表中"
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
        />
      </div>

      {/* 阅读时间 */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ⏱️ 预计阅读时间（分钟）
        </label>
        <input
          type="number"
          min="1"
          max="999"
          value={metadata.readTime || ''}
          onChange={(e) => updateField('readTime', parseInt(e.target.value) || 0)}
          placeholder="自动计算或手动输入"
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
        {content && (
          <p className="text-xs text-muted-foreground mt-1">
            基于当前内容计算：约 {calculateReadingTime(content)} 分钟
          </p>
        )}
      </div>

      {/* 状态信息 */}
      <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>状态检查：</span>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={metadata.title ? 'text-green-500' : 'text-red-500'}>
                {metadata.title ? '✓' : '✗'} 标题
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={content.length > 0 ? 'text-green-500' : 'text-red-500'}>
                {content.length > 0 ? '✓' : '✗'} 内容
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={metadata.category ? 'text-green-500' : 'text-red-500'}>
                {metadata.category ? '✓' : '✗'} 分类
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}