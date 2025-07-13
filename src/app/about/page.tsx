/**
 * 关于页面
 * 展示个人信息和博客介绍
 */
"use client"
import { Cover } from '@/components/ui/cover'
import { IconCloud } from '@/components/magicui/icon-cloud';
import { EvervaultCard, Icon } from '@/components/ui/evervault-card';
import { motion } from 'motion/react';
import Image from 'next/image';
import MailIcon from '@/assets/mail.svg';
import GitHubIcon from '@/assets/github.svg';
import {title, BeforeAnimationText, AnimationText, name, slogan, images, aboutMeP1, aboutMeP2, mainContactMeDescription, subContactMeDescription, mail, github, isBorder}
from '@/setting/AboutSetting';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTheme } from 'next-themes';
import { useMemo, useEffect } from 'react';
import { useBackgroundStyle } from '@/hooks/useBackgroundStyle';

/**
 * 关于页面组件
 * 支持主题色动态配置和美观的渐变效果
 */
export default function AboutPage() {
  const { getCurrentScheme, mounted, updateTrigger } = useThemeColor();
  const { resolvedTheme } = useTheme();
  const { containerStyle, isBackgroundEnabled } = useBackgroundStyle('about');

  // 获取当前主题色方案
  const currentScheme = getCurrentScheme();
  const isDark = resolvedTheme === 'dark';
  const colors = isDark ? currentScheme.dark : currentScheme.light;

  // 调试：打印当前主色
  console.log('about colors.primary', colors.primary);
  // 监听 updateTrigger，确保主题色切换时页面刷新
  useEffect(() => {
    // 只要 updateTrigger 变化，强制刷新
  }, [updateTrigger]);
  /**
   * 监听主题色变化，强制重新渲染
   */
  // 已移除 useEffect，依赖 useThemeColor 的响应式能力
  useEffect(() => {
    // 强制重新渲染以确保所有样式都更新
    const timer = setTimeout(() => {
      // 这个 effect 会在主题色变化时触发，确保组件重新渲染
    }, 0);
    return () => clearTimeout(timer);
  }, [currentScheme, isDark, updateTrigger, colors.primary, colors.secondary, colors.accent]);

  /**
   * 生成互补色和谐色系
   */
  // 已移除 colorPalette 相关逻辑，所有渐变直接依赖 colors
  const colorPalette = useMemo(() => {
    // 从OKLCH颜色中提取数值
    const extractOklchValues = (oklchColor: string) => {
      const match = oklchColor.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
      if (match) {
        return {
          l: parseFloat(match[1]),
          c: parseFloat(match[2]),
          h: parseFloat(match[3])
        };
      }
      return { l: 0.7, c: 0.15, h: 220 }; // 默认值
    };

    const primary = extractOklchValues(colors.primary);
    const secondary = extractOklchValues(colors.secondary);
    const accent = extractOklchValues(colors.accent);

    // 生成和谐色系
    const generateHarmoniousColors = (base: any) => {
      return {
        // 互补色 (色相+180度)
        complement: `oklch(${base.l} ${base.c} ${(base.h + 180) % 360})`,
        // 三角色 (色相+120度)
        triadic1: `oklch(${base.l} ${base.c} ${(base.h + 120) % 360})`,
        triadic2: `oklch(${base.l} ${base.c} ${(base.h + 240) % 360})`,
        // 类似色 (色相±30度)
        analogous1: `oklch(${base.l} ${base.c} ${(base.h + 30) % 360})`,
        analogous2: `oklch(${base.l} ${base.c} ${(base.h - 30 + 360) % 360})`,
        // 明度变化
        lighter: `oklch(${Math.min(1, base.l + 0.2)} ${base.c * 0.8} ${base.h})`,
        darker: `oklch(${Math.max(0, base.l - 0.2)} ${base.c * 1.2} ${base.h})`,
        // 饱和度变化
        muted: `oklch(${base.l} ${base.c * 0.5} ${base.h})`,
        vibrant: `oklch(${base.l} ${Math.min(0.4, base.c * 1.5)} ${base.h})`
      };
    };

    return {
      primary: generateHarmoniousColors(primary),
      secondary: generateHarmoniousColors(secondary),
      accent: generateHarmoniousColors(accent)
    };
  }, [colors.primary, colors.secondary, colors.accent, updateTrigger]);

  /**
   * 将OKLCH颜色转换为CSS可用的格式
   */
  const formatOklchColor = (oklchColor: string, alpha: number = 1): string => {
    if (alpha === 1) {
      return oklchColor;
    }
    // 将 oklch(l c h) 转换为 oklch(l c h / alpha)
    return oklchColor.replace(')', ` / ${alpha})`);
  };

  /**
   * 生成简化的背景样式
   */
  const backgroundStyle = useMemo(() => {
    // 如果启用了背景图片，返回透明背景
    if (isBackgroundEnabled) {
      return {};
    }
    
    // 否则使用原有的渐变背景
    const baseGradient = isDark 
      ? 'linear-gradient(135deg, rgb(17, 24, 39), rgb(31, 41, 55))'
      : 'linear-gradient(135deg, rgb(249, 250, 251), rgb(229, 231, 235))';

    const themeOverlay = `radial-gradient(ellipse at top left, ${formatOklchColor(colors.primary, 0.1)}, transparent 60%), radial-gradient(ellipse at bottom right, ${formatOklchColor(colors.secondary, 0.1)}, transparent 60%)`;

    return {
      background: `${themeOverlay}, ${baseGradient}`
    };
  }, [colors.primary, colors.secondary, isDark, updateTrigger, isBackgroundEnabled]);

  // 标语渐变样式
  const sloganGradientStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
  }), [colors.primary, colors.secondary, updateTrigger]);

  // 技术栈卡片样式
  const techStackCardStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${formatOklchColor(colors.primary, 0.1)}, ${formatOklchColor(colors.primary, 0.05)})`,
    borderColor: formatOklchColor(colors.primary, 0.3)
  }), [colors.primary, updateTrigger]);

  // 关于我卡片样式
  const aboutMeCardStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${formatOklchColor(colors.secondary, 0.1)}, ${formatOklchColor(colors.secondary, 0.05)})`,
    borderColor: formatOklchColor(colors.secondary, 0.3)
  }), [colors.secondary, updateTrigger]);

  // 联系方式区域样式
  const contactSectionStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${formatOklchColor(colors.accent, 0.08)}, ${formatOklchColor(colors.accent, 0.04)})`,
    borderColor: formatOklchColor(colors.accent, 0.2)
  }), [colors.accent, updateTrigger]);

  // 联系我标题渐变样式
  const contactTitleGradientStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`
  }), [colors.primary, colors.accent, updateTrigger]);

  // 邮箱卡片悬停样式
  const emailCardHoverStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${formatOklchColor(colors.primary, 0.15)}, ${formatOklchColor(colors.primary, 0.08)})`
  }), [colors.primary, updateTrigger]);

  // GitHub卡片悬停样式
  const githubCardHoverStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${formatOklchColor(colors.secondary, 0.15)}, ${formatOklchColor(colors.secondary, 0.08)})`
  }), [colors.secondary, updateTrigger]);

  // 如果还没有挂载，显示默认样式避免闪烁
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 pt-[65px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      key={`about-${updateTrigger}-${currentScheme.name}-${isDark}`}
      className={containerStyle.className}
      style={{...containerStyle.style, ...backgroundStyle}}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 主要内容卡片 */}
        <div className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          {/* 头部区域 - 使用主题色背景 */}
          <div 
            className="relative p-8 text-white transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">{title}</h1>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="p-8 md:p-10 md:pt-8">
            {/* 标语区域 */}
            <div className="text-center mb-12">
              <div 
                className="text-3xl md:text-4xl lg:text-5xl font-semibold max-w-4xl mx-auto relative z-20 py-3 bg-clip-text text-transparent transition-all duration-500"
                style={sloganGradientStyle}
              >
                {BeforeAnimationText}<Cover>{AnimationText}</Cover>
              </div>
              <div className={`${isBorder ? 'border border-black/[0.2] dark:border-white/[0.2]' : ''} flex flex-col items-start max-w-sm mx-auto p-4 relative h-[30rem]`}>
                {isBorder && <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />}
                {isBorder && <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />}
                {isBorder && <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />}
                {isBorder && <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />}
 
                <EvervaultCard />
 
                <h2 className="dark:text-white text-black mt-4 font-medium text-center w-full text-lg sm:text-xl md:text-2xl">
                  {name}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
                {slogan}
              </p>
            </div>

            {/* 个人介绍卡片网格 */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* 技术栈卡片 - 使用丰富的主题色渐变 */}
              <div 
                className="rounded-xl p-6 border transition-all duration-500 shadow-lg hover:shadow-xl"
                style={techStackCardStyle}
              >
                <div className="flex items-center mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-300"
                    style={{
                      backgroundColor: colors.primary,
                      color: 'white'
                    }}
                  >
                    <span className="font-bold text-lg">⚙️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">技术栈</h3>
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <IconCloud images={images} />
                  </div>
                </div>
              </div>

              {/* 关于我卡片 - 使用丰富的主题色渐变 */}
              <div 
                className="rounded-xl p-6 border transition-all duration-500 shadow-lg hover:shadow-xl"
                style={aboutMeCardStyle}
              >
                <div className="flex items-center mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-300"
                    style={{
                      backgroundColor: colors.secondary,
                      color: 'white'
                    }}
                  >
                    <span className="font-bold text-lg">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">关于我</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {aboutMeP1} 
                </p>
                <br />
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {aboutMeP2}
                </p>
              </div>
            </div>

            {/* 联系方式 - 使用丰富的主题色渐变 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-2xl p-8 border shadow-lg transition-all duration-500"
              style={contactSectionStyle}
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg transition-all duration-300"
                  style={{
                    backgroundColor: colors.accent,
                    color: 'white'
                  }}
                >
                  <span className="text-2xl">💬</span>
                </motion.div>
                <h3 
                  className="text-2xl font-bold bg-clip-text text-transparent mb-3 transition-all duration-500"
                  style={contactTitleGradientStyle}
                >
                  联系我
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                  {mainContactMeDescription}
                  <br />
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">
                    {subContactMeDescription} 
                  </span>
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {/* Email 卡片 */}
                <motion.a
                  href={mail}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={emailCardHoverStyle}
                  ></div>
                  <div className="relative z-10">
                    <div 
                      className="flex items-center justify-center w-12 h-12 rounded-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                      style={{
                        backgroundColor: colors.primary,
                        color: 'white'
                      }}
                    >
                      <Image src={MailIcon as string} alt="Mail" width={24} height={24} className="text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white text-center mb-2">
                      邮箱联系
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                      发送邮件给我
                    </p>
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        点击发送
                      </span>
                    </div>
                  </div>
                </motion.a>

                {/* GitHub 卡片 */}
                <motion.a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={githubCardHoverStyle}
                  ></div>
                  <div className="relative z-10">
                    <div 
                      className="flex items-center justify-center w-12 h-12 rounded-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                      style={{
                        backgroundColor: colors.secondary,
                        color: 'white'
                      }}
                    >
                      <Image src={GitHubIcon as string} alt="GitHub" width={24} height={24} className="text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white text-center mb-2">
                      GitHub
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                      查看我的项目
                    </p>
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        访问主页
                      </span>
                    </div>
                  </div>
                </motion.a>
              </div>

              {/* 底部装饰性文字 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="text-center mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
              >
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  🌟 期待与你的交流 · 让我们一起在技术的道路上前行
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &ldquo;代码如诗，技术如画，用心创造每一行代码&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}