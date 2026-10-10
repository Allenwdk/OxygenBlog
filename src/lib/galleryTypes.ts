// 画廊图片类型定义与纯函数
// 此文件不包含任何 Node.js 模块依赖，可安全在客户端使用

// 图片来源类型
export enum ImageSource {
  Local = 'local',
  Remote = 'remote'
}

// 通用预览图片类型（用于博客文章等非画廊场景）
export interface PreviewImage {
  id: string; // 唯一标识符
  src: string; // 图片URL
  alt: string; // 图片描述
  category?: string; // 分类名称（可选）
  thumbnail?: string; // 缩略图URL（可选）
}

// 图片信息类型
export interface GalleryImage extends PreviewImage {
  fallbackSrc?: string; // 备用图片URL（可选）
  source: ImageSource; // 图片来源
  category: string; // 主分类名称（用于显示在标签页上）
  subCategory?: string; // 子分类名称（可选）
  width?: number; // 图片宽度（可选）
  height?: number; // 图片高度（可选）
  createdAt: string; // 创建时间
  updatedAt?: string; // 更新时间（可选）
  size?: number; // 文件大小（字节，可选）
}

// 树形分类结构
export interface ImageCategoryTree {
  name: string;           // 分类名称
  slug: string;           // 分类标识
  count: number;          // 图片数量（包含子分类）
  source: ImageSource;    // 分类来源
  subCategories?: ImageCategoryTree[];  // 子分类列表
  parentCategory?: string; // 父分类名称（可选）
  description?: string;    // 分类描述
  icon?: string;           // 分类图标
  sortOrder?: number;      // 排序顺序
}

// 图片分类类型
export interface ImageCategory {
  name: string; // 分类名称
  slug: string; // 分类标识
  count: number; // 图片数量
  source: ImageSource; // 分类来源
  subCategories?: ImageCategoryTree[];
  parentCategory?: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
}

// 图片加载状态类型
export type ImageLoadStatus = 'loading' | 'loaded' | 'failed';

// 画廊状态类型
export interface GalleryState {
  images: GalleryImage[]; // 所有图片
  categories: ImageCategoryTree[]; // 所有分类（树形结构）
  selectedCategory: string | null; // 当前选中分类
  selectedSubCategory: string | null; // 当前选中子分类
  selectedImage: GalleryImage | null; // 当前选中图片
  isPreviewOpen: boolean; // 预览模态框是否打开
  isLoading: boolean; // 是否正在加载图片
  error: string | null; // 错误信息
}

// 图片预览状态类型
export interface ImagePreviewState {
  currentIndex: number; // 当前预览图片索引
  images: GalleryImage[]; // 预览图片列表
  isOpen: boolean; // 预览是否打开
}

/**
 * 生成分类 slug
 * 保留中文、字母、数字、下划线和连字符
 */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9一-龥_-]/g, '');
}

/**
 * 获取分类的显示顺序
 *
 * 本站画廊直接按 public/gallery 的目录结构推导分类，没有额外的映射表，
 * 因此顺序即分类名的字典序。
 */
export function getCategorySortOrder(
  _mainCategory: string,
  _subCategory?: string
): number {
  return 99;
}

/**
 * 构建树形分类结构
 * @param images - 图片数组
 * @returns 树形分类数组
 */
export function buildCategoryTree(images: GalleryImage[]): ImageCategoryTree[] {
  // 1. 按主分类分组
  const mainCategoryMap = new Map<string, GalleryImage[]>();

  images.forEach(image => {
    if (!mainCategoryMap.has(image.category)) {
      mainCategoryMap.set(image.category, []);
    }
    mainCategoryMap.get(image.category)?.push(image);
  });

  // 2. 构建树形结构
  const categoryTrees: ImageCategoryTree[] = [];

  mainCategoryMap.forEach((categoryImages, mainCategoryName) => {
    const mainCategoryCount = categoryImages.length;

    // 按子分类分组
    const subCategoryMap = new Map<string, GalleryImage[]>();

    categoryImages.forEach(image => {
      if (image.subCategory) {
        if (!subCategoryMap.has(image.subCategory)) {
          subCategoryMap.set(image.subCategory, []);
        }
        subCategoryMap.get(image.subCategory)?.push(image);
      }
    });

    const mainCategorySlug = toSlug(mainCategoryName) || `category-${categoryTrees.length + 1}`;

    const subCategories: ImageCategoryTree[] = [];

    subCategoryMap.forEach((subCategoryImages, subCategoryName) => {
      subCategories.push({
        name: subCategoryName,
        slug: `${mainCategorySlug}-${toSlug(subCategoryName)}`,
        count: subCategoryImages.length,
        source: ImageSource.Local,
        parentCategory: mainCategoryName
      });
    });

    subCategories.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));

    categoryTrees.push({
      name: mainCategoryName,
      slug: mainCategorySlug,
      count: mainCategoryCount,
      source: ImageSource.Local,
      subCategories: subCategories.length > 0 ? subCategories : undefined
    });
  });

  // 3. 主分类按名称排序
  categoryTrees.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));

  return categoryTrees;
}

/**
 * 按分类分组图片
 * @param images - 图片数组
 * @returns 分类数组
 */
export function getImageCategories(images: GalleryImage[]): ImageCategory[] {
  const categoryMap = new Map<string, number>();

  images.forEach(image => {
    const count = categoryMap.get(image.category) || 0;
    categoryMap.set(image.category, count + 1);
  });

  const categories: ImageCategory[] = [];
  categoryMap.forEach((count, name) => {
    categories.push({
      name,
      slug: toSlug(name) || name,
      count,
      source: ImageSource.Local
    });
  });

  return categories.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
}

/**
 * 按分类过滤图片
 * @param images - 图片数组
 * @param category - 分类名称（null 表示所有分类）
 * @param subCategory - 子分类名称（可选）
 * @returns 过滤后的图片数组
 */
export function filterImagesByCategory(
  images: GalleryImage[],
  category: string | null,
  subCategory?: string | null
): GalleryImage[] {
  if (!category) {
    return [...images].sort((a, b) => {
      const byCategory = a.category.localeCompare(b.category, 'zh-Hans-CN');
      if (byCategory !== 0) {
        return byCategory;
      }
      return (a.subCategory || '').localeCompare(b.subCategory || '', 'zh-Hans-CN');
    });
  }

  if (subCategory) {
    return images.filter(image => image.category === category && image.subCategory === subCategory);
  }

  return images.filter(image => image.category === category);
}

/**
 * 预加载图片
 * @param images - 图片数组
 * @param count - 预加载数量（默认10）
 */
export function preloadImages(images: GalleryImage[], count: number = 10): void {
  if (typeof window === 'undefined') {
    return;
  }

  images.slice(0, count).forEach(image => {
    const img = new Image();
    img.src = image.src;
  });
}
