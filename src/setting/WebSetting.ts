/**
 * 网站基础配置
 */

export const webTitle = "0xygen Blog"; // 网站标题：浏览器显示
export const webDescription = "个人博客"; // 网站描述：浏览器显示

/**
 * 网站背景配置
 */
export const backgroundImage = ""; // 网站整体背景图片路径：publci背景下
export const enableBackground = false; // 是否启用背景图片

/**
 * 背景图片显示模式配置
 * - 'cover': 覆盖整个容器，可能会裁剪图片
 * - 'contain': 完整显示图片，可能会有空白区域
 * - 'fixed': 固定背景，滚动时背景不动
 */
export const backgroundMode = "cover"; // 背景图片显示模式
export const backgroundFixed = true; // 是否固定背景（视差效果）

/**
 * 背景遮罩配置
 * 控制背景图片上的遮罩层强度，影响内容可读性
 */
export const enableBackgroundOverlay = false; // 是否启用背景遮罩
export const overlayOpacity = 0.1; // 遮罩不透明度 (0-1)
