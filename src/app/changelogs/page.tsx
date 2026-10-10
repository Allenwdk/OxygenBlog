import { getServerChangelogs } from '@/lib/changelogUtils';
import ClientChangelogsPage from '@/components/changelogs/ClientChangelogsPage';
import type { Metadata } from 'next';
import 'highlight.js/styles/github-dark.css';

/**
 * 更新日志页面 SEO 元数据配置
 */
export const metadata: Metadata = {
  title: '更新日志',
  description: '查看 Allenwdk 的博客更新日志，了解网站开发历程、功能更新、性能优化和 Bug 修复记录。',
  keywords: ['更新日志', '开发日志', '版本记录', '功能更新', '博客开发'],
  openGraph: {
    title: '更新日志 | Allenwdk 的博客',
    description: '查看 Allenwdk 的博客更新日志，了解网站开发历程和功能更新。',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '更新日志 | Allenwdk 的博客',
    description: '查看 Allenwdk 的博客更新日志，了解网站开发历程和功能更新。',
  },
};

// 服务器端组件在构建期读取开发日志数据
const changelogs = getServerChangelogs();

export default function ChangelogsPage() {
  return <ClientChangelogsPage changelogs={changelogs} />;
}
