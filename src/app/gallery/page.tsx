import { getAllImages, getAllCategories } from '@/lib/galleryUtils';
import GalleryClient from './GalleryClient';
import type { Metadata } from 'next';

/**
 * 画廊页面 SEO 元数据配置
 */
export const metadata: Metadata = {
  title: '画廊',
  description: '浏览本站的图片画廊，图片来自 public/gallery 目录，按文件夹自动分类，支持分类筛选、全屏预览与缩放。',
  keywords: ['画廊', '图片', '相册', '图片预览'],
  openGraph: {
    title: '画廊 | Allenwdk 的博客',
    description: '浏览本站的图片画廊，按文件夹自动分类。',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '画廊 | Allenwdk 的博客',
    description: '浏览本站的图片画廊，按文件夹自动分类。',
  },
};

// 画廊页面（服务端组件）：构建期扫描 public/gallery
const GalleryPage = () => {
  const images = getAllImages();
  const categories = getAllCategories(images);

  return <GalleryClient initialImages={images} initialCategories={categories} />;
};

export default GalleryPage;
