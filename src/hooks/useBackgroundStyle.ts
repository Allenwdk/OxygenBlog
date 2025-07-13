import { useMemo } from 'react';
import { enableBackground, backgroundImage } from '@/setting/WebSetting';

type PageType = 'home' | 'blogs' | 'about' | 'blog-detail';

interface StyleConfig {
  className: string;
  style?: React.CSSProperties;
}

export function useBackgroundStyle(pageType: PageType) {
  const isBackgroundEnabled = enableBackground && backgroundImage;

  const containerStyle = useMemo((): StyleConfig => {
    if (isBackgroundEnabled) {
      switch (pageType) {
        case 'home':
          return {
            className: 'min-h-screen py-8 pt-20',
            style: {}
          };
        case 'blogs':
          return {
            className: 'min-h-screen py-8 pt-20',
            style: {}
          };
        case 'about':
          return {
            className: 'min-h-screen py-8 pt-20',
            style: {}
          };
        case 'blog-detail':
          return {
            className: 'min-h-screen py-8 pt-20',
            style: {}
          };
        default:
          return {
            className: 'min-h-screen bg-background py-8 pt-20',
            style: {}
          };
      }
    } else {
      return {
        className: 'min-h-screen bg-background py-8 pt-20',
        style: {}
      };
    }
  }, [isBackgroundEnabled, pageType]);

  const sectionStyle = useMemo((): StyleConfig => {
    if (isBackgroundEnabled) {
      return {
        className: 'relative z-10',
        style: {}
      };
    } else {
      switch (pageType) {
        case 'home':
          return {
            className: 'relative z-10',
            style: {}
          };
        case 'blogs':
          return {
            className: 'relative z-10',
            style: {}
          };
        case 'about':
          return {
            className: 'relative z-10',
            style: {}
          };
        case 'blog-detail':
          return {
            className: 'relative z-10',
            style: {}
          };
        default:
          return {
            className: 'relative z-10',
            style: {}
          };
      }
    }
  }, [isBackgroundEnabled, pageType]);

  const buttonStyle = useMemo((): StyleConfig => {
    if (isBackgroundEnabled) {
      return {
        className: 'bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
        style: {}
      };
    } else {
      return {
        className: 'bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5',
        style: {}
      };
    }
  }, [isBackgroundEnabled]);

  const navigationStyle = useMemo((): StyleConfig => {
    // 导航栏始终保持原有样式，不受背景图片影响
    return {
      className: 'fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50',
      style: {}
    };
  }, []);

  const footerStyle = useMemo((): StyleConfig => {
    if (isBackgroundEnabled) {
      return {
        className: 'bg-white/30 dark:bg-gray-900/30 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50',
        style: {}
      };
    } else {
      return {
        className: 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50',
        style: {}
      };
    }
  }, [isBackgroundEnabled]);

  return {
    containerStyle,
    sectionStyle,
    buttonStyle,
    navigationStyle,
    footerStyle,
    isBackgroundEnabled
  };
}