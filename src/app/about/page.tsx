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
import BiliBiliIcon from '@/assets/bilibili.png';
import {title, BeforeAnimationText, AnimationText, name, slogan, images, aboutMeP1, aboutMeP2, aboutMeP3, mainContactMeDescription, subContactMeDescription, mail, github, bilibili, isBorder, isRainbowGradient}
from '@/setting/AboutSetting';
import { friendGroups, exchangeInfo } from '@/setting/FriendsSetting';
import { ExternalLink, Globe, UserPlus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMemo, useEffect, useState } from 'react';
import { useBackgroundStyle } from '@/hooks/useBackgroundStyle';

/**
 * 关于页面组件
 * 支持主题色动态配置和美观的渐变效果
 */
export default function AboutPage() {
  const { resolvedTheme } = useTheme();
  const { containerStyle, isBackgroundEnabled } = useBackgroundStyle('about');
  const [mounted, setMounted] = useState(false);

  // 确保组件已挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  // 获取 CSS 变量中的主题色
  const getThemeColor = (colorName: string): string => {
    if (typeof window === 'undefined') return '#3b82f6'; // 默认蓝色
    return getComputedStyle(document.documentElement).getPropertyValue(`--theme-${colorName}`).trim() || '#3b82f6';
  };

  // 获取当前主题色
  const primaryColor = getThemeColor('primary');
  const secondaryColor = getThemeColor('secondary');
  const accentColor = getThemeColor('accent');

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

    const themeOverlay = `radial-gradient(ellipse at top left, ${primaryColor}1a, transparent 60%), radial-gradient(ellipse at bottom right, ${secondaryColor}1a, transparent 60%)`;

    return {
      background: `${themeOverlay}, ${baseGradient}`
    };
  }, [primaryColor, secondaryColor, isDark, isBackgroundEnabled]);
