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

        if (newImages.length === files.length) {
          setImages((prev) => [...prev, ...newImages]);
          setMessage(`已添加 ${files.length} 张图片`);
          setMessageType('success');
          setTimeout(() => setMessage(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    });

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

      setAuthor('');
      setContent('');
      setImages([]);

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
              className="inline-flex items-center gap-1 text-xs text-muted-foreground/70 hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
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
          <div className={`text-xs px-3 py-1.5 rounded-lg ${
            messageType === 'success'
              ? 'bg-emerald-500/10 text-emerald-600'
              : 'bg-red-500/10 text-red-600'
          }`}>
            {message}
          </div>
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
