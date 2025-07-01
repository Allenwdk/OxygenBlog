'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';
import { categories } from '@/setting/blogSetting';


/**
 * 博客文章接口
 */
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  slug: string;
  readTime: number;
}

interface ClientBlogsPageProps {
  initialPosts: BlogPost[];
}

/**
 * 客户端博客列表页面
 * 处理交互和动画效果
 */
export default function ClientBlogsPage({ initialPosts }: ClientBlogsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCategoryCollapsed, setIsCategoryCollapsed] = useState<boolean>(true);
  
  /**
   * 过滤博客文章
   */
  const filteredPosts = selectedCategory === 'all' 
    ? initialPosts 
    : initialPosts.filter(post => post.category === selectedCategory);
  
  /**
   * 容器动画配置
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  /**
   * 卡片动画配置 - 已内联到组件中
   */

  // 如果没有任何博客数据，显示空页面提示
  if (initialPosts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              📝 博客文章
            </h1>
          </motion.div>
          
          {/* 空页面提示 */}
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">📄</div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                暂无博客文章
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                还没有发布任何博客文章，请稍后再来查看。
              </p>
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                返回首页
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            📝 博客文章
          </h1>
        </motion.div>
        
        {/* 移动端分类筛选折叠按钮 */}
        <motion.div 
          className="lg:hidden mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={() => setIsCategoryCollapsed(!isCategoryCollapsed)}
            className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>📂</span>
              <span className="font-medium">分类筛选</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({selectedCategory === 'all' ? '全部' : selectedCategory})
              </span>
            </span>
            <motion.span
              animate={{ rotate: isCategoryCollapsed ? 0 : 180 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
              ▼
            </motion.span>
          </button>
          
          {/* 移动端分类选项 */}
          <motion.div
            initial={false}
            animate={{ 
              height: isCategoryCollapsed ? 0 : 'auto',
              opacity: isCategoryCollapsed ? 0 : 1
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mt-2 p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((category) => (
                   <button
                     key={category}
                     onClick={() => setSelectedCategory(category)}
                     className={`px-3 py-2 rounded-md text-sm transition-colors ${
                       selectedCategory === category
                         ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                         : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                     }`}
                   >
                     {category === 'all' ? '全部' : category}
                   </button>
                 ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 桌面端左侧边栏 */}
          <motion.aside 
            className="hidden lg:block lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📂 分类筛选
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category === 'all' ? '全部' : category}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
          
          {/* 主内容区 */}
          <motion.main 
            className="col-span-1 lg:col-span-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={{
                    hidden: { 
                      opacity: 0, 
                      y: 20,
                      scale: 0.95
                    },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.3,
                        ease: "easeOut"
                      }
                    }
                  }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <Link href={`/blogs/${encodeURIComponent(post.slug)}`}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-medium">
                          {post.category}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          预计阅读时间 {post.readTime} 分钟
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {post.date}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  暂无该分类下的文章
                </p>
              </div>
            )}
          </motion.main>
        </div>
      </div>
    </div>
  );
}