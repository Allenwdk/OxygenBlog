import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { fileName: string; content: string; path: string };
    const { fileName, content, path } = body;

    if (!fileName || !content || !path) {
      return NextResponse.json(
        { message: '缺少必要参数' },
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
        branch 
      });
      return NextResponse.json(
        { message: 'GitHub 配置不完整，请检查环境变量' },
        { status: 500 }
      );
    }

    // 获取当前文件的 SHA（如果文件已存在）
    let currentFileSha: string | null = null;
    try {
      const getResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Blog-Platform/1.0',
        },
        }
      );

      if (getResponse.ok) {
        const fileData = await getResponse.json() as { sha: string };
        currentFileSha = fileData.sha;
      }
    } catch {
      // 文件不存在，继续创建新文件
      console.log('文件不存在，将创建新文件');
    }

    // 将内容编码为 base64
    const contentBase64 = Buffer.from(content).toString('base64');

    // 创建或更新文件
    const requestBody = {
      message: `发布新文章: ${fileName}`,
      content: contentBase64,
      branch,
      ...(currentFileSha && { sha: currentFileSha }),
    };

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    console.log('GitHub API 请求:', { apiUrl, method: 'PUT', branch, hasFileSha: !!currentFileSha });
    
    const response = await fetch(apiUrl,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Blog-Platform/1.0',
        },
        body: JSON.stringify(requestBody),
      }
    );
    
    console.log('GitHub API 响应状态:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `GitHub API 错误: ${response.status}`;
      try {
        const errorData = await response.json() as { message: string };
        errorMessage = `GitHub API 错误: ${errorData.message}`;
      } catch {
        // 如果响应不是JSON，获取文本内容
        const errorText = await response.text();
        errorMessage = `GitHub API 错误: ${response.status} - ${errorText.substring(0, 200)}`;
      }
      return NextResponse.json(
        { message: errorMessage },
        { status: response.status }
      );
    }

    const result = await response.json() as { content: unknown; commit: unknown };

    return NextResponse.json({
      message: '文章发布成功',
      content: result.content,
      commit: result.commit,
    });

  } catch (error) {
    console.error('发布文章错误:', error);
    return NextResponse.json(
      { message: `服务器错误: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 }
    );
  }
}