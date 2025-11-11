import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Next.js export config
export const dynamic = 'force-static';

// 定义类型接口
interface BlogMetadata {
  title: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
  excerpt: string;
}

interface BlogData {
  title?: string;
  date?: string;
  category?: string;
  tags?: string[];
  readTime?: number;
  excerpt?: string;
  publishedAt?: string;
  updatedAt?: string;
  slug?: string;
  draft?: boolean;
}

/**
 * 发布文章到文件系统
 * POST /api/blogs/publish
 */
export async function POST(request: NextRequest) {
  try {
    const { content, metadata }: { content: string; metadata: BlogMetadata } = await request.json();
    
    // 验证必要字段
    if (!content || !metadata?.title?.trim()) {
      return NextResponse.json(
        { success: false, error: '缺少必要字段: content和title' },
        { status: 400 }
      );
    }

    // 生成文件路径
    const contentDir = path.join(process.cwd(), 'src/content/blogs');
    
    // 确保目录存在
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    // 生成slug并检查是否已存在
    const slug = generateSlug(metadata.title);
    const existingFile = findExistingFile(contentDir, slug);
    let filename: string;
    
    if (existingFile) {
      // 如果文件已存在，询问是否覆盖或使用新文件名
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const newFilename = `${slug}-${timestamp}.md`;
      filename = newFilename;
    } else {
      filename = `${slug}.md`;
    }
    
    const filePath = path.join(contentDir, filename);

    // 生成完整的markdown内容
    const fullContent = matter.stringify(content, {
      title: metadata.title,
      date: metadata.date,
      category: metadata.category,
      tags: metadata.tags,
      readTime: metadata.readTime,
      excerpt: metadata.excerpt,
      draft: false,
      publishedAt: new Date().toISOString(),
      slug: slug
    } as Record<string, any>);

    // 写入文件
    fs.writeFileSync(filePath, fullContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: '文章发布成功',
      data: {
        filename,
        path: `src/content/blogs/${filename}`,
        title: metadata.title,
        slug: slug,
        url: `/blogs/${slug}`
      }
    });

  } catch (error) {
    console.error('发布文章失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

/**
 * 生成文章slug
 * @param title - 文章标题
 * @returns 格式化后的slug
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 将空格、下划线、连字符替换为单连字符
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
}

/**
 * 查找现有的文件
 * @param contentDir - 内容目录
 * @param slug - 文章slug
 * @returns 找到的文件路径，如果没有找到则返回null
 */
function findExistingFile(contentDir: string, slug: string): string | null {
  try {
    if (!fs.existsSync(contentDir)) {
      return null;
    }

    const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data }: { data: BlogData } = matter(fileContent);
      
      // 检查slug是否匹配或文件名前缀匹配
      if (data.slug === slug || file.startsWith(slug + '.')) {
        return file;
      }
    }
    
    return null;
  } catch (error) {
    console.error('查找现有文件时出错:', error);
    return null;
  }
}

/**
 * 获取已发布文章列表
 * GET /api/blogs/publish
 */
export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), 'src/content/blogs');
    
    if (!fs.existsSync(contentDir)) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
    const publishedPosts = files.map(filename => {
      const filePath = path.join(contentDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content }: { data: BlogData; content: string } = matter(fileContent);
      
      return {
        filename,
        title: data.title || filename.replace('.md', ''),
        date: data.date || new Date().toISOString(),
        category: data.category || '其他',
        tags: data.tags || [],
        excerpt: data.excerpt || content.substring(0, 200) + '...',
        publishedAt: data.publishedAt || new Date().toISOString(),
        slug: data.slug || generateSlug((data.title || filename.replace('.md', '')).toString()),
        readTime: data.readTime || 1,
        size: fs.statSync(filePath).size
      };
    });

    return NextResponse.json({
      success: true,
      data: publishedPosts
    });

  } catch (error) {
    console.error('获取已发布文章列表失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

/**
 * 更新已发布文章
 * PUT /api/blogs/publish
 */
export async function PUT(request: NextRequest) {
  try {
    const { content, metadata, filename }: { content: string; metadata: BlogMetadata; filename: string } = await request.json();
    
    // 验证必要字段
    if (!content || !metadata.title || !filename) {
      return NextResponse.json(
        { success: false, error: '缺少必要字段: content, title, filename' },
        { status: 400 }
      );
    }

    // 生成文件路径
    const contentDir = path.join(process.cwd(), 'src/content/blogs');
    const filePath = path.join(contentDir, filename);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: '文件不存在' },
        { status: 404 }
      );
    }

    // 生成完整的markdown内容
    const fullContent = matter.stringify(content, {
      title: metadata.title,
      date: metadata.date,
      category: metadata.category,
      tags: metadata.tags,
      readTime: metadata.readTime,
      excerpt: metadata.excerpt,
      draft: false,
      updatedAt: new Date().toISOString()
    } as Record<string, any>);

    // 写入文件
    fs.writeFileSync(filePath, fullContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: '文章更新成功',
      data: {
        filename,
        path: `src/content/blogs/${filename}`,
        title: metadata.title
      }
    });

  } catch (error) {
    console.error('更新文章失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

/**
 * 删除已发布文章
 * DELETE /api/blogs/publish
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json(
        { success: false, error: '缺少filename参数' },
        { status: 400 }
      );
    }

    // 生成文件路径
    const contentDir = path.join(process.cwd(), 'src/content/blogs');
    const filePath = path.join(contentDir, filename);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: '文件不存在' },
        { status: 404 }
      );
    }

    // 删除文件
    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      message: '文章删除成功',
      data: {
        filename
      }
    });

  } catch (error) {
    console.error('删除文章失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}