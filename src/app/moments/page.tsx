import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { formatBlogDate } from '@/lib/utils';
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
 * 从 content 中提取 markdown 图片 src
 */
function extractImages(content: string): string[] {
  const images: string[] = [];
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    // match[2] is the src
    images.push(match[2]);
  }
  return images;
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

        const images = extractImages(content);

        momentPosts.push({
          id: slug,
          title: title,
          excerpt: frontMatter.excerpt || content.slice(0, 100),
          content: content,
          date: formatBlogDate(frontMatter.date),
          author: frontMatter.author || 'Unknown',
          slug: slug,
          images: images.length > 0 ? images : undefined
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
