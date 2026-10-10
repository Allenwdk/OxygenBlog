/**
 * 画廊服务器端工具函数
 * 仅用于服务器端，包含文件系统操作
 *
 * 本站画廊只扫描本地 public/gallery 目录，分类直接由目录结构推导：
 *   public/gallery/<主分类>/<子分类>/<图片>
 * 因此不再需要 fork 里那张按目录路径硬编码的分类映射表，也不依赖任何远程图床。
 */

import fs from 'node:fs';
import path from 'node:path';

import {
  type GalleryImage,
  type ImageCategoryTree,
  ImageSource,
  buildCategoryTree,
} from '@/lib/galleryTypes';

// 重新导出类型与纯函数，方便服务端模块统一引用
export type {
  GalleryImage,
  ImageCategory,
  ImageCategoryTree,
} from '@/lib/galleryTypes';
export {
  buildCategoryTree,
  getImageCategories,
  filterImagesByCategory,
  getCategorySortOrder,
} from '@/lib/galleryTypes';

/** 允许的图片扩展名（不含 svg：画廊只收录位图） */
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];

/** 未放在任何子目录下的图片归入此分类 */
const DEFAULT_CATEGORY = '未分类';

/**
 * 检查文件是否为图片
 */
function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

/**
 * 生成唯一图片ID
 */
function generateImageId(filePath: string): string {
  return filePath
    .replace(/[\\/]/g, '-')
    .replace(/\./g, '-')
    .toLowerCase();
}

/**
 * 由相对目录路径推导分类
 * @param normalizedDirPath - 相对 public/gallery 的目录路径（以 / 分隔）
 */
function categoryFromDir(normalizedDirPath: string): { category: string; subCategory?: string } {
  if (!normalizedDirPath || normalizedDirPath === '.') {
    return { category: DEFAULT_CATEGORY };
  }

  const segments = normalizedDirPath.split('/').filter(Boolean);
  if (segments.length === 0) {
    return { category: DEFAULT_CATEGORY };
  }

  return {
    category: segments[0],
    subCategory: segments.length > 1 ? segments.slice(1).join('/') : undefined,
  };
}

/**
 * 递归扫描目录中的所有图片文件
 * @param dir - 要扫描的目录路径
 * @param baseDir - 基础目录路径，用于计算相对路径和分类
 */
function scanImageFiles(dir: string, baseDir: string): GalleryImage[] {
  const results: GalleryImage[] = [];

  try {
    const items = fs.readdirSync(dir);

    items.forEach((item: string) => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        results.push(...scanImageFiles(itemPath, baseDir));
      } else if (isImageFile(item)) {
        const relativePath = path.relative(baseDir, itemPath);
        const fullPath = relativePath.replace(/\\/g, '/');
        const normalizedDirPath = path.dirname(fullPath).replace(/\\/g, '/');
        const filename = path.basename(itemPath);
        const { category, subCategory } = categoryFromDir(normalizedDirPath);

        results.push({
          id: generateImageId(relativePath),
          // 不带 basePath：由渲染层统一过一次 processImagePath
          src: `/gallery/${fullPath}`,
          alt: filename.replace(path.extname(filename), ''),
          source: ImageSource.Local,
          category,
          subCategory,
          createdAt: new Date().toISOString(),
        });
      }
    });
  } catch (error) {
    console.error(`扫描目录失败 ${dir}:`, error);
  }

  return results;
}

/**
 * 获取所有本地图片（public/gallery 下）
 * 目录不存在时返回空数组
 */
export function getAllLocalImages(): GalleryImage[] {
  try {
    const galleryDir = path.join(process.cwd(), 'public', 'gallery');

    if (!fs.existsSync(galleryDir)) {
      return [];
    }

    return scanImageFiles(galleryDir, galleryDir);
  } catch (error) {
    console.error('读取画廊图片失败:', error);
    return [];
  }
}

/**
 * 获取所有画廊图片
 */
export function getAllImages(): GalleryImage[] {
  return getAllLocalImages();
}

/**
 * 获取所有分类（树形结构）
 */
export function getAllCategories(images: GalleryImage[]): ImageCategoryTree[] {
  return buildCategoryTree(images);
}
