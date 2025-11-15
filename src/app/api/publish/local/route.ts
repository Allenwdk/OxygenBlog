import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { fileName: string; content: string; path: string };
    const { fileName, content, path: filePath } = body;

    if (!fileName || !content || !filePath) {
      return NextResponse.json(
        { message: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 确保目录存在
    const fullDirPath = path.join(process.cwd(), path.dirname(filePath));
    
    try {
      await fs.access(fullDirPath);
    } catch {
      // 目录不存在，创建它
      await fs.mkdir(fullDirPath, { recursive: true });
    }

    // 写入文件
    const fullFilePath = path.join(process.cwd(), filePath);
    await fs.writeFile(fullFilePath, content, 'utf-8');

    return NextResponse.json({
      message: '文章保存成功',
      filePath: filePath,
      fileName: fileName,
    });

  } catch (error) {
    console.error('本地保存文章错误:', error);
    return NextResponse.json(
      { message: `保存失败: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 }
    );
  }
}