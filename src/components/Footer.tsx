/**
 * 页脚组件
 * 显示版权信息和相关链接
 */

import CopyrightNotice from './CopyrightNotice';
import { beianhao, ICP, year, name, aWord, ICPLink } from '@/setting/FooterSetting';
import { useBackgroundStyle } from '@/hooks/useBackgroundStyle';
import Link from 'next/link';

/**
 * 页脚组件
 */
export default function Footer() {
  const { footerStyle } = useBackgroundStyle('home');
  
  return (
    <footer className={footerStyle.className} style={footerStyle.style}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="flex flex-wrap items-center justify-center gap-1 text-sm">
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
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 underline-offset-4 hover:underline"
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