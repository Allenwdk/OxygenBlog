/**
 * 友情链接页面
 * 展示友情链接列表，支持分组展示和主题色动态配置
 * 纯静态实现，兼容 GitHub Pages 静态导出
 */
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useBackgroundStyle } from "@/hooks/useBackgroundStyle";
import {
  pageTitle,
  pageDescription,
  friendGroups,
  exchangeInfo,
} from "@/setting/FriendsSetting";
import { ExternalLink, Globe, UserPlus } from "lucide-react";

/**
 * 获取 CSS 变量中的主题色
 */
function getThemeColor(colorName: string): string {
  if (typeof window === "undefined") return "#3b82f6";
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--theme-${colorName}`)
      .trim() || "#3b82f6"
  );
}

/**
 * 友链卡片组件
 * 单个友链的展示卡片，包含头像、名称、描述和跳转链接
 */
function FriendCard({
  name,
  description,
  url,
  avatar,
  index,
}: {
  name: string;
  description: string;
  url: string;
  avatar?: string;
  index: number;
}) {
  const primaryColor = getThemeColor("primary");
  const secondaryColor = getThemeColor("secondary");

  /**
   * 卡片悬停时的边框和阴影样式
   */
  const cardHoverStyle = useMemo(
    () => ({
      borderColor: `${primaryColor}4d`,
      boxShadow: `0 10px 25px ${primaryColor}1a`,
    }),
    [primaryColor]
  );

  /**
   * 图标背景渐变样式
   */
  const iconStyle = useMemo(
    () => ({
      background: `linear-gradient(135deg, ${primaryColor}cc 0%, ${secondaryColor}ff 100%)`,
    }),
    [primaryColor, secondaryColor]
  );

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group relative block rounded-xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-5 shadow-md hover:shadow-glass-lg transition-all duration-300 overflow-hidden"
      style={cardHoverStyle}
    >
      {/* 悬停时的光泽扫过效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      <div className="relative z-10 flex items-start gap-4">
        {/* 头像或图标 */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md"
          style={iconStyle}
        >
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full rounded-lg object-cover"
              loading="lazy"
            />
          ) : (
            <Globe className="w-6 h-6" />
          )}
        </div>

        {/* 文字内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white truncate">
              {name}
            </h3>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

/**
 * 友情链接页面主组件
 */
export default function FriendsPage() {
  const { resolvedTheme } = useTheme();
  const { containerStyle } = useBackgroundStyle("friends");
  const [mounted, setMounted] = useState(false);

  // 确保组件已挂载，避免水合错误
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const primaryColor = getThemeColor("primary");
  const secondaryColor = getThemeColor("secondary");
  const accentColor = getThemeColor("accent");

  /**
   * 页面背景渐变样式
   */
  const backgroundStyle = useMemo(() => {
    const baseGradient = isDark
      ? "linear-gradient(135deg, rgb(17, 24, 39), rgb(31, 41, 55))"
      : "linear-gradient(135deg, rgb(249, 250, 251), rgb(229, 231, 235))";

    const themeOverlay = `radial-gradient(ellipse at top left, ${primaryColor}1a, transparent 60%), radial-gradient(ellipse at bottom right, ${secondaryColor}1a, transparent 60%)`;

    return {
      background: `${themeOverlay}, ${baseGradient}`,
    };
  }, [primaryColor, secondaryColor, isDark]);

  /**
   * 标题渐变样式
   */
  const titleGradientStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 50%, ${secondaryColor} 100%)`,
      backgroundSize: "200% 200%",
      animation: "gradientShift 6s ease-in-out infinite",
    }),
    [primaryColor, secondaryColor, accentColor]
  );

  /**
   * 交换友链提示区域样式
   */
  const exchangeSectionStyle = useMemo(
    () => ({
      background: `linear-gradient(135deg, ${accentColor}1a, ${accentColor}0d)`,
      borderColor: `${accentColor}4d`,
    }),
    [accentColor]
  );

  /**
   * 交换友链图标样式
   */
  const exchangeIconStyle = useMemo(
    () => ({
      background: `linear-gradient(135deg, ${accentColor}cc 0%, ${primaryColor}ff 100%)`,
    }),
    [accentColor, primaryColor]
  );

  // 未挂载时显示加载占位，避免闪烁
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 pt-[65px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={containerStyle.className}
      style={{ ...containerStyle.style, ...backgroundStyle }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent inline-block mb-3"
            style={titleGradientStyle}
          >
            {pageTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {pageDescription}
          </p>
        </motion.div>

        {/* 友链分组展示 */}
        <div className="space-y-10">
          {friendGroups.map((group, groupIndex) => (
            <motion.section
              key={group.groupName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
            >
              {/* 分组标题 */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-1.5 h-6 rounded-full"
                  style={{
                    background: `linear-gradient(to bottom, ${primaryColor}, ${accentColor})`,
                  }}
                />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {group.groupName}
                </h2>
                <div className="flex-1 h-px bg-gray-200/50 dark:bg-gray-700/50" />
              </div>

              {/* 友链卡片网格 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.links.map((link, linkIndex) => (
                  <FriendCard
                    key={`${group.groupName}-${link.name}`}
                    name={link.name}
                    description={link.description}
                    url={link.url}
                    avatar={link.avatar}
                    index={groupIndex * group.links.length + linkIndex}
                  />
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* 交换友链提示 */}
        {exchangeInfo.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 rounded-2xl p-6 md:p-8 border shadow-lg"
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
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {exchangeInfo.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {exchangeInfo.content}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-10 pb-6"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            友情链接，让互联网的角落彼此相连
          </p>
        </motion.div>
      </div>
    </div>
  );
}
