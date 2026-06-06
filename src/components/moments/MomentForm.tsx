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
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: ImageItem[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        newImages.push({
          name: file.name,
          data: base64Data,
        });

        // 当所有文件都处理完后更新状态
        if (newImages.length === files.length) {
          setImages((prev) => [...prev, ...newImages]);
          setMessage(`已插入 ${files.length} 张图片`);
          setMessageType('success');
          setTimeout(() => setMessage(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    });

    // 清空 input 以便重复选择同一文件
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
      const isGitHubPages = window.location.hostname.includes('github.io');

      let apiUrl: string;
      if (isGitHubPages) {
        apiUrl = '/api/moments';
      } else {
        apiUrl = '/api/moments/local';
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: author.trim(),
          content: content.trim(),
          images,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '发布失败');
      }

      setMessage('动态发布成功！');
      setMessageType('success');

      // 清空表单
      setAuthor('');
      setContent('');
      setImages([]);

      // 通知父组件发布成功
      if (onPublishSuccess) {
        onPublishSuccess();
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`发布失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg shadow-md overflow-hidden border p-6 md:p-8 space-y-6 bg-card border-border"
    >
      {/* 标题 */}
      <div className="flex items-center gap-2">
        <span className="text-xl">💬</span>
        <h2 className="text-xl font-semibold text-foreground">发布动态</h2>
      </div>

      {/* 作者输入 */}
      <div>
        <label htmlFor="moment-author" className="block text-sm font-medium mb-2 text-foreground">
          作者 *
        </label>
        <input
          type="text"
          id="moment-author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          placeholder="请输入作者名称"
        />
      </div>

      {/* 内容输入 */}
      <div>
        <label htmlFor="moment-content" className="block text-sm font-medium mb-2 text-foreground">
          内容 *
        </label>
        <div className="relative">
          <textarea
            id="moment-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-mono text-sm resize-none"
            placeholder="输入动态内容，支持 Markdown 格式..."
          />
        </div>
      </div>

      {/* 图片插入按钮 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleFileSelect}
          className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 border border-border"
        >
          <span>🖼️</span>
          <span className="text-sm">插入图片</span>
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

      {/* 图片预览 */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">已选图片 ({images.length})</h3>
          <div className="flex flex-wrap gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.data}
                  alt={image.name}
                  className="w-24 h-24 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                  title="移除图片"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 消息提示 */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            messageType === 'success'
              ? 'bg-green-100/50 text-green-700 border-green-200'
              : 'bg-red-100/50 text-red-700 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{messageType === 'success' ? '✅' : '❌'}</span>
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* 提交按钮 */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              发布中...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>📝</span>
              发布动态
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
