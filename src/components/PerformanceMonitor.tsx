'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

interface PerformanceMonitorProps {
  showDetails?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export default function PerformanceMonitor({ 
  showDetails = false, 
  position = 'bottom-right' 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // 等待页面完全加载后收集性能指标
    const collectMetrics = () => {
      if (typeof window === 'undefined') return;

      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      let fcp = 0;
      let lcp = 0;
      let cls = 0;
      let fid = 0;

      // First Contentful Paint
      const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        fcp = fcpEntry.startTime;
      }

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcp = lastEntry.startTime;
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // Cumulative Layout Shift
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                cls += (entry as any).value;
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              fid = (entry as any).processingStart - entry.startTime;
            }
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (error) {
          console.warn('Performance Observer not fully supported:', error);
        }
      }

      const newMetrics: PerformanceMetrics = {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstContentfulPaint: fcp,
        largestContentfulPaint: lcp,
        cumulativeLayoutShift: cls,
        firstInputDelay: fid
      };

      setMetrics(newMetrics);
      setIsVisible(true);
    };

    // 延迟收集指标，确保页面完全加载
    const timer = setTimeout(collectMetrics, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const getPerformanceScore = (metrics: PerformanceMetrics): { score: number; color: string; label: string } => {
    let score = 100;
    
    // 根据各项指标计算分数
    if (metrics.loadTime > 3000) score -= 20;
    else if (metrics.loadTime > 2000) score -= 10;
    
    if (metrics.firstContentfulPaint > 2000) score -= 15;
    else if (metrics.firstContentfulPaint > 1000) score -= 8;
    
    if (metrics.largestContentfulPaint > 4000) score -= 20;
    else if (metrics.largestContentfulPaint > 2500) score -= 10;
    
    if (metrics.cumulativeLayoutShift > 0.25) score -= 15;
    else if (metrics.cumulativeLayoutShift > 0.1) score -= 8;
    
    if (metrics.firstInputDelay > 300) score -= 10;
    else if (metrics.firstInputDelay > 100) score -= 5;

    let color = 'text-green-500';
    let label = '优秀';
    
    if (score < 50) {
      color = 'text-red-500';
      label = '需要优化';
    } else if (score < 75) {
      color = 'text-yellow-500';
      label = '良好';
    }

    return { score: Math.max(0, score), color, label };
  };

  const formatTime = (time: number): string => {
    if (time < 1000) return `${Math.round(time)}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  if (!metrics || !isVisible) return null;

  const performanceScore = getPerformanceScore(metrics);

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed ${positionClasses[position]} z-50`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* 简化视图 */}
          <motion.div
            className="p-3 cursor-pointer flex items-center space-x-2"
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                性能
              </span>
              <span className={`text-sm font-bold ${performanceScore.color}`}>
                {Math.round(performanceScore.score)}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>

          {/* 详细视图 */}
          <AnimatePresence>
            {(isExpanded || showDetails) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">性能评分</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${performanceScore.color}`}>
                        {Math.round(performanceScore.score)}
                      </span>
                      <span className="text-xs text-gray-500">{performanceScore.label}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">页面加载时间</span>
                      <span className="font-mono">{formatTime(metrics.loadTime)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">DOM 内容加载</span>
                      <span className="font-mono">{formatTime(metrics.domContentLoaded)}</span>
                    </div>
                    
                    {metrics.firstContentfulPaint > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">首次内容绘制</span>
                        <span className="font-mono">{formatTime(metrics.firstContentfulPaint)}</span>
                      </div>
                    )}
                    
                    {metrics.largestContentfulPaint > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">最大内容绘制</span>
                        <span className="font-mono">{formatTime(metrics.largestContentfulPaint)}</span>
                      </div>
                    )}
                    
                    {metrics.cumulativeLayoutShift > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">累积布局偏移</span>
                        <span className="font-mono">{metrics.cumulativeLayoutShift.toFixed(3)}</span>
                      </div>
                    )}
                    
                    {metrics.firstInputDelay > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">首次输入延迟</span>
                        <span className="font-mono">{formatTime(metrics.firstInputDelay)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-600">
                    <button
                      onClick={() => setIsVisible(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      隐藏监控器
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}