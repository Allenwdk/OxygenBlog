import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ClientBlogDetail } from '@/app/blogs//[slug]/ClientBlogDetail';
import 'highlight.js/styles/github-dark.css';
import Link from 'next/link';
import { formatBlogDate } from '@/lib/utils';

/**
 * 博客详情页面的 Props 接口
 * 
 * @interface BlogDetailPageProps
 * @property params - 包含路由参数的 Promise 对象
 * @property params.slug - 博客文章的唯一标识符
 */
interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * 博客文章数据结构接口
 * 
 * @interface BlogPost
 * @property title - 文章标题
 * @property date - 发布日期
 * @property category - 文章分类
 * @property tags - 文章标签数组
 * @property readTime - 预估阅读时间（分钟）
 * @property excerpt - 文章摘要
 * @property content - 文章正文内容（Markdown 格式）
 * @property slug - 文章的唯一标识符
 */
interface BlogPost {
  title: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
  excerpt: string;
  content: string;
  slug: string;
  reference?: Array<{description: string; link: string}>;
}

/**
 * Markdown 文件前置元数据（Front Matter）的类型定义
 * 用于 gray-matter 解析 Markdown 文件头部的 YAML 数据
 * 
 * @interface BlogFrontMatter
 * @property title - 可选的文章标题
 * @property date - 可选的发布日期
 * @property category - 可选的文章分类
 * @property tags - 可选的文章标签数组
 * @property readTime - 可选的预估阅读时间
 * @property excerpt - 可选的文章摘要
 * @property [key: string] - 允许其他未知属性的索引签名
 */
interface BlogFrontMatter {
  title?: string;
  date?: string;
  category?: string;
  tags?: string[];
  readTime?: number;
  excerpt?: string;
  reference?: Array<{description: string; link: string}>;
  [key: string]: any; // 允许其他未知属性
}

/**
 * 根据 slug 获取博客文章内容
 * 
 * 支持三种文件结构：
 * 1. 文件夹形式：/content/blogs/{slug}/index.md（支持 assets 资源文件夹）
 * 2. 文件夹形式：/content/blogs/{slug}/ 中的第一个 .md 文件
 * 3. 单文件形式：/content/blogs/{slug}.md（向后兼容）
 * 
 * 标题处理逻辑：
 * - 如果元数据中有 title，使用元数据中的 title
 * - 如果没有 title，使用文件名（去除 .md 扩展名）作为标题
 * 
 * @param slug - 博客文章的唯一标识符
 * @returns Promise<BlogPost | null> - 返回博客文章数据或 null（如果文章不存在）
 */
async function getBlogContent(slug: string): Promise<BlogPost | null> {
  try {
    const contentDir = path.join(process.cwd(), 'src/content/blogs');
    
    let filePath: string;
    let assetsPath: string | null = null;
    let fileName: string = slug; // 默认使用 slug 作为文件名
    
    // 首先尝试文件夹形式
    const folderPath = path.join(contentDir, slug);
    
    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      // 检查是否有 index.md
      const indexPath = path.join(folderPath, 'index.md');
      
      if (fs.existsSync(indexPath)) {
        // 文件夹形式 - index.md
        filePath = indexPath;
        fileName = 'index';
        assetsPath = path.join(folderPath, 'assets');
      } else {
        // 文件夹形式 - 查找第一个 .md 文件
        try {
          const files = fs.readdirSync(folderPath)
            .filter(file => file.endsWith('.md'))
            .sort(); // 按字母顺序排序，确保结果一致
          
          if (files.length > 0) {
            const firstMdFile = files[0];
            filePath = path.join(folderPath, firstMdFile);
            fileName = path.basename(firstMdFile, '.md');
            assetsPath = path.join(folderPath, 'assets');
          } else {
            // 文件夹中没有 .md 文件，尝试单文件形式
            filePath = path.join(contentDir, `${slug}.md`);
            if (!fs.existsSync(filePath)) {
              return null;
            }
          }
        } catch (readDirError) {
          console.error('Error reading directory:', readDirError);
          // 如果读取目录失败，尝试单文件形式
          filePath = path.join(contentDir, `${slug}.md`);
          if (!fs.existsSync(filePath)) {
            return null;
          }
        }
      }
    } else {
      // 兼容原有的 .md 文件形式
      filePath = path.join(contentDir, `${slug}.md`);
      if (!fs.existsSync(filePath)) {
        return null;
      }
    }
    
    // 读取文件内容，使用 UTF-8 编码处理中文
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let { data, content } = matter(fileContent);
    
    // 类型断言，确保 data 符合 BlogFrontMatter 接口
    const frontMatter = data as BlogFrontMatter;
    
    // 如果有 assets 文件夹，处理图片路径
    if (assetsPath && fs.existsSync(assetsPath)) {
      // 将相对路径的图片替换为正确的路径
      content = content.replace(
        /!\[([^\]]*)\]\((?!http)([^)]+)\)/g,
        (match, alt, src: string) => {
          // 移除开头的 ./ 或 /
          const cleanSrc: string = src.replace(/^\.?\//,  '');
          return `![${alt}](/api/blog-assets/${slug}/${cleanSrc})`;
        }
      );
    }
    
    // 标题处理：优先使用元数据中的 title，否则使用文件名
    const title = frontMatter.title || fileName;
    
    return {
      title: title,
      date: formatBlogDate(frontMatter.date),
      category: frontMatter.category || '其他',
      tags: frontMatter.tags || [],
      readTime: frontMatter.readTime || 5,
      excerpt: frontMatter.excerpt || '',
      content: content,
      slug: slug,
      reference: frontMatter.reference
    };
  } catch (error) {
    console.error('Error reading blog content:', error);
    return null;
  }
}

/**
 * 博客详情页面组件（服务端组件）
 * 
 * 功能特点：
 * - 支持动态路由，根据 slug 参数显示对应的博客文章
 * - 在服务端读取 Markdown 文件内容
 * - 将数据传递给客户端组件进行渲染
 * 
 * @param params - 包含 slug 参数的对象
 * @returns 渲染的博客详情页面
 */
export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  // 在服务端获取博客内容
  const resolvedParams = await params;
  const blogData = await getBlogContent(resolvedParams.slug);
  
  if (!blogData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">文章未找到</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">抱歉，您访问的文章不存在。</p>
          <Link
            href="/blogs" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回博客列表
          </Link>
        </div>
      </div>
    );
  }
  
  return <ClientBlogDetail blog={blogData} />;
}