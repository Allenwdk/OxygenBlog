'use client';

import { motion } from 'motion/react';
import { useBackgroundStyle } from '@/hooks/useBackgroundStyle';
import PublishForm from '@/components/publish/PublishForm';

export default function PublishPage() {
  const { containerStyle } = useBackgroundStyle('blogs');

  return (
    <div className={containerStyle.className} style={containerStyle.style}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            ✍️ 发布新文章
          </h1>
          <p className="text-lg text-muted-foreground">
            分享你的技术见解，记录成长足迹
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PublishForm />
        </motion.div>
      </div>
    </div>
  );
}