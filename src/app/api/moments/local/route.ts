import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface ImageItem {
  name: string;
  data: string;
}

interface MomentsRequest {
  author: string;
  content: string;
  images?: ImageItem[];
}

export async function POST(request: NextRequest) {
  try {
    // GitHub Pages 环境检测
    if (process.env.BLOG_GITHUB_TOKEN) {
      return NextResponse.json(
        { message: '本地 API 仅在开发环境下可用' },
        { status: 501 }
      );
    }

    const body = await request.json() as MomentsRequest;
    const { author, content, images } = body;

    // 参数校验
    if (!author || !content) {
      return NextResponse.json(
        { message: '缺少必要参数：author 和 content' },
        { status: 400 }
      );
    }

    // 生成时间戳（yyyyMMddHHmmss）
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:Z.]/g, '')
      .slice(0, 14);

    // 目录路径
    const baseDir = path.join(process.cwd(), 'src', 'content', 'moments');
    const authorDir = path.join(baseDir, author);
    const fullDirPath = path.join(authorDir, timestamp);

    // 确保所有目录层级都存在（包括作者目录和时间戳子目录）
    await fs.mkdir(fullDirPath, { recursive: true });

    //// 生成 front matter + 图片标签（相对路径指向 public/shared/moments/）
    const now = new Date().toISOString();
    let imageTags = '';
    if (images && images.length > 0) {
      for (const image of images) {
        imageTags += `<img src="shared/moments/${author}/${timestamp}/${image.name}" alt="${image.name}" />\n`;
      }
    }

    const frontMatter = `---
author: ${author}
date: ${now}
timestamp: ${timestamp}
tags: []
---

`;

    // 写入 content.md（包含图片引用）
    const contentMdPath = path.join(fullDirPath, 'content.md');
    await fs.writeFile(contentMdPath, frontMatter + content + imageTags, 'utf-8');

    // 保存图片（如果有）
    if (images && images.length > 0) {
      for (const image of images) {
        if (image.name && image.data) {
          const imagePath = path.join(fullDirPath, image.name);
          // 去除 base64 data URL 前缀（如果有的话）
          const base64Data = image.data.replace(/^data:image\/\w+;base64,/, '');
          await fs.writeFile(imagePath, base64Data, 'base64');
        }
      }
    }

    return NextResponse.json({
      message: '动态保存成功',
      filePath: `src/content/moments/${author}/${timestamp}/content.md`,
      author,
      timestamp,
    });
  } catch (error) {
    console.error('本地保存动态错误:', error);
    return NextResponse.json(
      { message: `保存失败: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 }
    );
  }
}
