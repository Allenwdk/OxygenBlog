'use client';

import React, { useState, useRef, useCallback } from 'react';

interface ImageItem {
  name: string;
  data: string;
}

interface MomentFormProps {
  onPublishSuccess?: () => void;
}

export default function MomentForm({ onPublishSuccess }: MomentFormProps) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadingImages, setIsReadingImages] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [imageCount, setImageCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(() => {
    if (isReadingImages) return;
    fileInputRef.current?.click();
  }, [isReadingImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsReadingImages(true);
    let loadedCount = 0;
    const newImages: ImageItem[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        newImages.push({
          name: file.name,
          data: base64Data,
        });
        loadedCount++;

        if (loadedCount === files.length) {
          setImages((prev) => [...prev, ...newImages]);
          setImageCount(prev => prev + files.length);
          setIsReadingImages(false);
          setMessage(`已添加 ${files.length} 张图片`);
          setMessageType('success');
        }
      };
      reader.onerror = () => {
        setIsReadingImages(false);
        setMessage(`图片 "${file.name}" 读取失败，请重试`);
        setMessageType('error');
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageCount((prev) => Math.max(0, prev - 1));
  };

  /**
   * GitHub Pages 环境：直接调用 GitHub API 推送文件到仓库
   */
  const submitToGitHub = async (authorStr: string, contentStr: string, imgs: ImageItem[]) => {
    const token = process.env.NEXT_PUBLIC_BLOG_GITHUB_TOKEN;
    const owner = process.env.NEXT_PUBLIC_BLOG_GITHUB_OWNER;
    const repo = process.env.NEXT_PUBLIC_BLOG_GITHUB_REPO;
    const branch = process.env.NEXT_PUBLIC_BLOG_GITHUB_BRANCH || 'main';

    if (!token || !owner || !repo) {
      throw new Error('GitHub 配置不完整，请检查环境变量');
    }

    // 生成时间戳和目录路径
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    const dirPath = `src/content/moments/${authorStr}/${timestamp}`;
    const contentFilePath = `${dirPath}/content.md`;

    // 生成 front matter + 正文内容 + 图片引用
    const isoDate = new Date().toISOString();
    let imageTags = '';
    for (const image of imgs) {
      if (image.data.startsWith('data:')) {
        imageTags += `<img src="${image.data}" alt="${image.name}" />\n`;
      }
    }

    const fullContent = `---
author: ${authorStr}
date: ${isoDate}
---

${contentStr}${imageTags}`;

    const commitMessage = `发布动态: ${authorStr} - ${timestamp}`;

    // 上传 content.md
    await uploadFileToGitHub(token, owner, repo, branch, contentFilePath, fullContent, commitMessage);

    // 上传图片（如果有）
    for (const image of imgs) {
      const imageName = image.name || 'image.png';
      const imagePath = `${dirPath}/${imageName}`;
      // Remove the data URL prefix before base64 encoding
      const base64Data = image.data.split(',')[1] || image.data;
      await uploadFileToGitHub(token, owner, repo, branch, imagePath, base64Data, commitMessage, 'base64');
    }

    return { path: contentFilePath, timestamp };
  };

  /**
   * 通过 GitHub API 上传文件到仓库
   */
  async function uploadFileToGitHub(
    token: string,
    owner: string,
    repo: string,
    branch: string,
    filePath: string,
    content: string,
    message: string,
    encoding: 'utf-8' | 'base64' = 'utf-8'
  ): Promise<void> {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    // 先获取文件 SHA（如果已存在）
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
    } catch {
      // 文件不存在，继续创建
    }

    let contentEncoded: string;
    if (encoding === 'base64') {
      // Content is already base64-encoded (e.g. image data), use as-is
      contentEncoded = content;
    } else {
      // Plain text: convert to UTF-8 then base64 for GitHub API
      contentEncoded = btoa(unescape(encodeURIComponent(content)));
    }

    const putResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Blog-Platform/1.0'
      },
      body: JSON.stringify({
        message,
        content: contentEncoded,
        branch,
        ...(sha && { sha })
      })
    });

    if (!putResponse.ok) {
      let errorMessage = `GitHub API 错误: ${putResponse.status}`;
      try {
        const errorData = await putResponse.json();
        errorMessage += ` - ${errorData.message}`;
      } catch {
        const errorText = await putResponse.text();
        errorMessage += ` - ${errorText.substring(0, 200)}`;
      }
      throw new Error(errorMessage);
    }
  };

  /**
   * 本地环境：保存到本地目录
   */
  const saveToLocal = async (authorStr: string, contentStr: string, imgs: ImageItem[]) => {
    const response = await fetch('/api/moments/local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: authorStr, content: contentStr, images: imgs })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '本地保存失败');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !content.trim()) {
      setMessage('请填写作者名和内容');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const authorStr = author.trim();
      const contentStr = content.trim();

      // 优先尝试本地保存，如果 API 路由不可用（静态导出 / 405），自动降级到直传 GitHub
      let success = false;
      try {
        await saveToLocal(authorStr, contentStr, images);
        success = true;
      } catch {
        // Local API not available (static export), fall back to direct GitHub upload
      }

      if (!success) {
        await submitToGitHub(authorStr, contentStr, images);
      }

      setMessage('动态发布成功！');
      setMessageType('success');

      setAuthor('');
      setContent('');
      setImages([]);
      setImageCount(0);

      if (onPublishSuccess) {
        onPublishSuccess();
      }

      // Only auto-dismiss errors; success messages persist until dismissed
      if (messageType === 'error') {
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage(`发布失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Character count
  const charCount = content.length;
  const maxChars = 1000;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden"
    >
      {/* Author input */}
      <div className="px-4 pt-4 pb-2">
        <input
          type="text"
          id="moment-author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          maxLength={20}
          className="w-full text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground/50 text-foreground"
          placeholder="你的名字"
        />
      </div>

      {/* Content textarea */}
      <div className="px-4 pb-2">
        <textarea
          id="moment-content"
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= maxChars) {
              setContent(e.target.value);
            }
          }}
          required
          rows={3}
          className="w-full text-[15px] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40 text-foreground leading-relaxed"
          placeholder="此刻的想法..."
        />
      </div>

      {/* Character counter */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* Image upload button */}
            <button
              type="button"
              onClick={handleFileSelect}
              disabled={isReadingImages || isSubmitting}
              className={`inline-flex items-center gap-1 text-xs transition-colors px-2 py-1 rounded-md hover:bg-muted/50 ${
                isReadingImages || isSubmitting
                  ? 'text-muted-foreground/40 cursor-not-allowed'
                  : 'text-muted-foreground/70 hover:text-primary'
              }`}
              title={isReadingImages ? '图片读取中...' : '添加图片'}
            >
              {isReadingImages ? (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  {imageCount > 0 && (
                    <span className="bg-primary/20 text-primary text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {imageCount}
                    </span>
                  )}
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <span className={`text-xs tabular-nums ${charCount > maxChars * 0.9 ? 'text-amber-500' : 'text-muted-foreground/40'}`}>
            {charCount}/{maxChars}
          </span>
        </div>
      </div>

      {/* Image preview */}
      {images.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative group rounded-xl overflow-hidden border border-border/40 shadow-sm">
                <img
                  src={image.data}
                  alt={image.name}
                  className="w-20 h-20 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg font-light"
                  title="移除图片"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className="px-4 pb-2">
          <button
            type="button"
            onClick={() => setMessage('')}
            className={`text-xs px-3 py-1.5 rounded-lg w-full text-left cursor-pointer transition-colors ${
              messageType === 'success'
                ? 'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25'
                : 'bg-red-500/15 text-red-600 hover:bg-red-500/25'
            }`}
          >
            {message}
            <span className="ml-auto inline-block opacity-60 hover:opacity-100">✕</span>
          </button>
        </div>
      )}

      {/* Submit bar */}
      <div className="px-4 py-3 border-t border-border/40 flex items-center justify-end gap-3 bg-muted/20">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className={`px-5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
            content.trim()
              ? 'bg-primary text-primary-foreground hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          } disabled:opacity-50`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              发布中
            </span>
          ) : (
            '发布'
          )}
        </button>
      </div>
    </form>
  );
}
