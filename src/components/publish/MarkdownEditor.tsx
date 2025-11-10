'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

/**
 * Markdown编辑器组件
 * 提供基本的Markdown编辑功能
 */
interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * 处理文本变化
   */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  /**
   * 插入文本到光标位置
   */
  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value?.substring(start, end) || '';
    
    let newText: string;
    let newCursorPosition: number;

    if (selectedText) {
      // 如果有选中文本，在选中内容前后添加标记
      newText = (value || '').substring(0, start) + before + selectedText + after + (value || '').substring(end);
      newCursorPosition = start + before.length + selectedText.length + after.length;
    } else {
      // 如果没有选中文本，插入占位符
      newText = (value || '').substring(0, start) + before + placeholder + after + (value || '').substring(end);
      newCursorPosition = start + before.length + placeholder.length;
    }

    onChange(newText);
    
    // 设置光标位置
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  /**
   * 工具栏按钮处理函数
   */
  const toolbarActions = {
    bold: () => insertText('**', '**', '粗体文字'),
    italic: () => insertText('*', '*', '斜体文字'),
    heading: () => insertText('# ', '', '标题'),
    code: () => insertText('`', '`', '代码'),
    codeBlock: () => insertText('```\n', '\n```', '代码块'),
    link: () => insertText('[', '](https://)', '链接文本'),
    image: () => insertText('![', '](https://)', '图片描述'),
    quote: () => insertText('> ', '', '引用'),
    list: () => insertText('- ', '', '列表项'),
    orderedList: () => insertText('1. ', '', '列表项'),
    table: () => insertText('| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |', '', ''),
  };

  /**
   * 工具栏组件
   */
  const Toolbar = () => (
    <div className="flex flex-wrap gap-1 p-3 border-b border-border bg-muted/50">
      {/* 文本格式 */}
      <div className="flex gap-1 mr-4">
        <button
          type="button"
          onClick={toolbarActions.bold}
          className="px-3 py-1.5 text-sm font-medium rounded hover:bg-accent transition-colors"
          title="粗体 (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={toolbarActions.italic}
          className="px-3 py-1.5 text-sm font-medium rounded hover:bg-accent transition-colors"
          title="斜体 (Ctrl+I)"
        >
          <em>I</em>
        </button>
      </div>

      {/* 标题 */}
      <div className="flex gap-1 mr-4">
        <button
          type="button"
          onClick={toolbarActions.heading}
          className="px-3 py-1.5 text-sm font-medium rounded hover:bg-accent transition-colors"
          title="标题"
        >
          H1
        </button>
      </div>

      {/* 代码 */}
      <div className="flex gap-1 mr-4">
        <button
          type="button"
          onClick={toolbarActions.code}
          className="px-3 py-1.5 text-sm font-medium rounded hover:bg-accent transition-colors"
          title="行内代码"
        >
          {'</>'} 
        </button>
        <button
          type="button"
          onClick={toolbarActions.codeBlock}
          className="px-3 py-1.5 text-sm font-medium rounded hover:bg-accent transition-colors"
          title="代码块"
        >
          {'{ }'}
        </button>
      </div>

      {/* 链接和图片 */}
      <div className="flex gap-1 mr-4">
        <button
          type="button"
          onClick={toolbarActions.link}
          className="px-3 py-1.5 text-sm font-medium rounded hover:bg-accent transition-colors"
          title="链接"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={toolbarActions.image}
          className="px-3 py-1.5 text-sm font-medium rounded hover:bg-accent transition-colors"
          title="图片"
        >
          🖼️
        </button>
      </div>

      {/* 列表和引用 */}
      <div className="flex gap-1 mr-4">
        <button
          type="button"
          onClick={toolbarActions.list}
          className="px-3 py-1.5 text-sm font-medium rounded hover:bg-accent transition-colors"
          title="无序列表"
        >
          • List
        </button>
        <button
          type="button"
          onClick={toolbarActions.quote}
          className="px-3 py-1.5 text-sm font-medium rounded hover:bg-accent transition-colors"
          title="引用"
        >
          💬
        </button>
      </div>

      {/* 表格 */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={toolbarActions.table}
          className="px-3 py-1.5 text-sm font-medium rounded hover:bg-accent transition-colors"
          title="表格"
        >
          ⊞
        </button>
      </div>
    </div>
  );

  /**
   * 处理键盘快捷键
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          toolbarActions.bold();
          break;
        case 'i':
          e.preventDefault();
          toolbarActions.italic();
          break;
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Toolbar />
      
      <div className="flex-1 p-4">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`# 欢迎使用 Markdown 编辑器

在这里开始编写你的文章...

## 快捷键
- Ctrl+B: 粗体
- Ctrl+I: 斜体
- 使用工具栏按钮快速插入常用语法

## 支持的语法
- **粗体** 和 *斜体*
- # 标题
- \`行内代码\` 和 \`\`\`代码块\`\`\`
- [链接](https://) 和 ![图片](https://)
- > 引用
- - 无序列表 和 1. 有序列表
- | 表格 | 支持 |
`}
          className="w-full h-full resize-none border-none outline-none bg-transparent text-foreground placeholder-muted-foreground font-mono text-sm leading-relaxed"
          style={{ 
            lineHeight: '1.6',
            tabSize: 2,
          }}
        />
      </div>
      
      {/* 状态栏 */}
      <div className="border-t border-border p-2 text-xs text-muted-foreground bg-muted/30">
        <div className="flex justify-between items-center">
          <span>Markdown 编辑器</span>
          <span>{value?.length || 0} 字符</span>
        </div>
      </div>
    </div>
  );
}