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
    // 在 CI / 生产构建环境中禁用本地 API，避免静态导出时产生干扰
    if (process.env.GITHUB_ACTIONS || process.env.VERCEL) {
      return NextResponse.json(
        { message: '本地 API 仅在本地开发环境下可用' },
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
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    // 目录路径
    // content.md 保存到 src/content/moments/（构建时读取）
    const contentBaseDir = path.join(process.cwd(), 'src', 'content', 'moments');
    const contentDir = path.join(contentBaseDir, author, timestamp);

    // 图片保存到 public/moments/（开发服务器可直接通过 /moments/... 访问）
    const imagesBaseDir = path.join(process.cwd(), 'public', 'moments');
    const imagesDir = path.join(imagesBaseDir, author, timestamp);

    // 确保目录存在
    await fs.mkdir(contentDir, { recursive: true });
    await fs.mkdir(imagesDir, { recursive: true });

    // 构建 front matter（使用 ISO 8601 格式保留完整时间信息）
    const isoDate = now.toISOString();

    // 构建 Markdown 图片引用（统一使用根相对路径，与前端提交到 GitHub 的逻辑保持一致）
    let imageTags = '';
    if (images && images.length > 0) {
      for (const image of images) {
        if (image.name && image.data) {
          // 去除 base64 data URL 前缀
          const base64Data = image.data.replace(/^data:image\/\w+;base64,/, '');
          const imagePath = path.join(imagesDir, image.name);
          await fs.writeFile(imagePath, base64Data, 'base64');

          // 在 content.md 中使用 Markdown 图片语法，路径与前端提交保持一致
          imageTags += `![${image.name}](/moments/${author}/${timestamp}/${image.name})\n`;
        }
      }
    }

    const frontMatter = `---
author: ${author}
date: ${isoDate}
---

`;

    // 写入 content.md（正文 + Markdown 图片引用）
    const contentMdPath = path.join(contentDir, 'content.md');
    await fs.writeFile(contentMdPath, frontMatter + content + '\n' + imageTags, 'utf-8');

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
