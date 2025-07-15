'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import LazyMarkdown from '@/components/LazyMarkdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import CopyrightNotice from '@/components/CopyrightNotice';
import OptimizedImage from '@/components/OptimizedImage';
import TableOfContents from '@/components/TableOfContents';
import 'katex/dist/katex.min.css';
import { EndWord } from '@/setting/blogSetting';
import { useBackgroundStyle } from '@/hooks/useBackgroundStyle';
import { useTheme } from 'next-themes';

/**
 * 标准化编程语言名称，解决大小写敏感问题
 * 
 * @param language - 原始语言名称
 * @returns 标准化后的语言名称
 */
const normalizeLanguage = (language: string): string => {
  const languageMap: Record<string, string> = {
    // JavaScript 相关
    'javascript': 'javascript',
    'js': 'javascript',
    'jsx': 'jsx',
    'typescript': 'typescript',
    'ts': 'typescript',
    'tsx': 'tsx',
    
    // Python 相关
    'python': 'python',
    'py': 'python',
    'python3': 'python',
    
    // Java 相关
    'java': 'java',
    
    // C/C++ 相关
    'c': 'c',
    'cpp': 'cpp',
    'c++': 'cpp',
    'cxx': 'cpp',
    
    // Web 相关
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'less': 'less',
    
    // Shell 相关
    'bash': 'bash',
    'sh': 'bash',
    'shell': 'bash',
    'zsh': 'bash',
    
    // 数据格式
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'toml': 'toml',
    
    // 数据库
    'sql': 'sql',
    'mysql': 'sql',
    'postgresql': 'sql',
    'sqlite': 'sql',
    
    // 其他常用语言
    'go': 'go',
    'golang': 'go',
    'rust': 'rust',
    'php': 'php',
    'ruby': 'ruby',
    'swift': 'swift',
    'kotlin': 'kotlin',
    'dart': 'dart',
    'r': 'r',
    'matlab': 'matlab',
    'perl': 'perl',
    'lua': 'lua',
    'scala': 'scala',
    'clojure': 'clojure',
    'haskell': 'haskell',
    'elixir': 'elixir',
    'erlang': 'erlang',
    
    // 标记语言
    'markdown': 'markdown',
    'md': 'markdown',
    'latex': 'latex',
    'tex': 'latex',
    
    // 配置文件
    'dockerfile': 'dockerfile',
    'docker': 'dockerfile',
    'makefile': 'makefile',
    'make': 'makefile',
    
    // 其他
    'text': 'text',
    'txt': 'text',
    'plain': 'text',
    'plaintext': 'text'
  };
  
  const normalizedInput = language.toLowerCase().trim();
   return languageMap[normalizedInput] || normalizedInput;
 };

/**
 * 获取语言的友好显示名称
 * 
 * @param language - 标准化后的语言名称
 * @returns 用于显示的友好名称
 */
const getLanguageDisplayName = (language: string): string => {
  const displayNameMap: Record<string, string> = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'jsx': 'JSX',
    'tsx': 'TSX',
    'python': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'sass': 'Sass',
    'less': 'Less',
    'bash': 'Bash',
    'json': 'JSON',
    'xml': 'XML',
    'yaml': 'YAML',
    'toml': 'TOML',
    'sql': 'SQL',
    'go': 'Go',
    'rust': 'Rust',
    'php': 'PHP',
    'ruby': 'Ruby',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'dart': 'Dart',
    'r': 'R',
    'matlab': 'MATLAB',
    'perl': 'Perl',
    'lua': 'Lua',
    'scala': 'Scala',
    'clojure': 'Clojure',
    'haskell': 'Haskell',
    'elixir': 'Elixir',
    'erlang': 'Erlang',
    'markdown': 'Markdown',
    'latex': 'LaTeX',
    'dockerfile': 'Dockerfile',
    'makefile': 'Makefile',
    'text': 'Text'
  };
  
  return displayNameMap[language] || language.charAt(0).toUpperCase() + language.slice(1);
 };

interface ComponentProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface BlogPost {
  title: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
  excerpt: string;
  content: string;
  slug: string;
  reference?: Array<{description: string; link: string}>;
}

interface ClientBlogDetailProps {
  blog: BlogPost;
}

