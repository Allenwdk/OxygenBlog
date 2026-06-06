'use client';

import { useRef, useState, MouseEvent } from 'react';

interface SpotlightButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * 聚光灯按钮组件
 * 鼠标在按钮上移动时，会显示跟随鼠标的光照效果
 */
export default function SpotlightButton({ 
  children, 
  className = '', 
  onClick,
  disabled = false 
}: SpotlightButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
  };

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
    >
      {/* 聚光灯光照层 */}
      {mousePosition && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(250px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.15), transparent 60%)`,
          }}
        />
      )}
      
      {/* 边框高光 */}
      {mousePosition && (
        <div
          className="pointer-events-none absolute inset-0 rounded-lg"
          style={{
            boxShadow: `inset 0 0 20px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 0.05)`,
          }}
        />
      )}
      
      {children}
    </button>
  );
}
