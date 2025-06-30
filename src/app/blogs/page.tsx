import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { formatBlogDate } from '@/lib/utils';
import ClientBlogsPage from './ClientBlogsPage';

/**
 * 博客文章接口
 */
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  slug: string;
  readTime: number;
}

/**
 * 博客前置元数据接口
 */
interface BlogFrontMatter {
  title?: string;
  excerpt?: string;
  date?: string;
  category?: string;
  tags?: string[];
  readTime?: number;
}

/**
 * 获取所有博客文章
 * 
 * 支持三种文件结构：
 * 1. 文件夹形式：/content/blogs/{slug}/index.md
 * 2. 文件夹形式：/content/blogs/{slug}/ 中的第一个 .md 文件
 * 3. 单文件形式：/content/blogs/{slug}.md
 * 
 * 标题处理逻辑与详情页面保持一致：
 * - 如果元数据中有 title，使用元数据中的 title
 * - 如果没有 title，使用文件名（去除 .md 扩展名）作为标题
 */
function getAllBlogs(): BlogPost[] {
  try {
    const contentDir = path.join(process.cwd(), 'src/content/blogs');
    
    if (!fs.existsSync(contentDir)) {
      return [];
    }
    
    const items = fs.readdirSync(contentDir);
    const blogPosts: BlogPost[] = [];
    
    items.forEach(item => {
      const itemPath = path.join(contentDir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // 文件夹形式：优先查找 index.md，否则查找第一个 .md 文件
        const indexPath = path.join(itemPath, 'index.md');
        let filePath: string;
        let fileName: string = item; // 默认使用文件夹名
        
        if (fs.existsSync(indexPath)) {
          filePath = indexPath;
          fileName = 'index';
        } else {
          // 查找第一个 .md 文件
          try {
            const files = fs.readdirSync(itemPath)
              .filter(file => file.endsWith('.md'))
              .sort();
            
            if (files.length > 0) {
              const firstMdFile = files[0];
              filePath = path.join(itemPath, firstMdFile);
              fileName = path.basename(firstMdFile, '.md');
            } else {
              return; // 跳过没有 .md 文件的文件夹
            }
          } catch (readDirError) {
            console.error(`Error reading directory ${item}:`, readDirError);
            return;
          }
        }
        
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(fileContent);
          const frontMatter = data as BlogFrontMatter;
          
          // 标题处理：优先使用元数据中的 title，否则使用文件名
          const title = frontMatter.title || fileName;
          
          blogPosts.push({
            id: item,
            title: title,
            excerpt: frontMatter.excerpt || '',
            date: formatBlogDate(frontMatter.date),
            category: frontMatter.category || '其他',
            tags: frontMatter.tags || [],
            slug: item,
            readTime: frontMatter.readTime || 5
          });
        } catch (error) {
          console.error(`Error reading blog folder ${item}:`, error);
        }
      } else if (item.endsWith('.md')) {
        // 兼容原有的 .md 文件形式
        try {
          const fileContent = fs.readFileSync(itemPath, 'utf8');
          const { data } = matter(fileContent);
          const frontMatter = data as BlogFrontMatter;
          
          const slug = item.replace('.md', '');
          
          // 标题处理：优先使用元数据中的 title，否则使用文件名
          const title = frontMatter.title || slug;
          
          blogPosts.push({
            id: slug,
            title: title,
            excerpt: frontMatter.excerpt || '',
            date: formatBlogDate(frontMatter.date),
            category: frontMatter.category || '其他',
            tags: frontMatter.tags || [],
            slug: slug,
            readTime: frontMatter.readTime || 5
          });
        } catch (error) {
          console.error(`Error reading blog file ${item}:`, error);
        }
      }
    });
    
    // 按日期排序（最新的在前）
    return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error getting all blogs:', error);
    return [];
  }
}

/**
 * 博客列表页面（服务端组件）
 * 获取博客数据并传递给客户端组件
 */
export default async function BlogsPage() {
  // 获取博客数据
  const blogPosts = getAllBlogs();
  
  return <ClientBlogsPage initialPosts={blogPosts} />;
}