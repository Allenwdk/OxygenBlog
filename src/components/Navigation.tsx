'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import ThemeToggle from './ThemeToggle';
import { emojy, name } from '@/setting/NavigationSetting';

/**
 * 导航栏组件
 * 支持响应式设计和主题切换
 */
export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  /**
   * 检查链接是否为当前页面
   */
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };
  
  const navItems = [
    { href: '/', label: '首页' },
    { href: '/blogs', label: '博客' },
    { href: '/archive', label: '归档' },
    { href: '/moments', label: '动态' },
    { href: '/friends', label: '友链' },
    { href: '/publish', label: '发布' },
    { href: '/about', label: '关于' },
  ];
  
  /**
   * 切换移动端菜单显示状态
   */
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  /**
   * 关闭移动端菜单
   */
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="logo-gloss-sweep flex items-center space-x-2" onClick={closeMobileMenu}>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{emojy}</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">{name}</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link-animated px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.href)
                      ? 'text-primary dark:text-primary'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {/* 主题切换按钮 */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Mobile menu button and theme controls */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary p-2 transition-colors"
              aria-label="切换菜单"
            >
              <svg 
                className={`w-6 h-6 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mobile-menu-glass overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`block nav-link-animated px-3 py-2 rounded-md text-base font-medium ${
                      isActive(item.href)
                        ? 'text-primary dark:text-primary'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}