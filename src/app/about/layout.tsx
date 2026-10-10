import type { Metadata } from 'next';

/**
 * 关于页面 SEO 元数据配置
 */
export const metadata: Metadata = {
  title: '关于我',
  description: '关于 Allenwdk：个人介绍、技能、设备、常玩的游戏与旅行足迹。',
  keywords: ['关于我', '个人介绍', '技能', '设备', '旅行足迹'],
  openGraph: {
    title: '关于我 | Allenwdk 的博客',
    description: '关于 Allenwdk：个人介绍、技能、设备、常玩的游戏与旅行足迹。',
    type: 'profile',
  },
  twitter: {
    card: 'summary',
    title: '关于我 | Allenwdk 的博客',
    description: '关于 Allenwdk：个人介绍、技能、设备、常玩的游戏与旅行足迹。',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