interface LinkProps {
  href?: string;
  children?: React.ReactNode;
}
/**
 * 博客详情客户端组件
 * 
 * 功能特点：
 * - 使用 framer-motion 提供动画效果
 * - 使用 ReactMarkdown 渲染 Markdown 格式的文章内容
 * - 支持语法高亮显示代码块
 * - 包含返回博客列表的导航链接
 * - 响应式设计，适配不同屏幕尺寸
 * - 支持深色模式
 * 
 * @param blog - 博客文章数据
 * @returns 渲染的博客详情页面
 */
export function ClientBlogDetail({ blog }: ClientBlogDetailProps) {
  const { containerStyle, isBackgroundEnabled } = useBackgroundStyle('blog-detail');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // 毛玻璃样式函数
  const getGlassStyle = (baseClasses: string) => {
    if (isBackgroundEnabled) {
      return `${baseClasses} backdrop-blur-md bg-card/80 supports-[backdrop-filter]:bg-card/60 border-border/50`;
    }
    return `bg-card ${baseClasses} border-border`;
  };
  
  return (
    <div className={containerStyle.className} style={containerStyle.style}>
      {/* 目录组件 */}
      <TableOfContents content={blog.content} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 md:pr-72">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            href="/blogs" 
            className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            ← 返回博客列表
          </Link>
          
          {/* 文章头部信息 */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
              <span>{blog.date}</span>
              <span>•</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                {blog.category}
              </span>
              <span>•</span>
              <span>预计阅读时间{blog.readTime}分钟</span>
            </div>
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded border border-gray-200 dark:border-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
          
          {/* 文章内容 */}
          <motion.article 
            className={getGlassStyle("rounded-lg shadow-md overflow-hidden border")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <LazyMarkdown
                  content={blog.content}
                  components={{
                     p({ children, ...props }: ComponentProps) {
                       const childrenArray = React.Children.toArray(children);
                       
                       // 检查是否包含块级元素（div、组件等）
                       const hasBlockElements = childrenArray.some(child => {
                         if (React.isValidElement(child)) {
                           // 检查是否是 div 元素或其他块级HTML元素
                           if (typeof child.type === 'string') {
                             const blockElements = ['div', 'section', 'article', 'header', 'footer', 'nav', 'aside', 'main', 'figure', 'figcaption', 'blockquote', 'pre', 'table', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
                             return blockElements.includes(child.type);
                           }
                           // 检查是否是React组件（函数组件或类组件）
                           if (typeof child.type === 'function' || typeof child.type === 'object') {
                             return true;
                           }
                         }
                         return false;
                       });
                       
                       // 如果包含块级元素或React组件，直接返回子元素而不包裹在p标签中
                       if (hasBlockElements) {
                         return <>{children}</>;
                       }
                       
                       return (
                         <p className="my-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props}>
                           {children}
                         </p>
                       );
                     },
                     pre: ({ children, ...props }: ComponentProps) => (
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
                       // 提取纯文本内容，避免复杂的React元素结构
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

                       // 智能判断行内代码：
                       // 1. 明确标记为inline的
                       // 2. 没有语言类名、内容简短且不包含换行符的（真正的行内代码）
                       // 3. 排除无语言代码块：即使没有className，如果内容包含换行符或来自pre标签，则为块级代码
                       const hasLanguageClass = className && className.startsWith('language-');
                       const isShortContent = codeContent.length < 100 && !codeContent.includes('\n');
                       const isInlineCode = inline || (!hasLanguageClass && !className && isShortContent);

                       // 行内代码：只渲染纯文本，不包含任何块级元素
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

                       // 块级代码：包含语法高亮和UI元素
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
                    blockquote({ children }: ComponentProps) {
                       return (
                         <blockquote className="border-l-4 border-primary bg-primary/5 p-4 my-4 rounded-r-lg">
                           <div className="flex items-start">
                             <div className="text-primary mr-2 text-lg">💡</div>
                             <div className="flex-1">{children}</div>
                           </div>
                         </blockquote>
                       );
                     },
                     table({ children }: ComponentProps) {
                       return (
                         <div className="overflow-x-auto my-6">
                           <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg">
                             {children}
                           </table>
                         </div>
                       );
                     },
                     thead({ children }: ComponentProps) {
                       return (
                         <thead className="bg-gray-100 dark:bg-gray-800">
                           {children}
                         </thead>
                       );
                     },
                     tbody({ children }: ComponentProps) {
                       return (
                         <tbody className="bg-background divide-y divide-gray-200 dark:divide-gray-700">
                           {children}
                         </tbody>
                       );
                     },
                     tr({ children }: ComponentProps) {
                       return (
                         <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                           {children}
                         </tr>
                       );
                     },
                     th({ children }: ComponentProps) {
                       return (
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                           {children}
                         </th>
                       );
                     },
                     td({ children }: ComponentProps) {
                        return (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                            {children}
                          </td>
                        );
                      },
                      h1({ children }: ComponentProps) {
                       const id = typeof children === 'string' ? 
                         children.toLowerCase().replace(/[^\w\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') :
                         React.Children.toArray(children).join('').toLowerCase().replace(/[^\w\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                       return (
                         <h1 id={id} className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-foreground no-underline">
                           {children}
                         </h1>
                       );
                     },
                     h2({ children }: ComponentProps) {
                       const id = typeof children === 'string' ? 
                         children.toLowerCase().replace(/[^\w\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') :
                         React.Children.toArray(children).join('').toLowerCase().replace(/[^\w\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                       return (
                         <h2 id={id} className="text-2xl font-semibold mt-6 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700 text-foreground no-underline">
                           {children}
                         </h2>
                       );
                     },
                     h3({ children }: { children: React.ReactNode }) {
                       const id = typeof children === 'string' ? 
                         children.toLowerCase().replace(/[^\w\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') :
                         React.Children.toArray(children as React.ReactNode[]).join('').toLowerCase().replace(/[^\w\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                       return (
                         <h3 id={id} className="text-xl font-semibold mt-5 mb-2 text-foreground no-underline">
                           {children}
                         </h3>
                       );
                     },
                     h4({ children }: { children: React.ReactNode }) {
                       const id = typeof children === 'string' ? 
                         children.toLowerCase().replace(/[^\w\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') :
                         React.Children.toArray(children as React.ReactNode[]).join('').toLowerCase().replace(/[^\w\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                       return (
                         <h4 id={id} className="text-lg font-semibold mt-4 mb-2 text-foreground no-underline">
                           {children}
                         </h4>
                       );
                     },
                     h5({ children }: { children: React.ReactNode }) {
                       const id = typeof children === 'string' ? 
                         children.toLowerCase().replace(/[^\w\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') :
                         React.Children.toArray(children as React.ReactNode[]).join('').toLowerCase().replace(/[^\w\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                       return (
                         <h5 id={id} className="text-base font-semibold mt-3 mb-2 text-foreground no-underline">
                           {children}
                         </h5>
                       );
                     },
                     h6({ children }: { children: React.ReactNode }) {
                       const id = typeof children === 'string' ? 
                         children.toLowerCase().replace(/[^\w\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') :
                         React.Children.toArray(children as React.ReactNode[]).join('').toLowerCase().replace(/[^\w\u4e00-\u9fff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                       return (
                         <h6 id={id} className="text-sm font-semibold mt-3 mb-2 text-foreground no-underline">
                           {children}
                         </h6>
                       );
                     },
                     ol({ children }: any) {
                       return (
                         <ol className="list-decimal list-outside ml-6 my-4 space-y-2 text-gray-700 dark:text-gray-300 break-words">
                           {children}
                         </ol>
                       );
                     },
                     ul({ children }: any) {
                       return (
                         <ul className="list-disc list-outside ml-6 my-4 space-y-2 text-gray-700 dark:text-gray-300 break-words">
                           {children}
                         </ul>
                       );
                     },
                     li({ children }: any) {
                       return (
                         <li className="text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                           {children}
                         </li>
                       );
                     },
                     a({ href, children }: LinkProps) {
                       return (
                         <a 
                           href={href as string}
                           className="text-primary hover:text-primary/80 underline decoration-2 underline-offset-2 transition-colors"
                           target={href?.startsWith('http') ? '_blank' : '_self'}
                           rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                         >
                           {children}
                         </a>
                       );
                     },
                     img({ src, alt, title }: { src?: string; alt?: string; title?: string }) {
                       if (!src) return null;
                       
                       return (
                         <OptimizedImage
                           src={src}
                           alt={alt || ''}
                           title={title}
                           className="my-2 mx-auto block max-w-full shadow-lg"
                           width={800}
                           height={600}
                         />
                       );
                     }
                    }}
                />
              </div>
            </div>
          </motion.article>
          
          <CopyrightNotice
            title={blog.title}
            publishDate={blog.date}
            slug={blog.slug}
            reference={blog.reference}
          />
          
          {/* 文章底部导航 */}
          <motion.div 
            className="mt-12 flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link 
              href="/blogs" 
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
            >
              ← 返回列表
            </Link>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              {EndWord}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}