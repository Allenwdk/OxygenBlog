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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsReadingImages(true);
    setMessage('');
    setMessageType('success');

    try {
      // Promise-based FileReader to avoid callback race conditions
      const results = await Promise.all(
        Array.from(files).map((file) => new Promise<ImageItem>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ name: file.name, data: reader.result as string });
          reader.onerror = () => reject(new Error(`Failed to read "${file.name}"`));
          // Timeout after 30 seconds per file
          setTimeout(() => reject(new Error(`Read timeout for "${file.name}"`)), 30000);
          reader.readAsDataURL(file);
        }))
      );

      setImages((prev) => [...prev, ...results]);
      setImageCount(prev => prev + results.length);
      setMessage(`已添加 ${results.length} 张图片`);
      setMessageType('success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '图片读取失败';
      setMessage(msg);
      setMessageType('error');
    } finally {
      setIsReadingImages(false);
    }

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageCount((prev) => Math.max(0, prev - 1));
  };

  /**
   * GitHub Pages 环境：通过 git/trees API 一次性创建所有文件到一个 commit
   */
  const submitToGitHub = async (authorStr: string, contentStr: string, imgs: ImageItem[]) => {
    const token = process.env.NEXT_PUBLIC_BLOG_GITHUB_TOKEN;
    const owner = process.env.NEXT_PUBLIC_BLOG_GITHUB_OWNER || '';
    const repo = process.env.NEXT_PUBLIC_BLOG_GITHUB_REPO || '';
    const branch = process.env.NEXT_PUBLIC_BLOG_GITHUB_BRANCH || 'main';

    if (!token || !owner || !repo) {
      throw new Error('GitHub 配置不完整，请检查环境变量');
    }

    // 生成时间戳和目录路径
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    const dirPath = `src/content/moments/${authorStr}/${timestamp}`;

    // 生成 front matter + 正文内容 + 图片引用（相对路径）
    const isoDate = new Date().toISOString();
    let imageTags = '';
    for (const image of imgs) {
      if (image.data.startsWith('data:')) {
        const imageName = image.name || 'image.png';
        imageTags += `<img src="${imageName}" alt="${imageName}" />\n`;
      }
    }

    // 构建所有文件: content.md + images
    const files: Array<{ path: string; content: string; encoding: 'utf-8' | 'base64' }> = [];

    const fullContent = `---
author: ${authorStr}
date: ${isoDate}
---

${contentStr}${imageTags}`;
    files.push({ path: `${dirPath}/content.md`, content: fullContent, encoding: 'utf-8' });

    for (const image of imgs) {
      const imageName = image.name || 'image.png';
      const imagePath = `${dirPath}/${imageName}`;
      const base64Data = image.data.replace(/^data:[^;]+;base64,/, '');
      files.push({ path: imagePath, content: base64Data, encoding: 'base64' });
    }

    const commitMessage = `发布动态: ${authorStr} - ${timestamp}`;

    // 通过 git/trees API 一次性创建所有文件到一个 commit
    await batchCommitFiles(token, owner, repo, branch, files, commitMessage);

    return { path: `${dirPath}/content.md`, timestamp };
  };

  /**
   * 通过 GitHub Git Trees API 批量创建文件到一个 commit
   */
  async function batchCommitFiles(
    token: string,
    owner: string,
    repo: string,
    branch: string,
    files: Array<{ path: string; content: string; encoding: 'utf-8' | 'base64' }>,
    commitMessage: string
  ): Promise<void> {
    // Step 1: 获取当前 commit SHA 和 root tree SHA
    const refUrl = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`;
    const refResp = await fetch(refUrl, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!refResp.ok) throw new Error('无法获取分支引用');
    const refData = await refResp.json();
    const commitSha = refData.object.sha;

    // 获取 commit 对象以拿到 root tree SHA
    const commitObjUrl = `https://api.github.com/repos/${owner}/${repo}/git/commits/${commitSha}`;
    const commitObjResp = await fetch(commitObjUrl, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!commitObjResp.ok) throw new Error('无法获取 commit 对象');
    const commitObj = await commitObjResp.json();
    const rootTreeSha = commitObj.tree_sha;

    // Step 2: 递归获取当前树 entries（保留已有文件）
    function getTreeEntriesRecursive(treePath: string, recursive: boolean): Promise<any[]> {
      const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${treePath}${recursive ? '?recursive=1' : ''}`;
      return fetch(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' }
      }).then(r => {
        if (!r.ok) throw new Error(`Failed to get tree at ${treePath}`);
        return r.json();
      }).then(data => {
        const entries = recursive ? data.tree : (data.entries || []);
        // Recurse into sub-trees if not requesting full recursion
        if (!recursive) {
          const promises = entries
            .filter((e: { type: string; path: string }) => e.type === 'tree')
            .map((e: { type: string; path: string }) => getTreeEntriesRecursive(e.path, false));
          return Promise.all(promises).then(results => {
            const children: any[] = [];
            results.forEach(arr => children.push(...arr));
            return [...entries, ...children];
          });
        }
        return entries;
      });
    }

    // Fetch full tree with recursion=1
    let existingEntries: any[];
    try {
      existingEntries = await getTreeEntriesRecursive(rootTreeSha, true);
    } catch {
      existingEntries = [];
    }

    // Step 3: 创建新 blobs (批量 API)
    const blobMap: Record<string, string> = {};
    for (const file of files) {
      if (!file.content) continue;

      let contentEncoded: string;
      if (file.encoding === 'utf-8') {
        contentEncoded = btoa(unescape(encodeURIComponent(file.content)));
      } else {
        contentEncoded = file.content; // already base64
      }

      const blobResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: contentEncoded, encoding: file.encoding })
      });

      if (!blobResp.ok) throw new Error(`创建 blob 失败: ${blobResp.status}`);
      const blobData = await blobResp.json();
      blobMap[file.path] = blobData.sha;
    }

    // Step 4: 构建 tree entries（保留旧条目 + 新文件覆盖）
    const newTreeEntries = [...existingEntries];
    for (const file of files) {
      const sha = blobMap[file.path];
      if (!sha) continue;

      const existingIdx = newTreeEntries.findIndex(e => e.path === file.path);
      if (existingIdx >= 0) {
        newTreeEntries[existingIdx] = { path: file.path, mode: '100644', type: 'blob', sha };
      } else {
        newTreeEntries.push({ path: file.path, mode: '100644', type: 'blob', sha });
      }
    }

    // Step 5: 创建新 tree
    const treeResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        base_tree: rootTreeSha, // include existing entries in new tree
        tree: newTreeEntries
      })
    });

    if (!treeResp.ok) {
      const errText = await treeResp.text();
      throw new Error(`创建 tree 失败: ${treeResp.status} - ${errText.substring(0, 500)}`);
    }
    const treeData = await treeResp.json();

    // Step 6: 创建 commit（parent 是当前分支的 commit）
    const commitUrl = `https://api.github.com/repos/${owner}/${repo}/git/commits`;
    const commitResp = await fetch(commitUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: commitMessage,
        tree: treeData.sha,
        parents: [commitSha]
      })
    });

    if (!commitResp.ok) {
      const errText = await commitResp.text();
      throw new Error(`创建 commit 失败: ${commitResp.status} - ${errText.substring(0, 500)}`);
    }

    // Step 7: 更新分支引用到新 commit
    const updateUrl = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`;
    const updateResp = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sha: treeData.commit.sha })
    });

    if (!updateResp.ok) throw new Error('更新分支引用失败');
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

      // Try local save first, fall back to direct GitHub upload (static export)
      let success = false;
      try {
        await saveToLocal(authorStr, contentStr, images);
        success = true;
      } catch {
        // Local API not available (static export), fall back to direct GitHub upload
        try {
          await submitToGitHub(authorStr, contentStr, images);
          success = true;
        } catch (githubErr) {
          throw githubErr;
        }
      }

      if (!success) {
        // This shouldn't happen but just in case
        setMessage('发布失败: 无法连接到服务');
        setMessageType('error');
        return;
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
