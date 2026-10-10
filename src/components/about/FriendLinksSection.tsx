'use client';

/**
 * 关于页底部的友情链接区块
 *
 * 从旧版关于页原样搬过来，数据仍来自 src/setting/FriendsSetting.ts。
 * 主题色在挂载后从 CSS 变量读取（applyThemeColors / sync-theme-colors 写入），
 * 因此这里不需要把颜色配置再传一遍。
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Globe, UserPlus } from 'lucide-react';
import { friendGroups, exchangeInfo } from '@/setting/FriendsSetting';
import { processImagePath } from '@/lib/process-image-path';

const DEFAULT_COLORS = {
  primary: '#3b82f6',
  secondary: '#0891b2',
  accent: '#22d3ee',
};

export default function FriendLinksSection() {
  const [colors, setColors] = useState(DEFAULT_COLORS);

  useEffect(() => {
    const read = (colorName: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(`--theme-${colorName}`).trim();

    setColors({
      primary: read('primary') || DEFAULT_COLORS.primary,
      secondary: read('secondary') || DEFAULT_COLORS.secondary,
      accent: read('accent') || DEFAULT_COLORS.accent,
    });
  }, []);

  const { primary, secondary, accent } = colors;

  const friendsSectionStyle = {
    background: `linear-gradient(135deg, ${primary}1a, ${primary}0d)`,
    borderColor: `${primary}4d`,
  };
  const friendsTitleGradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${primary} 0%, ${accent} 50%, ${secondary} 100%)`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 6s ease-in-out infinite',
  };
  const friendIconStyle = {
    background: `linear-gradient(135deg, ${primary}cc 0%, ${secondary}ff 100%)`,
  };
  const exchangeSectionStyle = {
    background: `linear-gradient(135deg, ${accent}1a, ${accent}0d)`,
    borderColor: `${accent}4d`,
  };
  const exchangeIconStyle = {
    background: `linear-gradient(135deg, ${accent}cc 0%, ${primary}ff 100%)`,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="rounded-2xl p-8 border shadow-lg mt-8"
      style={friendsSectionStyle}
    >
      <div className="text-center mb-8">
        <h3
          className="text-2xl font-bold bg-clip-text text-transparent mb-3"
          style={friendsTitleGradientStyle}
        >
          友情链接
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-2xl mx-auto">
          这里记录了一些有趣的站点，欢迎互访交流
        </p>
      </div>

      <div className="space-y-8">
        {friendGroups.map((group, groupIndex) => (
          <section key={group.groupName}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-1.5 h-6 rounded-full"
                style={{ background: `linear-gradient(to bottom, ${primary}, ${accent})` }}
              />
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                {group.groupName}
              </h4>
              <div className="flex-1 h-px bg-gray-200/50 dark:bg-gray-700/50" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.links.map((link) => (
                <motion.a
                  key={`${group.groupName}-${link.name}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative block rounded-xl p-5 shadow-md hover:shadow-glass-lg transition-all duration-300 overflow-hidden border bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md overflow-hidden"
                      style={friendIconStyle}
                    >
                      {link.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={processImagePath(link.avatar)}
                          alt={link.name}
                          className="w-full h-full rounded-lg object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <Globe className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-base font-semibold text-gray-800 dark:text-white truncate">
                          {link.name}
                        </h5>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {exchangeInfo.enabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 rounded-2xl p-6 border shadow-lg"
          style={exchangeSectionStyle}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md"
              style={exchangeIconStyle}
            >
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {exchangeInfo.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {exchangeInfo.content}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
