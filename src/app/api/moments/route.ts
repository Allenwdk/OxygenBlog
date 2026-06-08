import { NextRequest, NextResponse } from 'next/server';

interface ImageItem {
  name: string;
  data: string;
}

interface MomentsBody {
  author: string;
  content: string;
  images?: ImageItem[];
}

function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function generateFrontMatter(author: string): string {
  const isoDate = new Date().toISOString();
  return `---
author: ${author}
date: ${isoDate}
---`;
}

async function getFilePathSha(
  owner: string,
  repo: string,
  branch: string,
  token: string,
  filePath: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Blog-Platform/1.0',
        },
      }
    );

    if (response.ok) {
      const fileData = await response.json() as { sha: string };
      return fileData.sha;
    }
  } catch {
    // 文件不存在或获取失败，返回 null
  }
  return null;
}

async function uploadFile(
  owner: string,
  repo: string,
  branch: string,
  token: string,
  filePath: string,
  content: string,
  message: string,
  sha: string | null = null
): Promise<boolean> {
  const currentSha = await getFilePathSha(owner, repo, branch, token, filePath);

  const contentBase64 = Buffer.from(content).toString('base64');

  const requestBody = {
    message,
    content: contentBase64,
    branch,
    ...(sha && { sha }),
    ...(currentSha && !sha && { sha: currentSha }),
  };

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Blog-Platform/1.0',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errorMessage = `GitHub API 错误: ${response.status}`;
    try {
      const errorData = await response.json() as { message: string };
      errorMessage = `GitHub API 错误: ${errorData.message}`;
    } catch {
      const errorText = await response.text();
      errorMessage = `GitHub API 错误: ${response.status} - ${errorText.substring(0, 200)}`;
    }
    throw new Error(errorMessage);
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MomentsBody;
    const { author, content, images } = body;

    if (!author || !content) {
      return NextResponse.json(
        { message: '缺少必要参数：author 和 content' },
        { status: 400 }
      );
    }

    // 获取环境变量
    const token = process.env.BLOG_GITHUB_TOKEN;
    const owner = process.env.BLOG_GITHUB_OWNER;
    const repo = process.env.BLOG_GITHUB_REPO;
    const branch = process.env.BLOG_GITHUB_BRANCH || 'main';

    if (!token || !owner || !repo) {
      console.error('GitHub 配置缺失:', {
        hasToken: !!token,
        hasOwner: !!owner,
        hasRepo: !!repo,
        branch,
      });
      return NextResponse.json(
        { message: 'GitHub 配置不完整，请检查环境变量' },
        { status: 500 }
      );
    }

   // 生成时间戳和目录路径（图片和 content.md 存到同目录 public/shared/moments/）
    const timestamp = generateTimestamp();
    const sharedDirPath = `public/shared/moments/${author}/${timestamp}`;
    const contentFilePath = `${sharedDirPath}/content.md`;

    // 生成 front matter + 图片标签（相对路径，纯文件名）
    const frontMatter = generateFrontMatter(author);
    let imageTags = '';
    if (images && images.length > 0) {
      for (const image of images) {
        const imageName = image.name || 'image.png';
        imageTags += `<img src="${imageName}" alt="${imageName}" />\n`;
      }
    }

    // 上传 content.md
    const commitMessage = `发布动态: ${author} - ${timestamp}`;
    await uploadFile(owner, repo, branch, token, contentFilePath, `${frontMatter}\n\n${content}${imageTags}`, commitMessage);

    // 上传图片（存到同目录，静态导出可访问）
    if (images && images.length > 0) {
      for (const image of images) {
        const imageName = image.name || 'image.png';
        const imagePath = `${sharedDirPath}/${imageName}`;
        const imageBase64 = Buffer.from(image.data, 'base64');

        await uploadFile(
          owner,
          repo,
          branch,
          token,
          imagePath,
          imageBase64.toString('base64'),
          commitMessage,
        );
      }
    }

    return NextResponse.json({
      message: '动态发布成功',
      path: contentFilePath,
      timestamp,
    });

  } catch (error) {
    console.error('发布动态错误:', error);
    return NextResponse.json(
      { message: `服务器错误: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 }
    );
  }
}
