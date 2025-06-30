'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { FixedSizeList as List } from 'react-window';

interface BlogPost {
  title: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  excerpt: string;
  slug: string;
  reference?: Array<{description: string; link: string}>;
}

interface VirtualizedBlogListProps {
  blogs: BlogPost[];
  searchTerm?: string;
  selectedCategory?: string;
  selectedTag?: string;
}

interface BlogItemProps {
  index: number;
  style: React.CSSProperties;
  data: BlogPost[];
}

// 单个博文项组件
function BlogItem({ index, style, data }: BlogItemProps) {
  const blog = data[index];
  
  return (
    <div style={style}>
      <motion.article
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mx-4 my-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -5 }}
      >
        <div className="flex flex-col h-full">
          {/* 分类和标签 */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
              {blog.category}
            </span>
            {blog.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 2 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                +{blog.tags.length - 2} more
              </span>
            )}
          </div>

          {/* 标题 */}
          <Link href={`/blogs/${blog.slug}`}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
              {blog.title}
            </h2>
          </Link>

          {/* 摘要 */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
            {blog.excerpt}
          </p>

          {/* 底部信息 */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>{blog.date}</span>
              <span>📖 {blog.readTime}</span>
            </div>
            <Link
              href={`/blogs/${blog.slug}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
            >
              阅读更多 →
            </Link>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

// 加载骨架屏
function BlogSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mx-4 my-2 animate-pulse">
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
      </div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  );
}

export default function VirtualizedBlogList({
  blogs,
  searchTerm = '',
  selectedCategory = '',
  selectedTag = ''
}: VirtualizedBlogListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [listHeight, setListHeight] = useState(600);

  // 过滤博文
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch = searchTerm === '' || 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === '' || blog.category === selectedCategory;
      const matchesTag = selectedTag === '' || blog.tags.includes(selectedTag);
      
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [blogs, searchTerm, selectedCategory, selectedTag]);

  // 计算列表高度
  useEffect(() => {
    const updateHeight = () => {
      const windowHeight = window.innerHeight;
      const headerHeight = 200; // 估算的头部高度
      const footerHeight = 100; // 估算的底部高度
      const newHeight = Math.max(400, windowHeight - headerHeight - footerHeight);
      setListHeight(newHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    // 模拟加载延迟
    const timer = setTimeout(() => setIsLoading(false), 300);

    return () => {
      window.removeEventListener('resize', updateHeight);
      clearTimeout(timer);
    };
  }, []);

  const itemData = useMemo(() => filteredBlogs, [filteredBlogs]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <BlogSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (filteredBlogs.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          没有找到相关博文
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          尝试调整搜索条件或浏览其他分类
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <List
        height={listHeight}
        width="100%"
        itemCount={filteredBlogs.length}
        itemSize={280} // 每个博文项的高度
        itemData={itemData}
        overscanCount={5} // 预渲染的项目数量
        className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {BlogItem}
      </List>
      
      {/* 显示结果统计 */}
      <motion.div
        className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        共找到 {filteredBlogs.length} 篇博文
        {(searchTerm || selectedCategory || selectedTag) && (
          <span className="ml-2">
            {searchTerm && `搜索: "${searchTerm}"`}
            {selectedCategory && ` 分类: ${selectedCategory}`}
            {selectedTag && ` 标签: ${selectedTag}`}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}