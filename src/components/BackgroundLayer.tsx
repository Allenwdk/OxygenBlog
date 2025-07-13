'use client';

import { 
  backgroundImage, 
  enableBackground, 
  backgroundMode, 
  backgroundFixed
} from '@/setting/WebSetting';

/**
 * 网站背景组件
 * 使用 CSS background-image 在最底层显示背景图片
 */
export default function BackgroundLayer() {
  if (!enableBackground || !backgroundImage) {
    return null;
  }

  // 处理 basePath，确保在不同环境下都能正确加载图片
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const fullImagePath = `${basePath}${backgroundImage}`;

  console.log('BackgroundLayer - Image path:', fullImagePath);
  console.log('BackgroundLayer - Background mode:', backgroundMode);
  console.log('BackgroundLayer - Background fixed:', backgroundFixed);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -50,
        backgroundImage: `url("${fullImagePath}")`,
        backgroundSize: backgroundMode === 'cover' ? 'cover' : backgroundMode === 'contain' ? 'contain' : 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: backgroundFixed ? 'fixed' : 'scroll',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}