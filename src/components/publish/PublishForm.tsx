'use client';

import React, { useState, useEffect, ComponentProps } from 'react';
import { motion } from 'motion/react';
import { useBackgroundStyle } from '@/hooks/useBackgroundStyle';
import { categories } from '@/setting/blogSetting';
import LazyMarkdown from '@/components/LazyMarkdown';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FormData {
  title: string;
  date: string;
  category: string;
  tags: string;
  excerpt: string;
  content: string;
  readTime: string;
  author: string;
}

export default function PublishForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: categories[1] || '技术',
    tags: '',
    excerpt: '',
    content: '',
    readTime: '5',
    author: 'Unknown'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const { isBackgroundEnabled } = useBackgroundStyle('blogs');
  const [isDark, setIsDark] = useState(false);

  // 监听主题变化
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

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

  // Markdown格式控制函数
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const newText = formData.content.substring(0, start) + before + selectedText + after + formData.content.substring(end);
    
    setFormData(prev => ({ ...prev, content: newText }));
    
    // 恢复光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const insertLink = () => {
    const url = prompt('请输入链接地址:');
    const text = prompt('请输入链接文字:');
    if (url && text) {
      insertMarkdown(`[${text}](${url})`);
    }
  };

  const insertImage = () => {
    const url = prompt('请输入图片地址:');
    const alt = prompt('请输入图片描述:');
    if (url) {
      insertMarkdown(`![${alt || '图片'}](${url})`);
    }
  };

  // 语言标准化函数
  const normalizeLanguage = (language: string): string => {
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'cpp': 'c++',
      'c++': 'cpp',
      'csharp': 'c#',
      'c#': 'csharp',
      'rb': 'ruby',
      'go': 'golang',
      'rs': 'rust',
      'sh': 'bash',
      'yml': 'yaml',
      'json': 'json',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'less': 'less',
      'md': 'markdown',
      'sql': 'sql',
      'vim': 'vim',
      'dockerfile': 'dockerfile',
      'makefile': 'makefile',
      'nginx': 'nginx',
      'apache': 'apache',
      'xml': 'xml',
      'php': 'php',
      'java': 'java',
      'kotlin': 'kotlin',
      'swift': 'swift',
      'objective-c': 'objective-c',
      'dart': 'dart',
      'flutter': 'dart',
      'vue': 'vue',
      'react': 'jsx',
      'jsx': 'jsx',
      'tsx': 'tsx',
      'svelte': 'svelte',
      'angular': 'typescript',
      'node': 'javascript',
      'express': 'javascript',
      'mongodb': 'javascript',
      'postgresql': 'sql',
      'mysql': 'sql',
      'redis': 'bash',
      'git': 'bash',
      'github-actions': 'yaml',
      'gitlab-ci': 'yaml',
      'docker-compose': 'yaml',
      'kubernetes': 'yaml',
      'terraform': 'hcl',
      'hcl': 'hcl',
      'puppet': 'puppet',
      'ansible': 'yaml',
      'vagrant': 'ruby',
      'shell': 'bash',
      'powershell': 'powershell',
      'cmd': 'dos',
      'batch': 'dos',
      'dos': 'dos'
    };
    
    const normalizedLang = language.toLowerCase().trim();
    return languageMap[normalizedLang] || normalizedLang;
  };

  // 获取语言显示名称
  const getLanguageDisplayName = (language: string): string => {
    const displayNames: { [key: string]: string } = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'java': 'Java',
      'c++': 'C++',
      'c#': 'C#',
      'ruby': 'Ruby',
      'go': 'Go',
      'rust': 'Rust',
      'php': 'PHP',
      'swift': 'Swift',
      'kotlin': 'Kotlin',
      'objective-c': 'Objective-C',
      'dart': 'Dart',
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'less': 'Less',
      'json': 'JSON',
      'xml': 'XML',
      'yaml': 'YAML',
      'sql': 'SQL',
      'bash': 'Bash',
      'powershell': 'PowerShell',
      'vim': 'Vim',
      'markdown': 'Markdown',
      'dockerfile': 'Dockerfile',
      'nginx': 'Nginx',
      'apache': 'Apache',
      'jsx': 'JSX',
      'tsx': 'TSX',
      'vue': 'Vue',
      'svelte': 'Svelte',
      'hcl': 'HCL',
      'dos': 'Batch'
    };
    
    return displayNames[language] || language.toUpperCase();
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
author: ${formData.author}
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

      setMessage('文章已提交到GitHub，请等待3-5分钟完成部署');
      // 重置表单
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        category: categories[1] || '技术',
        tags: '',
        excerpt: '',
        content: '',
        readTime: '5',
        author: 'Unknown'
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

      const authorFolder = formData.author || 'Unknown';
      const path = `src/content/blogs/${authorFolder}/${fileName}`;
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
      const authorFolder = formData.author || 'Unknown';
      const response = await fetch('/api/publish/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          content,
          path: `src/content/blogs/${authorFolder}/${fileName}`
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <label htmlFor="author" className="block text-sm font-medium mb-2 text-foreground">
              作者 *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="请输入作者名称"
            />
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
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="content" className="block text-sm font-medium text-foreground">
              文章内容 (Markdown) *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  isPreviewMode 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {isPreviewMode ? '编辑' : '预览'}
              </button>
            </div>
          </div>

          {/* Markdown 工具栏 */}
          {!isPreviewMode && (
            <div className="flex flex-wrap gap-2 mb-3 p-2 bg-muted/50 rounded-lg border">
              <button
                type="button"
                onClick={() => insertMarkdown('**', '**')}
                className="px-2 py-1 text-xs bg-background hover:bg-muted border rounded transition-colors"
                title="粗体"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('*', '*')}
                className="px-2 py-1 text-xs bg-background hover:bg-muted border rounded transition-colors italic"
                title="斜体"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('`', '`')}
                className="px-2 py-1 text-xs bg-background hover:bg-muted border rounded transition-colors font-mono"
                title="行内代码"
              >
                &lt;/&gt;
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('\n\n- ', '')}
                className="px-2 py-1 text-xs bg-background hover:bg-muted border rounded transition-colors"
                title="列表"
              >
                •
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('\n# ', '')}
                className="px-2 py-1 text-xs bg-background hover:bg-muted border rounded transition-colors"
                title="标题"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('\n## ', '')}
                className="px-2 py-1 text-xs bg-background hover:bg-muted border rounded transition-colors"
                title="二级标题"
              >
                H2
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-2 py-1 text-xs bg-background hover:bg-muted border rounded transition-colors"
                title="链接"
              >
                🔗
              </button>
              <button
                type="button"
                onClick={insertImage}
                className="px-2 py-1 text-xs bg-background hover:bg-muted border rounded transition-colors"
                title="图片"
              >
                🖼️
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('\n\n```\n', '\n```\n')}
                className="px-2 py-1 text-xs bg-background hover:bg-muted border rounded transition-colors font-mono"
                title="代码块"
              >
                { }
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('\n\n> ', '')}
                className="px-2 py-1 text-xs bg-background hover:bg-muted border rounded transition-colors"
                title="引用"
              >
                "
              </button>
            </div>
          )}

          {isPreviewMode ? (
            <div className="w-full px-4 py-3 border border-border rounded-lg bg-background min-h-[400px] max-h-[600px] overflow-y-auto">
              <LazyMarkdown
                content={formData.content}
                components={{
                  p({ children, ...props }: ComponentProps<any>) {
                    const childrenArray = React.Children.toArray(children);
                    
                    // 检查是否包含块级元素
                    const hasBlockElements = childrenArray.some(child => {
                      if (React.isValidElement(child)) {
                        if (typeof child.type === 'string') {
                          const blockElements = ['div', 'section', 'article', 'header', 'footer', 'nav', 'aside', 'main', 'figure', 'figcaption', 'blockquote', 'pre', 'table', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
                          return blockElements.includes(child.type);
                        }
                        if (typeof child.type === 'function' || typeof child.type === 'object') {
                          return true;
                        }
                      }
                      return false;
                    });
                    
                    if (hasBlockElements) {
                      return <>{children}</>;
                    }
                    
                    return (
                      <p className="my-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props}>
                        {children}
                      </p>
                    );
                  },
                  pre: ({ children, ...props }: ComponentProps<any>) => (
                    <pre {...props} className={`relative group my-6 rounded-lg text-sm p-0 overflow-hidden ${
                      isDark ? 'bg-gray-800 dark:bg-gray-900' : 'bg-gray-100 border border-gray-300'
                    }`}>
                      {children}
                    </pre>
                  ),
                  code({ inline, className, children, ...props }: {
                    inline?: boolean;
                    className?: string;
                    children?: React.ReactNode;
                    [key: string]: any;
                  }) {
                    // 提取纯文本内容
                    const getTextContent = (node: React.ReactNode): string => {
                      if (typeof node === 'string') return node;
                      if (typeof node === 'number') return String(node);
                      if (Array.isArray(node)) return node.map(getTextContent).join('');
                      if (node && typeof node === 'object' && 'props' in node) {
                        const reactElement = node as React.ReactElement<{ children?: React.ReactNode }>;
                        return getTextContent(reactElement.props.children);
                      }
                      return '';
                    };

                    const textContent = getTextContent(children);
                    const match = /language-(\w+)/.exec(className || '');
                    const rawLanguage = match ? match[1] : 'text';
                    const language = normalizeLanguage(rawLanguage);
                    const codeContent = textContent.replace(/\n$/, '');

                    // 智能判断行内代码
                    const hasLanguageClass = className && className.startsWith('language-');
                    const isShortContent = codeContent.length < 100 && !codeContent.includes('\n');
                    const isInlineCode = inline || (!hasLanguageClass && !className && isShortContent);

                    if (isInlineCode) {
                      return (
                        <code 
                          className="font-mono text-sm bg-accent/10 text-accent px-1.5 py-0.5 rounded-sm inline border border-accent/20 break-words" 
                          {...props}
                        >
                          {textContent}
                        </code>
                      );
                    }

                    return (
                      <div className="relative">
                        {/* 代码块头部 - 包含语言标签和复制按钮 */}
                        <div className={`flex justify-between items-center px-4 py-2 rounded-t-lg border-b ${
                          isDark 
                            ? 'bg-gray-650 border-gray-700 text-gray-300' 
                            : 'bg-gray-100 border-gray-300 text-gray-700'
                        }`}>
                          <span className="text-xs font-medium select-none">
                            {getLanguageDisplayName(language)}
                          </span>
                          <button
                            onClick={() => navigator.clipboard.writeText(codeContent)}
                            className={`p-1.5 rounded-md transition-colors duration-200 ${
                              isDark
                                ? 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
                                : 'text-gray-600 hover:text-gray-800 bg-gray-200 hover:bg-gray-300'
                            }`}
                            title="复制代码"
                          >
                            <ClipboardIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={isDark ? oneDark : oneLight}
                          language={language}
                          PreTag="code"
                          customStyle={{
                            margin: 0,
                            padding: '1.25rem',
                            backgroundColor: 'transparent',
                            borderRadius: '0 0 0.5rem 0.5rem',
                            fontSize: '0.875rem',
                            display: 'block',
                          }}
                          codeTagProps={{
                            style: {
                              fontFamily: 'var(--font-mono)',
                            },
                          }}
                        >
                          {codeContent}
                        </SyntaxHighlighter>
                      </div>
                    );
                  },
                  blockquote({ children }: ComponentProps<any>) {
                    return (
                      <blockquote className="border-l-4 border-primary bg-primary/5 p-4 my-4 rounded-r-lg">
                        <div className="flex items-start">
                          <div className="text-primary mr-2 text-lg">💡</div>
                          <div className="flex-1">{children}</div>
                        </div>
                      </blockquote>
                    );
                  },
                  table({ children }: ComponentProps<any>) {
                    return (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg">
                          {children}
                        </table>
                      </div>
                    );
                  },
                  thead({ children }: ComponentProps<any>) {
                    return (
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        {children}
                      </thead>
                    );
                  },
                }}
              />
            </div>
          ) : (
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
          )}
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