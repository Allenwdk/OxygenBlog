/**
 * 判断是否为外部图片链接
 */
export function isExternalImage(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//');
}

/**
 * 处理图片路径，正确添加 basePath 支持
 * 
 * - 外部链接 (http://, https://, //)：直接返回
 * - 相对路径 (./ , ../)：移除前缀后转为 /cleanPath
 * - 绝对路径 (/xxx)：直接添加 basePath
 * - 纯文件名 (filename.png)：视为 public 目录下路径，返回 /basePath/filename 或 /filename
 */
export function processImagePath(src: string): string {
  // 如果是外部链接，直接返回
  if (isExternalImage(src)) {
    return src;
  }
  
  // 获取 basePath
  const basePath = typeof process !== 'undefined' 
    ? process.env.NEXT_PUBLIC_BASE_PATH || ''
    : '';
  
  // 如果是相对路径（如 ./assets/example.svg 或 ../assets/example.svg），转换为绝对路径
  if (src.startsWith('./') || src.startsWith('../')) {
    const cleanPath = src.replace(/^\.\.?\//, '');
    return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
  }
  
  // 如果已经是绝对路径（以/开头），添加 basePath
  if (src.startsWith('/')) {
    return basePath ? `${basePath}${src}` : src;
  }
  
  // 其他情况（纯文件名等），假设为相对于 public 目录的路径
  return basePath ? `${basePath}/${src}` : `/${src}`;
}
