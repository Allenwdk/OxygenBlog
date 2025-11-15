'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useBackgroundStyle } from '@/hooks/useBackgroundStyle';
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

  const { isBackgroundEnabled } = useBackgroundStyle('blogs');

  /**
   * 获取毛玻璃样式类名
   */
  const getGlassStyle = (baseStyle: string) => {
    if (isBackgroundEnabled) {
      return `${baseStyle} backdrop-blur-md bg-card/90 border-border shadow-lg supports-[backdrop-filter]:bg-card/75`;
    }
    return `bg-card ${baseStyle} border-border`;
  };

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
      // 获取GitHub配置
      const token = process.env.NEXT_PUBLIC_BLOG_GITHUB_TOKEN;
      const owner = process.env.NEXT_PUBLIC_BLOG_GITHUB_OWNER;
      const repo = process.env.NEXT_PUBLIC_BLOG_GITHUB_REPO;
      const branch = process.env.NEXT_PUBLIC_BLOG_GITHUB_BRANCH || 'main';

      if (!token || !owner || !repo) {
        throw new Error('GitHub配置不完整，请检查环境变量');
      }

      const path = `src/content/blogs/${fileName}`;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      
      // 先获取文件SHA（如果存在）
      let sha = '';
      try {
        const getResponse = await fetch(`${apiUrl}?ref=${branch}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Blog-Platform/1.0'
          }
        });
        
        if (getResponse.ok) {
          const fileData = await getResponse.json();
          sha = fileData.sha;
        }
      } catch (error) {
        // 文件不存在，继续创建
      }

      // 创建/更新文件
      const putResponse = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Blog-Platform/1.0'
        },
        body: JSON.stringify({
          message: `发布文章: ${fileName}`,
          content: btoa(unescape(encodeURIComponent(content))), // Base64编码
          branch: branch,
          ...(sha && { sha })
        })
      });

      if (!putResponse.ok) {
        let errorMessage = `GitHub API错误: ${putResponse.status}`;
        try {
          const errorData = await putResponse.json();
          errorMessage += ` - ${errorData.message}`;
        } catch {
          const errorText = await putResponse.text();
          errorMessage += ` - ${errorText.substring(0, 200)}`;
        }
        throw new Error(errorMessage);
      }

      const result = await putResponse.json();
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
    <motion.form 
      onSubmit={handleSubmit} 
      className={getGlassStyle("rounded-lg shadow-md overflow-hidden border p-6 md:p-8 space-y-6")}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 基本信息区域 */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📋</span>
          <h2 className="text-xl font-semibold text-foreground">基本信息</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2 text-foreground">
              文章标题 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="请输入文章标题"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2 text-foreground">
              发布日期 *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2 text-foreground">
              分类 *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            >
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2 text-foreground">
              标签
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="React, TypeScript, Next.js"
            />
          </div>

          <div>
            <label htmlFor="readTime" className="block text-sm font-medium mb-2 text-foreground">
              阅读时间(分钟)
            </label>
            <input
              type="number"
              id="readTime"
              name="readTime"
              value={formData.readTime}
              onChange={handleInputChange}
              min="1"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📝</span>
          <h2 className="text-xl font-semibold text-foreground">文章内容</h2>
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-2 text-foreground">
            摘要 *
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
            placeholder="请输入文章摘要，将显示在文章卡片上"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2 text-foreground">
            文章内容 (Markdown) *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={20}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-mono text-sm resize-none"
            placeholder="请输入 Markdown 格式的文章内容..."
          />
        </div>
      </div>

      {/* 消息提示 */}
      {message && (
        <motion.div 
          className={`p-4 rounded-lg border ${message.includes('成功') ? 'bg-green-100/50 text-green-700 border-green-200' : 'bg-red-100/50 text-red-700 border-red-200'}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <span>{message.includes('成功') ? '✅' : '❌'}</span>
            <span>{message}</span>
          </div>
        </motion.div>
      )}

      {/* 提交按钮 */}
      <div className="flex justify-end pt-4">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              发布中...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>🚀</span>
              发布文章
            </span>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}