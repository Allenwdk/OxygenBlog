import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ClientMomentsPage from './ClientMomentsPage';

/**
 * 动态文章接口
 */
interface MomentPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  slug: string;
  images?: string[];
}

/**
 * 动态前置元数据接口
 */
interface MomentFrontMatter {
  title?: string;
  excerpt?: string;
  date?: string;
  author?: string;
}

/**
 * 从 content 中提取图片 src（支持 Markdown 语法和 HTML img 标签）
 */
function extractImages(content: string): string[] {
  const images: string[] = [];

  // 提取 Markdown 图片语法: ![alt](src)
  const mdRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = mdRegex.exec(content)) !== null) {
    images.push(match[2]);
  }

  // 提取 HTML img 标签: <img src="..." ... />
  const htmlRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  while ((match = htmlRegex.exec(content)) !== null) {
    images.push(match[1]);
  }

  return images;
}

/**
 * 解析图片路径，根据当前 basePath 调整为可访问的完整路径
 * GitHub Pages 子路径部署时，需要在 /moments/... 前加上 basePath
 */
function resolveImagePath(src: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  // 只处理以 /moments/ 开头的根相对路径
  if (src.startsWith('/moments/') && basePath) {
    return `${basePath}${src}`;
  }
  return src;
}

/**
 * 处理 content 中所有图片路径（Markdown 语法和 HTML img 标签）
 * 将 /moments/... 路径根据 basePath 转换为可访问的完整路径
 */
function resolveContentImages(content: string): string {
  return content
    // 处理 Markdown 图片语法: ![alt](/moments/...)
    .replace(/(!\[[^\]]*\]\()(\/moments\/[^)]+)(\))/g, (match: string, p1: string, p2: string, p3: string) => `${p1}${resolveImagePath(p2)}${p3}`)
    // 处理 HTML img 标签: <img src="/moments/..." />
    .replace(/(<img[^>]+src=["'])(\/moments\/[^"']+)(["'])/gi, (match: string, p1: string, p2: string, p3: string) => `${p1}${resolveImagePath(p2)}${p3}`);
}

/**
 * 递归扫描目录中的所有 .md 文件
 * 
 * @param dir - 要扫描的目录路径
 * @param baseDir - 基础目录路径，用于计算相对路径
 * @returns 包含所有 .md 文件信息的数组
 */
function scanMarkdownFiles(dir: string, baseDir: string): Array<{filePath: string, relativePath: string, slug: string}> {
  const results: Array<{filePath: string, relativePath: string, slug: string}> = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // 递归扫描子目录
        results.push(...scanMarkdownFiles(itemPath, baseDir));
      } else if (item.endsWith('.md')) {
        // 找到 .md 文件
        const relativePath = path.relative(baseDir, itemPath);
        // 生成 slug：使用相对路径，去除 .md 扩展名，将路径分隔符替换为连字符
        const slug = relativePath.replace(/\.md$/, '').replace(/[\/\\]/g, '-');
        
        results.push({
          filePath: itemPath,
          relativePath,
          slug
        });
      }
    });
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
  
  return results;
}

/**
 * 获取所有动态
 */
function getAllMoments(): MomentPost[] {
  try {
    const contentDir = path.join(process.cwd(), 'src/content/moments');
    
    if (!fs.existsSync(contentDir)) {
      return [];
    }
    
    // 递归扫描所有 .md 文件
    const markdownFiles = scanMarkdownFiles(contentDir, contentDir);
    const momentPosts: MomentPost[] = [];
    
    markdownFiles.forEach(({ filePath, relativePath, slug }) => {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);
        const frontMatter = data as MomentFrontMatter;

        // 获取文章内容用于截取 excerpt
        const { content } = matter(fileContent);

        // 标题处理：优先使用元数据中的 title，否则使用 slug 最后一部分
        const slugParts = slug.split('-');
        const defaultTitle = slugParts[slugParts.length - 1] || '动态';
        const title = frontMatter.title || defaultTitle;

        const rawImages = extractImages(content);
        const images = rawImages.length > 0 ? rawImages.map(resolveImagePath) : undefined;

        // 保留原始 ISO 8601 日期字符串，不截断为 YYYY-MM-DD
        // 客户端组件需要根据完整时间计算相对时间（如"刚刚"、"5分钟前"）
        const rawDate = frontMatter.date;
        let resolvedDate: string;
        if (rawDate && !isNaN(new Date(rawDate).getTime())) {
          resolvedDate = rawDate;
        } else {
          // 如果 front matter 中没有有效日期，尝试从目录名（时间戳）解析
          const timestampMatch = slug.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
          if (timestampMatch) {
            const [, y, m, d, h, min, s] = timestampMatch;
            resolvedDate = new Date(`${y}-${m}-${d}T${h}:${min}:${s}`).toISOString();
          } else {
            resolvedDate = new Date().toISOString();
          }
        }

        momentPosts.push({
          id: slug,
          title: title,
          excerpt: frontMatter.excerpt || content.slice(0, 100),
          // 对 content 中的图片路径也进行 basePath 转换，确保详情页图片能正确加载
          content: resolveContentImages(content),
          date: resolvedDate,
          author: frontMatter.author || 'Unknown',
          slug: slug,
          images: images
        });
      } catch (error) {
        console.error(`Error reading moment file ${relativePath}:`, error);
      }
    });

    // 按日期排序（最新的在前）
    return momentPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error getting all moments:', error);
    return [];
  }
}

/**
 * 动态列表页面（服务端组件）
 * 获取动态数据并传递给客户端组件
 */
export default async function MomentsPage() {
  const momentPosts = getAllMoments();
  
  return <ClientMomentsPage initialPosts={momentPosts} />;
}
