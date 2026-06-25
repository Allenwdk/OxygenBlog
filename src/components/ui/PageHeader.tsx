/**
 * 页面头部组件
 * 用于统一各页面的标题和描述展示
 */
'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  gradientStyle?: 'primary' | 'secondary' | 'accent';
}

export default function PageHeader({
  title,
  description,
  size = 'md',
  className = '',
  gradientStyle = 'primary',
}: PageHeaderProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`mb-8 ${className}`}
    >
      <h1 className={`${sizeClasses[size]} font-bold text-foreground mb-3`}>
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground text-lg leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
