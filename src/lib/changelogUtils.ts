/**
 * 开发日志服务器端工具函数
 * 仅用于服务器端，包含文件系统操作
 * 客户端请使用 changelogTypes.ts 中的类型和函数
 */

import fs from 'node:fs';
import path from 'node:path';

import {
  type Changelog,
  type ChangelogType,
  calculateAchievements,
} from '@/lib/changelogTypes';
import { parseFrontMatter } from '@/lib/frontMatterUtils';

// 重新导出类型和纯函数，方便其他模块使用
export type { Changelog, ChangelogType } from '@/lib/changelogTypes';
export {
  getChangelogTypeColor,
  getChangelogTypeLabel,
  getMonthStats,
  getQuarterStats,
  getYearStats,
  getDayPartStats,
  getTypeStats,
  calculateAchievements,
  getAchievementLabel,
  getAchievementColor,
  sortAchievementsByPriority,
} from '@/lib/changelogTypes';

/**
 * 服务器端：读取所有开发日志文件
 * @returns 开发日志数组，按日期倒序排序
 */
export function getServerChangelogs(): Changelog[] {
  let changelogs: Changelog[] = [];

  try {
    const changelogsDir = path.join(process.cwd(), 'src', 'content', 'changelogs');

    if (!fs.existsSync(changelogsDir) || !fs.statSync(changelogsDir).isDirectory()) {
      return [];
    }

    const files = fs.readdirSync(changelogsDir);
    const mdFiles = files.filter((file: string) => file.endsWith('.md'));

    changelogs = mdFiles.map((file: string) => {
      const filePath = path.join(changelogsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { metadata, content: body } = parseFrontMatter(content);

      // 验证并获取日志类型，默认为 'docs'
      // 旧类型映射：perf -> optimize, chore -> docs
      const typeValue = metadata.type as string;
      const validTypes: ChangelogType[] = ['feature', 'optimize', 'fix', 'docs', 'style', 'refactor'];

      let type: ChangelogType;
      if (validTypes.includes(typeValue as ChangelogType)) {
        type = typeValue as ChangelogType;
      } else if (typeValue === 'perf') {
        type = 'optimize';
      } else if (typeValue === 'chore') {
        type = 'docs';
      } else {
        type = 'docs';
      }

      // 计算日志内容行数（使用原始内容，不计算 trim 后的内容）
      const lines = content.split('\n');
      let frontmatterEnd = -1;
      let dashCount = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '---') {
          dashCount++;
          if (dashCount === 2) {
            frontmatterEnd = i;
            break;
          }
        }
      }
      const contentLineCount = frontmatterEnd !== -1 ? lines.length - frontmatterEnd - 1 : lines.length;

      const commits = (metadata.commits as string[]) || [];
      const achievements = calculateAchievements(commits, contentLineCount);
      const honors = (metadata.honors as { name: string; color: string }[]) || [];

      return {
        id: file.replace('.md', ''),
        date: (metadata.date as string) || '',
        title: (metadata.title as string) || '无标题',
        type: type,
        commits: commits,
        content: body,
        filePath: file,
        achievements: achievements,
        honors: honors
      };
    });

    // 按日期倒序排序
    changelogs.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('读取开发日志文件失败:', error);
  }

  return changelogs;
}
