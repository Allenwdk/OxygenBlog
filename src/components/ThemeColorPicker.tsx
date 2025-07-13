'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from 'next-themes';
import { 
  ChevronDownIcon,
  PaintBrushIcon,
  SwatchIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useThemeColor } from '@/hooks/useThemeColor';
import { 
  themeColorSchemes,
  generateThemeFromHex
} from '@/setting/ThemeColorSetting';

// 锁定页面滚动的工具函数
const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden';
};

const unlockBodyScroll = () => {
  document.body.style.overflow = '';
};

interface ThemeColorPickerProps {
  className?: string;
}

/**
 * 主题色切换组件
 * 提供多种主题色选择，支持浅色和深色模式，以及自定义调色盘功能
 */
export default function ThemeColorPicker({ className = '' }: ThemeColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [primaryInput, setPrimaryInput] = useState('#3b82f6');
  const [inputMode, setInputMode] = useState<'rgb' | 'hex'>('hex');
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  const { resolvedTheme } = useTheme();
  const { currentColorScheme, changeThemeColor, getCurrentScheme, mounted, updateTrigger, setCustomThemeColor } = useThemeColor();

  // 初始化 Portal 容器
  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  // 处理滚动锁定
  useEffect(() => {
    if (isOpen || showCustomPicker) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }

    // 清理函数
    return () => {
      unlockBodyScroll();
    };
  }, [isOpen, showCustomPicker]);

  // 处理窗口大小变化，关闭下拉菜单
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  useEffect(() => {
    if (mounted) {
      const currentScheme = getCurrentScheme();
      if (currentScheme && currentScheme.name === 'custom') {
        // 自定义主题色的处理逻辑
        const currentColor = resolvedTheme === 'dark' 
          ? currentScheme?.dark?.primary || '#3b82f6'
          : currentScheme?.light?.primary || '#3b82f6';
        setPrimaryColor(currentColor);
        setPrimaryInput(currentColor);
      }
    }
  }, [updateTrigger, getCurrentScheme, mounted, resolvedTheme]); // 添加updateTrigger依赖

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  /**
   * 处理主题色切换
   */
  const handleColorChange = (colorScheme: string) => {
    if (colorScheme === 'custom') {
      // 初始化自定义颜色选择器为当前主题色
      const currentScheme = getCurrentScheme();
      const currentColor = resolvedTheme === 'dark' 
        ? currentScheme?.dark?.primary || '#3b82f6'
        : currentScheme?.light?.primary || '#3b82f6';
      
      setPrimaryColor(currentColor);
      setPrimaryInput(currentColor);
      setShowCustomPicker(true);
      setIsOpen(false);
      return;
    }
    changeThemeColor(colorScheme);
    setIsOpen(false);
  };

  /**
   * 将RGB转换为十六进制
   */
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  /**
   * 将十六进制转换为RGB
   */
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  /**
   * 处理RGB输入
   */
  const handleRgbInput = (value: string, type: 'primary', component: 'r' | 'g' | 'b') => {
    const num = Math.max(0, Math.min(255, parseInt(value) || 0));
    const currentColor = primaryColor;
    const rgb = hexToRgb(currentColor) || { r: 0, g: 0, b: 0 };
    
    rgb[component] = num;
    const newHex = rgbToHex(rgb.r, rgb.g, rgb.b);
    
    if (type === 'primary') {
      setPrimaryColor(newHex);
      setPrimaryInput(newHex); // 确保两个状态同步
    }
  };

  /**
   * 处理十六进制输入
   */
  const handleHexInput = (value: string, type: 'primary') => {
    // 先更新输入状态，允许用户输入过程中的临时值
    if (type === 'primary') {
      setPrimaryInput(value);
    }
    
    // 只有当输入是有效的十六进制颜色时才更新实际颜色
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      if (type === 'primary') {
        setPrimaryColor(value);
      }
    }
  };

  /**
   * 统一的颜色更新函数
   */
  const updateColor = (newColor: string, type: 'primary') => {
    if (type === 'primary') {
      setPrimaryColor(newColor);
      setPrimaryInput(newColor);
    }
  };

  /**
   * 处理输入模式切换
   */
  const handleInputModeChange = (mode: 'hex' | 'rgb') => {
    setInputMode(mode);
    // 确保切换模式时状态一致
    setPrimaryInput(primaryColor);
  };

  /**
   * 预设颜色选择
   */
  const presetColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];

  /**
   * 处理自定义颜色应用
   */
  const handleCustomColorApply = () => {
    const customTheme = generateThemeFromHex(primaryColor, primaryColor, 'custom');
    setCustomThemeColor(customTheme);
    setShowCustomPicker(false);
  };

  /**
   * 重置到默认主题
   */
  const resetToDefault = () => {
    changeThemeColor('blue');
    setShowCustomPicker(false);
  };

  /**
   * 切换下拉菜单
   */
  const toggleDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      // 计算按钮位置
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY + 8, // 按钮底部 + 8px 间距
        right: window.innerWidth - rect.right + window.scrollX // 从右边缘计算
      });
    }
    setIsOpen(!isOpen);
  };

  const currentScheme = getCurrentScheme();

  /**
   * 渲染下拉菜单内容
   */
  const renderDropdownContent = () => (
    <>
      {/* 遮罩背景 */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[99998] transition-opacity duration-200 ease-out"
        onClick={() => setIsOpen(false)}
      />
      
      {/* 下拉菜单内容 */}
      <div 
        className="fixed bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[99999] w-80 transform transition-all duration-200 ease-out animate-in slide-in-from-top-2 fade-in"
        style={{
          top: `${buttonPosition.top}px`,
          right: `${buttonPosition.right}px`,
          maxHeight: `${Math.max(200, window.innerHeight - buttonPosition.top - 20)}px`,
          overflowY: 'auto'
        }}
      >
        <div className="p-5">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 px-2 flex items-center gap-2">
            🎨 <span>选择主题色</span>
          </div>
          
          {/* 预设主题色 */}
          <div className="space-y-1 mb-3">
            {themeColorSchemes.map((scheme, index) => (
              <button
                key={scheme.name}
                onClick={() => handleColorChange(scheme.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
                  currentColorScheme === scheme.name && currentScheme?.name !== 'custom'
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-gray-100 shadow-sm border border-blue-200 dark:border-gray-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className="flex gap-1.5">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                    style={{ 
                      backgroundColor: resolvedTheme === 'dark' 
                        ? scheme.dark.primary 
                        : scheme.light.primary 
                    }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                    style={{ 
                      backgroundColor: resolvedTheme === 'dark' 
                        ? scheme.dark.accent 
                        : scheme.light.accent 
                    }}
                  />
                </div>
                <span className="font-medium">{scheme.displayName}</span>
                {currentColorScheme === scheme.name && currentScheme?.name !== 'custom' && (
                  <div className="ml-auto">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* 自定义主题色按钮 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <button
              onClick={() => handleColorChange('custom')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
                currentScheme?.name === 'custom'
                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-gray-100 shadow-sm border border-purple-200 dark:border-gray-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex gap-1.5">
                {currentScheme?.name === 'custom' ? (
                  <>
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                      style={{ 
                        backgroundColor: resolvedTheme === 'dark' 
                          ? currentScheme?.dark?.primary || '#3b82f6'
                          : currentScheme?.light?.primary || '#3b82f6'
                      }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                      style={{ 
                        backgroundColor: resolvedTheme === 'dark' 
                          ? currentScheme?.dark?.accent || '#06b6d4'
                          : currentScheme?.light?.accent || '#06b6d4'
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-500" />
                    <div className="w-4 h-4 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-500" />
                  </>
                )}
              </div>
              <span className="font-medium">{currentScheme?.name === 'custom' ? '自定义主题' : '创建自定义主题'}</span>
              {currentScheme?.name === 'custom' && (
                <div className="ml-auto">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  /**
   * 渲染自定义颜色选择器内容
   */
  const renderCustomPickerContent = () => (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 transition-opacity duration-300 ease-out">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto transform transition-all duration-300 ease-out animate-in zoom-in-95 fade-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              🎨 <span>自定义主题色</span>
            </h3>
            <button
              onClick={() => setShowCustomPicker(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 输入模式切换 */}
          <div className="mb-4">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => handleInputModeChange('hex')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  inputMode === 'hex'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm transform scale-[1.02]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                十六进制
              </button>
              <button
                onClick={() => handleInputModeChange('rgb')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  inputMode === 'rgb'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm transform scale-[1.02]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                RGB
              </button>
            </div>
          </div>

          {/* 主色调设置 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              主色调
            </label>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => updateColor(e.target.value, 'primary')}
                className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
              />
              {inputMode === 'hex' ? (
                <input
                  type="text"
                  value={primaryInput}
                  onChange={(e) => handleHexInput(e.target.value, 'primary')}
                  placeholder="#3b82f6"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              ) : (
                <div className="flex-1 flex gap-2">
                  {['r', 'g', 'b'].map((component) => {
                    const rgb = hexToRgb(primaryColor) || { r: 0, g: 0, b: 0 };
                    return (
                      <input
                        key={component}
                        type="number"
                        min="0"
                        max="255"
                        value={rgb[component as keyof typeof rgb]}
                        onChange={(e) => handleRgbInput(e.target.value, 'primary', component as 'r' | 'g' | 'b')}
                        className="w-16 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={component.toUpperCase()}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* 预设颜色 */}
            <div className="grid grid-cols-8 gap-2">
              {presetColors.map((color, index) => (
                <button
                  key={color}
                  onClick={() => updateColor(color, 'primary')}
                  className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{ 
                    backgroundColor: color,
                    animationDelay: `${index * 50}ms`
                  }}
                />
              ))}
            </div>
          </div>

          {/* 预览 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              预览
            </label>
            <div className="flex gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600">
              <div 
                className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 shadow-md"
                style={{ backgroundColor: primaryColor }}
              />
              <div className="flex-1 flex flex-col justify-center ml-2">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  主题色
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {primaryColor}
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={resetToDefault}
              className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium hover:scale-[1.02]"
            >
              重置
            </button>
            <button
              onClick={() => setShowCustomPicker(false)}
              className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium hover:scale-[1.02]"
            >
              取消
            </button>
            <button
              onClick={handleCustomColorApply}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              应用
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* 主题色按钮 */}
      <button
        onClick={toggleDropdown}
        className="w-9 h-9 rounded-md border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 flex items-center justify-center"
        title={`当前主题色: ${currentScheme?.displayName || '未知'}`}
      >
        <div 
          className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600"
          style={{ 
            backgroundColor: resolvedTheme === 'dark' 
              ? currentScheme?.dark?.primary || '#3b82f6'
              : currentScheme?.light?.primary || '#3b82f6'
          }}
        />
      </button>

      {/* 使用 Portal 渲染下拉菜单 */}
      {isOpen && portalContainer && createPortal(
        renderDropdownContent(),
        portalContainer
      )}

      {/* 使用 Portal 渲染自定义颜色选择器 */}
      {showCustomPicker && portalContainer && createPortal(
        renderCustomPickerContent(),
        portalContainer
      )}
    </div>
  );
}