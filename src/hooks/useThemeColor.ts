"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import {
  applyThemeColor,
  getSavedThemeColor,
  getSavedCustomTheme,
  defaultThemeColor,
  getThemeColorScheme,
  type ThemeColorScheme
} from '@/setting/ThemeColorSetting';

interface ThemeColorContextValue {
  currentColorScheme: string;
  customTheme: ThemeColorScheme | null;
  changeThemeColor: (colorScheme: string | ThemeColorScheme) => void;
  setCustomThemeColor: (theme: ThemeColorScheme) => void;
  getCurrentScheme: () => ThemeColorScheme;
  mounted: boolean;
  updateTrigger: number;
  forceUpdate: () => void;
}

const ThemeColorContext = createContext<ThemeColorContextValue | undefined>(undefined);

/**
 * 主题色上下文提供者组件
 * 为整个应用提供统一的主题色状态管理
 */
export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  const [currentColorScheme, setCurrentColorScheme] = useState(defaultThemeColor);
  const [customTheme, setCustomTheme] = useState<ThemeColorScheme | null>(null);
  const [mounted, setMounted] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const { resolvedTheme } = useTheme();

  /**
   * 强制更新组件的函数
   */
  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  /**
   * 应用当前主题色的函数
   */
  const applyCurrentTheme = useCallback((isDark: boolean = resolvedTheme === 'dark') => {
    if (currentColorScheme === 'custom' && customTheme) {
      applyThemeColor(customTheme, isDark);
    } else {
      applyThemeColor(currentColorScheme, isDark);
    }
    forceUpdate();
  }, [currentColorScheme, customTheme, resolvedTheme, forceUpdate]);

  // 初始化主题色
  useEffect(() => {
    setMounted(true);
    
    // 检查是否已经通过脚本预初始化
    const isPreInitialized = typeof window !== 'undefined' && 
      document.documentElement.style.getPropertyValue('--theme-initialized') === '1';
    
    const savedColor = getSavedThemeColor();
    const savedCustom = getSavedCustomTheme();
    
    setCurrentColorScheme(savedColor);
    if (savedColor === 'custom' && savedCustom) {
      setCustomTheme(savedCustom);
    }
    
    // 如果没有预初始化，立即应用主题色
    if (!isPreInitialized) {
      if (savedColor === 'custom' && savedCustom) {
        applyThemeColor(savedCustom, resolvedTheme === 'dark');
      } else {
        applyThemeColor(savedColor, resolvedTheme === 'dark');
      }
    }
    
    forceUpdate();
  }, [resolvedTheme, forceUpdate]);

  // 监听主题变化
  useEffect(() => {
    if (mounted) {
      applyCurrentTheme();
    }
  }, [resolvedTheme, mounted, applyCurrentTheme]);

  // 监听主题色变化
  useEffect(() => {
    if (mounted) {
      if (currentColorScheme === 'custom' && customTheme) {
        applyThemeColor(customTheme, resolvedTheme === 'dark');
      } else {
        applyThemeColor(currentColorScheme, resolvedTheme === 'dark');
      }
      forceUpdate();
    }
  }, [currentColorScheme, customTheme, resolvedTheme, mounted, forceUpdate]);

  /**
   * 切换主题色的函数
   */
  const changeThemeColor = useCallback((colorScheme: string | ThemeColorScheme) => {
    if (typeof colorScheme === 'string') {
      setCurrentColorScheme(colorScheme);
      if (colorScheme !== 'custom') {
        setCustomTheme(null);
      }
    } else {
      setCurrentColorScheme('custom');
      setCustomTheme(colorScheme);
    }
  }, []);

  /**
   * 设置自定义主题色的函数
   */
  const setCustomThemeColor = useCallback((theme: ThemeColorScheme) => {
    setCustomTheme(theme);
    setCurrentColorScheme('custom');
  }, []);

  /**
   * 获取当前主题色方案的函数
   */
  const getCurrentScheme = useCallback(() => {
    if (currentColorScheme === 'custom' && customTheme) {
      return customTheme;
    }
    return getThemeColorScheme(currentColorScheme);
  }, [currentColorScheme, customTheme]);

  const contextValue = {
    currentColorScheme,
    customTheme,
    changeThemeColor,
    setCustomThemeColor,
    getCurrentScheme,
    mounted,
    updateTrigger,
    forceUpdate,
  };

  return React.createElement(
    ThemeColorContext.Provider,
    { value: contextValue },
    children
  );
}

/**
 * 使用主题色的 Hook
 * 必须在 ThemeColorProvider 内部使用
 */
export function useThemeColor() {
  const ctx = useContext(ThemeColorContext);
  if (!ctx) {
    throw new Error('useThemeColor must be used within a ThemeColorProvider');
  }
  return ctx;
}