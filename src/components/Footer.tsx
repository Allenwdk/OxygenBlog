/**
 * 页脚组件
 * 显示版权信息和相关链接
 */

import CopyrightNotice from './CopyrightNotice';
import { beianhao, ICP, year, name, aWord, ICPLink } from '@/setting/FooterSetting';
import Link from 'next/link';

/**
 * 页脚组件 - 毛玻璃透明效果
 */
export default function Footer() {
  return (
    <footer className="backdrop-blur-md bg-background/80 border-t border-border/30 py-3 supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="flex flex-wrap items-center justify-center gap-1 text-xs text-muted-foreground/70">
          {/* 备案号 */}
          {beianhao && (
            <>
              <span>{beianhao}</span>
              {ICP && <span className="mx-1">|</span>}
            </>
          )}
          
          {/* ICP 备案号 - 链接到工信部网站 */}
          {ICP && (
            <Link
              href={ICPLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/70 hover:text-primary transition-colors duration-200 underline-offset-4 hover:underline"
            >
              {ICP}
            </Link>
          )}
          
          {/* 版权信息 */}
          <span className="flex items-center gap-1">
            {(beianhao || ICP) && <span className="mx-1">|</span>}
            <span>&copy; {year} {name}</span>
          </span>
          
          {/* 自定义文案 */}
          {aWord && (
            <>
              <span className="mx-1">·</span>
              <span>{aWord}</span>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}