//个人介绍

  // BeforeAnimationText 样式 - 根据配置选择彩虹渐变或主题色渐变
  const beforeTextGradientStyle = useMemo(() => {
    if (isRainbowGradient) {
      // 优化的彩虹渐变色 - 更好的颜色搭配和动态效果
      return {
        backgroundImage: `
          linear-gradient(135deg, 
            #ff3366 0%,   /* 鲜红 */
            #ff6b35 12%,  /* 橙红 */
            #f7931e 24%,  /* 橙色 */
            #ffcc02 36%,  /* 金黄 */
            #9acd32 48%,  /* 黄绿 */
            #00d4aa 60%,  /* 青绿 */
            #00bfff 72%,  /* 天蓝 */
            #6a5acd 84%,  /* 紫罗兰 */
            #ff69b4 100%  /* 热粉 */
          )`,
        backgroundSize: '300% 300%',
        animation: 'gradientShift 4s ease-in-out infinite',
        filter: 'brightness(1.1) saturate(1.3)',
      };
    } else {
      // 主题色渐变
      return {
        backgroundImage: `
          linear-gradient(135deg, 
            ${primaryColor} 0%, 
            ${accentColor} 30%, 
            ${secondaryColor} 60%, 
            ${primaryColor} 100%
          )`,
        backgroundSize: '200% 200%',
        animation: 'gradientShift 6s ease-in-out infinite',
      };
    }
  }, [primaryColor, secondaryColor, accentColor]);

  // 技术栈卡片样式 - 简洁背景
  const techStackCardStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${primaryColor}1a, ${primaryColor}0d)`,
    borderColor: `${primaryColor}4d`
  }), [primaryColor]);

  // 关于我卡片样式 - 简洁背景
  const aboutMeCardStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${secondaryColor}1a, ${secondaryColor}0d)`,
    borderColor: `${secondaryColor}4d`
  }), [secondaryColor]);

  // 技术栈图标背景样式 - 增强渐变效果
  const techIconStyle = useMemo(() => ({
    background: `
      linear-gradient(135deg, 
        ${primaryColor}cc 0%, 
        ${accentColor}ff 50%, 
        ${primaryColor}cc 100%
      )`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 4s ease-in-out infinite',
    color: 'white'
  }), [primaryColor, accentColor]);

  // 关于我图标背景样式 - 增强渐变效果
  const aboutIconStyle = useMemo(() => ({
    background: `
      linear-gradient(135deg, 
        ${secondaryColor}cc 0%, 
        ${accentColor}ff 50%, 
        ${secondaryColor}cc 100%
      )`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 5s ease-in-out infinite',
    color: 'white'
  }), [secondaryColor, accentColor]);

  // 联系方式区域样式 - 简洁背景
  const contactSectionStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${accentColor}1a, ${accentColor}0d)`,
    borderColor: `${accentColor}4d`
  }), [accentColor]);

  // 联系我标题渐变样式 - 增强效果
  const contactTitleGradientStyle = useMemo(() => ({
    backgroundImage: `
      linear-gradient(135deg, 
        ${primaryColor} 0%, 
        ${accentColor} 40%, 
        ${secondaryColor} 70%, 
        ${primaryColor} 100%
      )`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 8s ease-in-out infinite',
  }), [primaryColor, secondaryColor, accentColor]);

  // 友链区域样式
  const friendsSectionStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${primaryColor}1a, ${primaryColor}0d)`,
    borderColor: `${primaryColor}4d`
  }), [primaryColor]);

  // 友链分组标题渐变样式
  const friendsTitleGradientStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 50%, ${secondaryColor} 100%)`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 6s ease-in-out infinite',
  }), [primaryColor, secondaryColor, accentColor]);

  // 友链卡片图标背景样式
  const friendIconStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${primaryColor}cc 0%, ${secondaryColor}ff 100%)`,
  }), [primaryColor, secondaryColor]);

  // 交换友链提示区域样式
  const exchangeSectionStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${accentColor}1a, ${accentColor}0d)`,
    borderColor: `${accentColor}4d`,
  }), [accentColor]);

  // 交换友链图标样式
  const exchangeIconStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${accentColor}cc 0%, ${primaryColor}ff 100%)`,
  }), [accentColor, primaryColor]);

  // 联系图标背景样式 - 增强渐变效果
  const contactIconStyle = useMemo(() => ({
    background: `
      linear-gradient(135deg, 
        ${accentColor}cc 0%, 
        ${primaryColor}ff 50%, 
        ${accentColor}cc 100%
      )`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 6s ease-in-out infinite',
    color: 'white'
  }), [primaryColor, accentColor]);

  // Email 图标背景样式 - 增强渐变效果
  const emailIconStyle = useMemo(() => ({
    background: `
      linear-gradient(135deg, 
        ${primaryColor}cc 0%, 
        ${accentColor}ff 50%, 
        ${primaryColor}cc 100%
      )`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 4s ease-in-out infinite',
    color: 'white'
  }), [primaryColor, accentColor]);

  // GitHub 图标背景样式 - 增强渐变效果
  const githubIconStyle = useMemo(() => ({
    background: `
      linear-gradient(135deg, 
        ${secondaryColor}cc 0%, 
        ${accentColor}ff 50%, 
        ${secondaryColor}cc 100%
      )`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 5s ease-in-out infinite',
    color: 'white'
  }), [secondaryColor, accentColor]);

  // BiliBili 图标背景样式 - 增强渐变效果
  const bilibiliIconStyle = useMemo(() => ({
    background: `
      linear-gradient(135deg, 
        ${secondaryColor}cc 0%, 
        ${accentColor}ff 50%, 
        ${secondaryColor}cc 100%
      )`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 6s ease-in-out infinite',
    color: 'white'
  }), [secondaryColor, accentColor]);


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
      key={`about-${primaryColor}-${isDark}`}
      className={containerStyle.className}
      style={{...containerStyle.style, ...backgroundStyle}}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 主要内容卡片 */}
        <div className="relative z-10 bg-white/45 dark:bg-[#1a1f2e]/45 backdrop-blur-xl rounded-2xl shadow-glass-md border border-white/20 dark:border-white/10 overflow-hidden">
          {/* 头部区域 - 使用主题色背景 */}
          <div 
            className="relative p-8 text-white transition-all duration-500 overflow-hidden"
            style={{
              background: `
                linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 50%, ${secondaryColor} 100%),
                radial-gradient(circle at top left, ${primaryColor}80 0%, transparent 50%),
                radial-gradient(circle at bottom right, ${secondaryColor}80 0%, transparent 50%)
              `,
            }}
          >
            {/* 动态光泽 overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(105deg, 
                    transparent 20%, 
                    rgba(255, 255, 255, 0.08) 45%, 
                    rgba(255, 255, 255, 0.15) 50%, 
                    rgba(255, 255, 255, 0.08) 55%, 
                    transparent 80%
                  )
                `,
                animation: 'shimmer 6s ease-in-out infinite',
              }}
            />
            
            {/* 装饰性几何图形 */}
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-20" 
                 style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full opacity-15" 
                 style={{ background: `radial-gradient(circle, ${primaryColor}, transparent)` }}></div>
            
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-2xl tracking-wide">{title}</h1>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="p-8 md:p-10 md:pt-8">
            {/* 标语区域 */}
            <div className="text-center mb-12">
              <div className="text-3xl md:text-4xl lg:text-5xl font-semibold max-w-4xl mx-auto relative z-20 py-3">
                <span 
                  className="bg-clip-text text-transparent transition-all duration-500"
                  style={beforeTextGradientStyle}
                >
                  {BeforeAnimationText}
                </span>
                <Cover>{AnimationText}</Cover>
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
              {/* 技术栈卡片 - 使用简洁的主题色背景 */}
              <div 
                className="rounded-xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-glass-lg"
                style={techStackCardStyle}
              >
                <div className="flex items-center mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-300"
                    style={techIconStyle}
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

              {/* 关于我卡片 - 使用简洁的主题色背景 */}
              <div 
                className="rounded-xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-glass-lg"
                style={aboutMeCardStyle}
              >
                <div className="flex items-center mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-300"
                    style={aboutIconStyle}
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
                <br />
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {aboutMeP3}
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
                  style={contactIconStyle}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Email 卡片 */}
                <motion.a
                  href={mail}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-glass-lg border border-white/30 dark:border-white/10 transition-all duration-300 cursor-pointer overflow-hidden"
                >

                  <div className="relative z-10">
                    <div 
                      className="flex items-center justify-center w-12 h-12 rounded-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                      style={emailIconStyle}
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
                  className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-glass-lg border border-white/30 dark:border-white/10 transition-all duration-300 cursor-pointer overflow-hidden"
                >

                  <div className="relative z-10">
                    <div 
                      className="flex items-center justify-center w-12 h-12 rounded-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                      style={githubIconStyle}
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

                {/* BiliBili 卡片 */}
                <motion.a
                  href={bilibili}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-glass-lg border border-white/30 dark:border-white/10 transition-all duration-300 cursor-pointer overflow-hidden"
                >

                  <div className="relative z-10">
                    <div 
                      className="flex items-center justify-center w-12 h-12 rounded-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                      style={bilibiliIconStyle}
                    >
                      <Image src={BiliBiliIcon} alt="BiliBili" width={24} height={24} className="text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white text-center mb-2">
                      BiliBili
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                      查看我的视频
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

            {/* 友情链接区域 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
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
                  <motion.section
                    key={group.groupName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: groupIndex * 0.1 + 0.6 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-1.5 h-6 rounded-full"
                        style={{
                          background: `linear-gradient(to bottom, ${primaryColor}, ${accentColor})`,
                        }}
                      />
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {group.groupName}
                      </h4>
                      <div className="flex-1 h-px bg-gray-200/50 dark:bg-gray-700/50" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.links.map((link, linkIndex) => (
                        <motion.a
                          key={`${group.groupName}-${link.name}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: groupIndex * group.links.length + linkIndex * 0.08 + 0.7 }}
                          whileHover={{ scale: 1.03, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className="group relative block rounded-xl p-5 shadow-md hover:shadow-glass-lg transition-all duration-300 overflow-hidden border bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                          <div className="relative z-10 flex items-start gap-4">
                            <div
                              className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md"
                              style={friendIconStyle}
                            >
                              {link.avatar ? (
                                <img
                                  src={link.avatar}
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
                  </motion.section>
                ))}
              </div>

              {exchangeInfo.enabled && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
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