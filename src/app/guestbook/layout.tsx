import type { Metadata } from 'next';

/**
 * 留言板页面 SEO 元数据配置
 */
export const metadata: Metadata = {
  title: '留言板',
  description: '欢迎来到 Allenwdk 的留言板！在这里留下你的想法、建议或想说的话。基于 GitHub Discussions，支持 Markdown 格式。',
  keywords: ['留言板', '留言', '评论', '互动', 'GitHub Discussions'],
  openGraph: {
    title: '留言板 | Allenwdk 的博客',
    description: '欢迎来到 Allenwdk 的留言板！在这里留下你的想法、建议或想说的话。',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '留言板 | Allenwdk 的博客',
    description: '欢迎来到 Allenwdk 的留言板！在这里留下你的想法、建议或想说的话。',
  },
};

/**
 * 留言板页面布局组件
 */
export default function GuestbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
