'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarkdownEditor from '@/components/publish/MarkdownEditor';
import MetadataForm from '@/components/publish/MetadataForm';
import PreviewPanel from '@/components/publish/PreviewPanel';
import FileSaveHandler from '@/components/publish/FileSaveHandler';

interface ArticleMetadata {
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  readTime: number;
}

/**
 * 客户端发布页面
 * 提供完整的文章发布功能
 */
export default function ClientPublishPage() {
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<ArticleMetadata>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: '技术',
    tags: [],
    excerpt: '',
    readTime: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'metadata'>('edit');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 清除消息状态
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6">
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">创建新文章</h1>
          <p className="text-muted-foreground text-lg">
            分享你的想法、经验和知识
          </p>
        </motion.div>

        {/* 主编辑区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：元数据表单 */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                📝 文章信息
              </h2>
              <MetadataForm
                metadata={metadata}
                onChange={setMetadata}
                content={content}
              />
            </div>

            {/* 保存处理 */}
            <div className="mt-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  💾 保存发布
                </h2>
                <FileSaveHandler
                  content={content}
                  metadata={metadata}
                  onSave={setIsSaving}
                  onSuccess={setSuccessMessage}
                  onError={setErrorMessage}
                />
              </div>
            </div>
          </div>

          {/* 中间：编辑器 */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border h-[calc(100vh-12rem)]">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-border">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    ✍️ 内容编辑
                  </h2>
                </div>
                <div className="flex-1 overflow-hidden">
                  <MarkdownEditor
                    value={content}
                    onChange={setContent}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：预览 */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border h-[calc(100vh-12rem)]">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-border">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    👀 实时预览
                  </h2>
                </div>
                <div className="flex-1 overflow-hidden">
                  <PreviewPanel
                    content={content}
                    metadata={metadata}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 响应式布局：在移动设备上显示标签页 */}
        <div className="lg:hidden mt-6">
          <div className="bg-card rounded-lg border border-border">
            <div className="border-b border-border">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === 'edit'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  ✍️ 编辑
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === 'preview'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  👀 预览
                </button>
                <button
                  onClick={() => setActiveTab('metadata')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === 'metadata'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  📝 详情
                </button>
              </nav>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {activeTab === 'edit' && (
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                />
              )}
              {activeTab === 'preview' && (
                <PreviewPanel
                  content={content}
                  metadata={metadata}
                />
              )}
              {activeTab === 'metadata' && (
                <div className="space-y-4">
                  <MetadataForm
                    metadata={metadata}
                    onChange={setMetadata}
                    content={content}
                  />
                  <div className="pt-4 border-t border-border">
                    <FileSaveHandler
                      content={content}
                      metadata={metadata}
                      onSave={setIsSaving}
                      onSuccess={setSuccessMessage}
                      onError={setErrorMessage}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 成功/错误提示 */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            ✅ {successMessage}
          </motion.div>
        )}
        
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            ❌ {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部状态栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2">
        <div className="container mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              字数: <span className="font-medium text-foreground">{content.trim().length}</span>
            </span>
            <span>
              预计阅读: <span className="font-medium text-foreground">{metadata.readTime} 分钟</span>
            </span>
            <span>
              标题: <span className="font-medium text-foreground">{metadata.title || '未设置'}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {isSaving && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span>正在保存...</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>自动保存</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}