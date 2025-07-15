'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { applyThemeColors } from '@/setting/WebSetting';

/**
 * 主题色应用组件
 * 监听主题变化并应用相应的主题色
 */
function ThemeColorApplier() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // 应用主题色
    applyThemeColors(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  return null;
}

/**
 * 主题提供者组件
 * 为应用提供主题切换功能和主题色应用
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeColorApplier />
      {children}
    </NextThemesProvider>
  );
}