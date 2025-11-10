import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * 保存文章草稿到文件系统
 * POST /api/blogs/save-draft
 */
export async function POST(request: NextRequest) {
  try {
    const { content, metadata } = await request.json();
    
    // 验证必要字段
    if (!content || !metadata.title) {
      return NextResponse.json(
        { success: false, error: '缺少必要字段: content和title' },
        { status: 400 }
      );
    }

    // 生成文件路径
    const contentDir = path.join(process.cwd(), 'src/content/blogs');
    const draftsDir = path.join(contentDir, 'drafts');
    
    // 确保目录存在
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    if (!fs.existsSync(draftsDir)) {
      fs.mkdirSync(draftsDir, { recursive: true });
    }

    // 生成唯一文件名（防止重复）
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedTitle = metadata.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const filename = `${sanitizedTitle}-${timestamp}.md`;
    const filePath = path.join(draftsDir, filename);

    // 生成完整的markdown内容
    const fullContent = matter.stringify(content, {
      title: metadata.title,
      date: metadata.date,
      category: metadata.category,
      tags: metadata.tags,
      readTime: metadata.readTime,
      excerpt: metadata.excerpt,
      draft: true,
      createdAt: new Date().toISOString()
    });

    // 写入文件
    fs.writeFileSync(filePath, fullContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: '草稿保存成功',
      data: {
        filename,
        path: `src/content/blogs/drafts/${filename}`,
        title: metadata.title
      }
    });

  } catch (error) {
    console.error('保存草稿失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

/**
 * 获取草稿列表
 * GET /api/blogs/save-draft
 */
export async function GET() {
  try {
    const draftsDir = path.join(process.cwd(), 'src/content/blogs/drafts');
    
    if (!fs.existsSync(draftsDir)) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const files = fs.readdirSync(draftsDir).filter(file => file.endsWith('.md'));
    const drafts = files.map(filename => {
      const filePath = path.join(draftsDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      return {
        filename,
        title: data.title || filename.replace('.md', ''),
        date: data.date || new Date().toISOString(),
        category: data.category || '其他',
        tags: data.tags || [],
        excerpt: data.excerpt || content.substring(0, 200) + '...',
        createdAt: data.createdAt || new Date().toISOString(),
        size: fs.statSync(filePath).size
      };
    });

    return NextResponse.json({
      success: true,
      data: drafts
    });

  } catch (error) {
    console.error('获取草稿列表失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}