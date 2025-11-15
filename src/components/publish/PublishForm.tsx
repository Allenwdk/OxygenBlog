'use client';

import { useState } from 'react';
import { categories } from '@/setting/blogSetting';

interface FormData {
  title: string;
  date: string;
  category: string;
  tags: string;
  excerpt: string;
  content: string;
  readTime: string;
}

export default function PublishForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: categories[1] || '技术',
    tags: '',
    excerpt: '',
    content: '',
    readTime: '5'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateFrontMatter = () => {
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    const frontMatter = `---
title: ${formData.title}
date: ${formData.date}
category: ${formData.category}
tags: [${tagsArray.join(', ')}]
readTime: ${formData.readTime}
excerpt: ${formData.excerpt}
---

`;
    return frontMatter;
  };

  const generateFileName = () => {
    const sanitizedTitle = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return `${sanitizedTitle}.md`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const fullContent = generateFrontMatter() + formData.content;
      const fileName = generateFileName();

      // 检测是否在 GitHub Pages 环境
      const isGitHubPages = window.location.hostname.includes('github.io');

      if (isGitHubPages) {
        // GitHub Pages 环境 - 使用 API 提交到仓库
        await submitToGitHub(fileName, fullContent);
      } else {
        // 本地环境 - 保存到本地目录
        await saveToLocal(fileName, fullContent);
      }

      setMessage('文章发布成功！');
      // 重置表单
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        category: categories[1] || '技术',
        tags: '',
        excerpt: '',
        content: '',
        readTime: '5'
      });
    } catch (error) {
      setMessage(`发布失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitToGitHub = async (fileName: string, content: string) => {
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          content,
          path: `src/content/blogs/${fileName}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'GitHub 提交失败');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error(`GitHub 提交错误: ${error instanceof Error ? error.message : '网络请求失败'}`);
    }
  };

  const saveToLocal = async (fileName: string, content: string) => {
    try {
      const response = await fetch('/api/publish/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          content,
          path: `src/content/blogs/${fileName}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '本地保存失败');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error(`本地保存错误: ${error instanceof Error ? error.message : '网络请求失败'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            文章标题 *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="请输入文章标题"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-2">
            发布日期 *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            分类 *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.slice(1).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            标签
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="React, TypeScript, Next.js"
          />
        </div>

        <div>
          <label htmlFor="readTime" className="block text-sm font-medium mb-2">
            阅读时间(分钟)
          </label>
          <input
            type="number"
            id="readTime"
            name="readTime"
            value={formData.readTime}
            onChange={handleInputChange}
            min="1"
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
          摘要 *
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="请输入文章摘要，将显示在文章卡片上"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          文章内容 (Markdown) *
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          rows={20}
          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          placeholder="请输入 Markdown 格式的文章内容..."
        />
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '发布中...' : '发布文章'}
        </button>
      </div>
    </form>
  );
}