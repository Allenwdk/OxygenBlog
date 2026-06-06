// 已废弃：详情数据现在通过服务端组件直接传递，不再需要 API 路由
// 此路由返回空响应以避免构建错误
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    title: '',
    excerpt: '',
    date: '',
    author: '',
    content: ''
  });
}
