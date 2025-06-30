import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

/**
 * API 路由：动态服务博客内容中的图片资源
 * 支持从 src/content 目录下的任意位置获取图片文件
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  
  try {
    const { path: imagePath } = params;
    
    // 构建完整的文件路径
    const contentDir = path.join(process.cwd(), 'src/content');
    const filePath = path.join(contentDir, ...imagePath);
    
    // 安全检查：确保文件路径在 content 目录内
    const normalizedContentDir = path.normalize(contentDir);
    const normalizedFilePath = path.normalize(filePath);
    
    if (!normalizedFilePath.startsWith(normalizedContentDir)) {
      return new NextResponse('Forbidden: Path traversal detected', { status: 403 });
    }
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    // 检查是否为图片文件
    const ext = path.extname(filePath).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.bmp'];
    
    if (!allowedExtensions.includes(ext)) {
      return new NextResponse('File type not allowed', { status: 400 });
    }
    
    // 读取文件
    const fileBuffer = fs.readFileSync(filePath);
    
    // 根据文件扩展名设置 Content-Type
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
      case '.ico':
        contentType = 'image/x-icon';
        break;
      case '.bmp':
        contentType = 'image/bmp';
        break;
    }
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error serving blog image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}