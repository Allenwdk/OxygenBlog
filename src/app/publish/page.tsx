"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { useBackgroundStyle } from '@/hooks/useBackgroundStyle';
import { categories } from '@/setting/blogSetting';
import { Meteors } from '@/components/magicui/meteors';
import { 
  DocumentTextIcon, 
  EyeIcon, 
  CodeBracketIcon,
  PhotoIcon,
  LinkIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

/**
 * 发布页面组件
 * 提供文章编写、预览和导出功能
 */
export default function PublishPage() {
  const { containerStyle, sectionStyle } = useBackgroundStyle('home');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('技术');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  // 工具栏功能
  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = '';
    switch (syntax) {
      case 'bold':
        newText = `**${selectedText || placeholder}**`;
        break;
      case 'italic':
        newText = `*${selectedText || placeholder}*`;
        break;
      case 'code':
        newText = `\`${selectedText || placeholder}\``;
        break;
      case 'codeblock':
        newText = `\`\`\`\n${selectedText || '代码内容'}\n\`\`\``;
        break;
      case 'heading1':
        newText = `# ${selectedText || placeholder}`;
        break;
      case 'heading2':
        newText = `## ${selectedText || placeholder}`;
        break;
      case 'heading3':
        newText = `### ${selectedText || placeholder}`;
        break;
      case 'list':
        newText = `- ${selectedText || '列表项'}`;
        break;
      case 'link':
        newText = `[${selectedText || '链接文本'}](https://example.com)`;
        break;
      case 'image':
        newText = `![${selectedText || '图片描述'}](图片URL)`;
        break;
      default:
        newText = selectedText || placeholder;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    
    // 重新聚焦并设置光标位置
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 生成文章信息对象
  const generateArticleData = () => {
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const today = new Date().toISOString().split('T')[0];
    
    return {
      title,
      excerpt,
      date: today,
      category,
      tags: tagArray,
      readTime: Math.ceil(content.length / 1000) + 1, // 简单的阅读时间估算
      content
    };
  };

  // 导出为Markdown文件
  const exportAsMarkdown = () => {
    const articleData = generateArticleData();
    const markdownContent = `---
title: "${articleData.title}"
excerpt: "${articleData.excerpt}"
date: "${articleData.date}"
category: "${articleData.category}"
tags: [${articleData.tags.map(tag => `"${tag}"`).join(', ')}]
readTime: ${articleData.readTime}
---

# ${articleData.title}

${content}
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || '未命名文章'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 复制到剪贴板
  const copyToClipboard = async () => {
    const articleData = generateArticleData();
    const markdownContent = `---
title: "${articleData.title}"
excerpt: "${articleData.excerpt}"
date: "${articleData.date}"
category: "${articleData.category}"
tags: [${articleData.tags.map(tag => `"${tag}"`).join(', ')}]
readTime: ${articleData.readTime}
---

# ${articleData.title}

${content}
`;
    
    try {
      await navigator.clipboard.writeText(markdownContent);
      alert('文章已复制到剪贴板！');
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制');
    }
  };

  const isFormValid = title.trim() && content.trim();

  return (
    <div className={containerStyle.className} style={containerStyle.style}>
      <Meteors />
      <section className={`${sectionStyle.className} min-h-screen pt-20 pb-10`} style={sectionStyle.style}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              文章发布
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              创作你的下一篇文章
            </p>
          </motion.div>

          {/* 主内容区域 */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            
            {/* 工具栏 */}
            {!isPreview && (
              <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => insertMarkdown('heading1', '一级标题')}
                    className="px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                  >
                    H1
                  </button>
                  <button
                    onClick={() => insertMarkdown('heading2', '二级标题')}
                    className="px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                  >
                    H2
                  </button>
                  <button
                    onClick={() => insertMarkdown('heading3', '三级标题')}
                    className="px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                  >
                    H3
                  </button>
                  <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                  <button
                    onClick={() => insertMarkdown('bold', '粗体文本')}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    onClick={() => insertMarkdown('italic', '斜体文本')}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <em>I</em>
                  </button>
                  <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                  <button
                    onClick={() => insertMarkdown('code', '代码')}
                    className="p-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <CodeBracketIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('list', '列表项')}
                    className="p-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <ListBulletIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('link', '链接文本')}
                    className="p-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('image', '图片描述')}
                    className="p-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <PhotoIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 内容区域 */}
            <div className="p-6">
              {!isPreview ? (
                // 编辑模式
                <div className="space-y-6">
                  {/* 标题和摘要 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        文章标题 *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="输入文章标题..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        分类
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {categories.slice(1).map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      文章摘要
                    </label>
                    <input
                      type="text"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="输入文章摘要..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      标签（用逗号分隔）
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="如：TypeScript, React, 前端开发"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      文章内容 *
                    </label>
                    <textarea
                      id="content-textarea"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={20}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                      placeholder="在此输入你的文章内容（支持Markdown语法）..."
                    />
                  </div>
                </div>
              ) : (
                // 预览模式
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {title && (
                    <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                      {title}
                    </h1>
                  )}
                  {excerpt && (
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 italic">
                      {excerpt}
                    </p>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                    <div className="whitespace-pre-wrap text-gray-900 dark:text-white">
                      {content || '暂无内容'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 底部操作栏 */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isPreview ? (
                      <>
                        <DocumentTextIcon className="w-4 h-4" />
                        编辑
                      </>
                    ) : (
                      <>
                        <EyeIcon className="w-4 h-4" />
                        预览
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    disabled={!isFormValid}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    复制内容
                  </button>
                  <button
                    onClick={exportAsMarkdown}
                    disabled={!isFormValid}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    导出Markdown
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 提示信息 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              使用说明
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• 本页面提供文章编写和预览功能</li>
              <li>• 支持完整的 Markdown 语法</li>
              <li>• 可以导出为 .md 文件或复制到剪贴板</li>
              <li>• 导出的文件需要手动添加到项目的 content/blogs 目录中</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
}