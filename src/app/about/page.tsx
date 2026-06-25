/**
 * 关于页面
 * 展示个人信息和博客介绍
 * 使用与其他页面统一的布局风格：PageHeader + 左右布局
 * 页面内容通过 AboutSetting.ts 配置驱动，便于后续维护
 */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Globe,
  Link2,
  Music,
  Dribbble,
  CircleDot,
  Video,
  Box,
  Crown,
  Check,
  Mail,
  BookOpen,
  Code,
  Gamepad2 as GamepadIcon,
} from 'lucide-react';
import { Cover } from '@/components/ui/cover';
import { EvervaultCard, Icon } from '@/components/ui/evervault-card';
import OptimizedImage from '@/components/OptimizedImage';
import PageHeader from '@/components/ui/PageHeader';
import { useBackgroundStyle } from '@/hooks/useBackgroundStyle';
import { processImagePath } from '@/lib/process-image-path';

// 导入配置
import {
  BeforeAnimationText,
  AnimationText,
  name,
  slogan,
  slogans,
  mail,
  github,
  bilibili,
  isBorder,
  aboutSections,
  hobbies,
  mbti,
  musicPlaylist,
  frequentGames,
  occasionalGames,
  type AboutSectionConfig,
  type HobbyConfig,
  type MBTIConfig,
  type MusicPlaylistConfig,
  type GameConfig,
} from '@/setting/AboutSetting';

/**
 * Lucide 图标映射表
 * 将配置中的字符串标识映射为实际图标组件，避免在配置文件中引入 React 组件
 */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  Globe,
  Link: Link2,
  Music,
  Dribbble,
  CircleDot,
  Video,
  Box,
  Gamepad2: GamepadIcon,
  Crown,
  BookOpen,
  Code,
};

/**
 * 兴趣爱好标签组件
 * 显示带图标的兴趣标签，悬停时有轻微放大和摆动效果
 */
function HobbyTag({ hobby, index }: { hobby: HobbyConfig; index: number }) {
  const IconComponent = iconMap[hobby.icon];

  return (
    <motion.span
      key={hobby.name}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 + index * 0.08, type: 'spring', stiffness: 200 }}
      whileHover={{
        scale: 1.08,
        rotate: [0, -3, 3, 0],
        transition: { duration: 0.4 }
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-primary/20 bg-primary/10 text-primary cursor-default shadow-sm transition-colors duration-300"
    >
      {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
      {hobby.name}
    </motion.span>
  );
}

/**
 * MBTI 人格类型卡片组件（简约版）
 * 仅展示类型大字母、中文名与一句简短描述
 */
function MBTICard({ config }: { config: MBTIConfig }) {
  return (
    <div className="flex flex-col items-center text-center justify-start gap-6 h-full">
      <div className="flex items-center gap-2 mb-1">
        <User className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">我的 MBTI</h3>
      </div>

      <span
        className="text-6xl font-bold tracking-tight leading-none bg-gradient-to-r from-blue-500 via-sky-400 via-cyan-400 via-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow-lg bg-[length:300%_300%] animate-[gradientShift_2s_ease-in-out_infinite]"
      >
        {config.type.toUpperCase()}
      </span>

      <span className="text-base text-muted-foreground font-medium">
        逻辑宅、脑洞专家、行动废
      </span>
    </div>
  );
}

/**
 * 个人歌单卡片组件
 * 左侧展示歌单名称、简介和跳转按钮，右侧展示正方形封面图
 */
function MusicPlaylistCard({ config }: { config: MusicPlaylistConfig }) {
  const processedCoverImage = processImagePath(config.coverImage);

  return (
    <div className="flex flex-col sm:flex-row items-start gap-5 h-full">
      <div className="flex-1 flex flex-col justify-start gap-3 order-2 sm:order-1">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">我的歌单</h3>
        </div>

        <h3 className="text-xl font-semibold text-foreground">{config.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {config.description}
        </p>
        <a
          href={config.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center sm:justify-start gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
        >
          <span className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors duration-200">
            {config.buttonText}
          </span>
        </a>
      </div>

      <div className="h-49 w-49 shrink-0 rounded-xl overflow-hidden shadow-md order-1 sm:order-2">
        <OptimizedImage
          src={processedCoverImage}
          alt={config.name}
          width={196}
          height={196}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

/**
 * 游戏库横向手风琴面板组件
 * 桌面端多个面板水平排列，点击后展开显示游戏详情，其他面板收缩只显示封面和名称
 */
function GameLibraryAccordionPanel({
  game,
  isActive,
  onClick,
  isBackgroundEnabled,
  collapsedFlex = 1,
}: {
  game: GameConfig;
  isActive: boolean;
  onClick: () => void;
  isBackgroundEnabled: boolean;
  collapsedFlex?: number;
}) {
  const processedCoverImage = processImagePath(game.coverImage);

  const glassClass = isBackgroundEnabled
    ? 'backdrop-blur-md bg-card/90 border-border shadow-lg supports-[backdrop-filter]:bg-card/75'
    : 'bg-card border-border';

  return (
    <motion.div
      layout
      onClick={onClick}
      initial={false}
      animate={{
        flex: isActive ? 3 : collapsedFlex,
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative overflow-hidden rounded-2xl border cursor-pointer ${glassClass} transition-all duration-300 ${isActive ? 'shadow-2xl shadow-primary/20' : 'shadow-lg'}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={processedCoverImage}
          alt={game.name}
          className="absolute left-0 w-full object-cover transition-all duration-500 ease-out"
          style={{
            height: game.coverSize || '120%',
            top: `${-(parseVerticalPosition(game.coverVerticalPosition) / 100) * (parseInt(game.coverSize || '120', 10) - 100)}%`,
            objectPosition: `${game.coverHorizontalPosition || 'center'} center`
          }}
          loading="lazy"
        />
      </div>

      <div
        className="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300"
        style={{ opacity: isActive ? 0 : 1, pointerEvents: isActive ? 'none' : 'auto' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-10 text-center">
          <h3 className="text-sm font-semibold text-white drop-shadow-lg whitespace-nowrap">
            {game.name}
          </h3>
        </div>
      </div>

      <div
        className="absolute inset-0 flex flex-col justify-end p-3 transition-opacity duration-300"
        style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/5" />
        <p className="relative z-10 text-sm text-white/90 leading-relaxed drop-shadow-md">
          {game.description}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * 关于页面右侧区块组件
 */
function AboutSection({
  section,
  className = '',
  hideTitle = false,
}: {
  section: AboutSectionConfig;
  className?: string;
  hideTitle?: boolean;
}) {
  const iconMapForSection: Record<string, React.ComponentType<{ className?: string }>> = {
    'about-me': User,
    'about-site': Globe,
    'about-domain': Link2,
  };
  const IconComponent = iconMapForSection[section.id];

  return (
    <div className={className}>
      {!hideTitle && (
        <div className="flex items-center gap-2 mb-4">
          {IconComponent && <IconComponent className="w-5 h-5 text-primary" />}
          <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
        </div>
      )}

      <div className="text-muted-foreground leading-relaxed space-y-3 text-sm">
        {section.paragraphs.map((paragraph, index) => (
          <p key={index} className="indent-8">
            {paragraph}
          </p>
        ))}
      </div>

      {section.quote && (
        <div className="my-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-sm text-muted-foreground/80 mb-2">{section.quote.intro}</p>
          <p className="italic whitespace-pre-line">{section.quote.text}</p>
        </div>
      )}

      {section.footer && (
        <p className="text-primary font-medium text-center mt-4">{section.footer}</p>
      )}
    </div>
  );
}

/**
 * 星空粒子背景组件
 */
function StarField({ count = 12, className = '' }: { count?: number; className?: string }) {
  const stars = React.useMemo(() => {
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
      opacity: Math.random() * 0.4 + 0.2,
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-primary"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/**
 * 解析垂直位置配置
 */
function parseVerticalPosition(position?: string): number {
  if (!position) return 50;
  if (position === 'top') return 0;
  if (position === 'center') return 50;
  if (position === 'bottom') return 100;
  const parsed = parseInt(position, 10);
  return Number.isNaN(parsed) ? 50 : Math.max(0, Math.min(100, parsed));
}

/**
 * 横向手风琴面板组件
 */
function HorizontalAccordionPanel({
  section,
  isActive,
  onClick,
  isBackgroundEnabled,
}: {
  section: AboutSectionConfig;
  isActive: boolean;
  onClick: () => void;
  isBackgroundEnabled: boolean;
}) {
  const iconMapForPanel: Record<string, React.ComponentType<{ className?: string }>> = {
    'about-me': User,
    'about-site': Globe,
    'about-domain': Link2,
  };
  const IconComponent = iconMapForPanel[section.id];

  const glassClass = isBackgroundEnabled
    ? 'backdrop-blur-md bg-card/90 border-border shadow-lg supports-[backdrop-filter]:bg-card/75'
    : 'bg-card border-border';

  return (
    <motion.div
      layout
      onClick={onClick}
      initial={false}
      animate={{
        flex: isActive ? 3 : 1,
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative overflow-hidden rounded-2xl border cursor-pointer ${glassClass} transition-all duration-300 ${isActive ? 'shadow-2xl shadow-primary/20' : 'shadow-lg'}`}
    >
      <AnimatePresence mode="wait">
        {!isActive && (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={processImagePath(section.coverImage)}
                alt={section.title}
                className="absolute left-0 w-full object-cover"
                style={{
                  height: section.coverSize || '120%',
                  top: `${-(parseVerticalPosition(section.coverVerticalPosition) / 100) * (parseInt(section.coverSize || '120', 10) - 100)}%`,
                  objectPosition: `${section.coverHorizontalPosition || 'center'} center`
                }}
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            <div className="absolute inset-0 flex items-end justify-center p-4">
              <div className="flex items-center gap-2 text-white drop-shadow-lg whitespace-nowrap">
                {IconComponent && <IconComponent className="w-5 h-5" />}
                <h3 className="text-base font-semibold">{section.title}</h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative h-full flex flex-col p-6 overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <StarField count={12} className="z-0" />

            <div className="relative z-10 flex items-center gap-2 mb-4 shrink-0">
              {IconComponent && <IconComponent className="w-5 h-5 text-primary" />}
              <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
            </div>

            <div className="relative z-10 flex-1 min-h-0">
              <AboutSection section={section} hideTitle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * 社交链接项组件
 */
function SocialLink({
  href,
  title,
  src,
  alt,
  onClick,
}: {
  href?: string;
  title: string;
  src: string;
  alt: string;
  onClick?: () => void;
}) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      target={href && href.startsWith('http') ? '_blank' : undefined}
      rel={href && href.startsWith('http') ? 'noopener noreferrer' : undefined}
      whileHover={{ scale: 1.12, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center w-10 h-10 rounded-lg bg-background border border-border transition-all duration-300 cursor-pointer"
      title={title}
    >
      <img
        src={src}
        alt={alt}
        className="w-[18px] h-[18px] text-foreground group-hover:text-primary transition-colors duration-300"
      />
    </motion.a>
  );
}

/**
 * 轻量 Toast 提示组件
 */
function Toast({ _message, visible }: { _message: string; visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm shadow-lg pointer-events-none"
    >
      {_message}
    </motion.div>
  );
}

/**
 * 关于页面组件
 */
export default function AboutPage() {
  const { containerStyle, isBackgroundEnabled } = useBackgroundStyle('about');
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [currentSlogan, setCurrentSlogan] = useState(slogan);
  const [activeSection, setActiveSection] = useState(0);
  const [activeFrequentGame, setActiveFrequentGame] = useState(0);
  const [activeOccasionalGame, setActiveOccasionalGame] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback((_message: string) => {
    void _message;
    setToastVisible(true);
    const hideTimer = setTimeout(() => setToastVisible(false), 2000);
    return () => clearTimeout(hideTimer);
  }, []);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(mail.replace('mailto:', ''));
      setCopied(true);
      showToast('邮箱已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (_error) {
      void _error;
      window.location.href = mail;
    }
  }, [showToast]);

  const handleShuffleSlogan = useCallback(() => {
    if (slogans.length <= 1) return;
    let nextIndex = Math.floor(Math.random() * slogans.length);
    while (slogans[nextIndex] === currentSlogan && slogans.length > 1) {
      nextIndex = Math.floor(Math.random() * slogans.length);
    }
    setCurrentSlogan(slogans[nextIndex]);
  }, [currentSlogan]);

  const getGlassStyle = useCallback(
    (baseStyle: string = '') => {
      if (isBackgroundEnabled) {
        return `${baseStyle} backdrop-blur-md bg-card/90 border-border shadow-lg supports-[backdrop-filter]:bg-card/75`;
      }
      return `bg-card ${baseStyle} border-border`;
    },
    [isBackgroundEnabled]
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 pt-[80px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerStyle.className} style={containerStyle.style}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <PageHeader
          title="关于我"
          description="了解我的博客、技术栈和联系方式"
          size="lg"
          className="mb-8"
          gradientStyle="primary"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`${getGlassStyle("rounded-2xl shadow-xl border overflow-hidden")} transition-all duration-300`}
            >
              <div className="p-6 text-center border-b border-border/50">
                <div className="text-xl sm:text-2xl font-semibold relative z-20 py-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  {BeforeAnimationText}
                  <Cover>{AnimationText}</Cover>
                </div>
              </div>

              <div className="p-6">
                <div className={`${isBorder ? 'border border-black/[0.2] dark:border-white/[0.2]' : ''} flex flex-col items-center relative`}>
                  {isBorder && <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />}
                  {isBorder && <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />}
                  {isBorder && <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />}
                  {isBorder && <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />}

                  <div className="w-full h-64">
                    <EvervaultCard />
                  </div>

                  <motion.div
                    onClick={handleShuffleSlogan}
                    className="group mt-4 text-center w-full cursor-pointer"
                    title="点击随机切换宣言"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleShuffleSlogan();
                      }
                    }}
                  >
                    <h2 className="dark:text-white text-black font-medium text-lg title group-hover:text-primary/80 transition-colors duration-300">
                      {name}
                    </h2>
                    <div className="h-6 overflow-hidden mt-1">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={currentSlogan}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="text-muted-foreground text-sm leading-relaxed group-hover:text-primary/60 transition-colors duration-300"
                        >
                          {currentSlogan}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="flex justify-center">
                  <div className="grid grid-cols-5 gap-2">
                    <motion.button
                      onClick={handleCopyEmail}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-background border border-border hover:border-primary/50 transition-all duration-300"
                      title={copied ? '已复制' : '复制邮箱'}
                    >
                      {copied ? (
                        <Check className="w-[18px] h-[18px] text-green-500" />
                      ) : (
                        <Mail className="w-[18px] h-[18px] text-foreground" />
                      )}
                    </motion.button>
                    <SocialLink
                      href={github}
                      title="GitHub"
                      src="/assets/github.svg"
                      alt="GitHub"
                    />
                    <SocialLink
                      href={bilibili}
                      title="哔哩哔哩"
                      src="/assets/bilibili.svg?v=2"
                      alt="Bilibili"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className={`${getGlassStyle("rounded-2xl p-6 border shadow-lg")} transition-colors duration-300`}
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Music className="w-5 h-5 text-primary" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground">兴趣爱好</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby, index) => (
                  <HobbyTag key={hobby.name} hobby={hobby} index={index} />
                ))}
              </div>
            </motion.div>
          </motion.aside>

          <main className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden md:flex h-[520px] gap-4 mb-6"
            >
              {aboutSections.map((section, index) => (
                <HorizontalAccordionPanel
                  key={section.id}
                  section={section}
                  isActive={activeSection === index}
                  onClick={() => setActiveSection(activeSection === index ? 0 : index)}
                  isBackgroundEnabled={Boolean(isBackgroundEnabled)}
                />
              ))}
            </motion.div>

            <div className="md:hidden space-y-4 mb-6">
              {aboutSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  className={`${getGlassStyle("rounded-2xl border shadow-lg overflow-hidden")} transition-all duration-300`}
                >
                  <button
                    onClick={() => setActiveSection(activeSection === index ? 0 : index)}
                    className="w-full flex items-center justify-between p-4 text-left"
                    aria-expanded={activeSection === index}
                  >
                    <div className="flex items-center gap-2">
                      {section.id === 'about-me' && <User className="w-5 h-5 text-primary" />}
                      {section.id === 'about-site' && <Globe className="w-5 h-5 text-primary" />}
                      {section.id === 'about-domain' && <Link2 className="w-5 h-5 text-primary" />}
                      <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: activeSection === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-primary text-lg">▼</span>
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {activeSection === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0">
                          <AboutSection section={section} hideTitle />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={getGlassStyle("rounded-2xl p-6 border md:col-span-1")}
              >
                <MBTICard config={mbti} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className={getGlassStyle("rounded-2xl p-6 border md:col-span-2")}
              >
                <MusicPlaylistCard config={musicPlaylist} />
              </motion.div>
            </motion.div>

          </main>

          <div className="col-span-full lg:col-span-4 -mt-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className={`${getGlassStyle("rounded-2xl p-6 border")} mb-6`}
            >
              <div className="flex items-center gap-2 mb-5">
                <GamepadIcon className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">我的游戏库</h3>
              </div>

              <div className="hidden md:flex h-[400px] gap-4 mb-4">
                {frequentGames.map((game, index) => (
                  <GameLibraryAccordionPanel
                    key={game.id}
                    game={game}
                    isActive={activeFrequentGame === index}
                    onClick={() => setActiveFrequentGame(index)}
                    isBackgroundEnabled={Boolean(isBackgroundEnabled)}
                  />
                ))}
              </div>

              <div className="hidden md:flex h-[400px] gap-4">
                {occasionalGames.map((game, index) => (
                  <GameLibraryAccordionPanel
                    key={game.id}
                    game={game}
                    isActive={activeOccasionalGame === index}
                    onClick={() => setActiveOccasionalGame(index)}
                    isBackgroundEnabled={Boolean(isBackgroundEnabled)}
                    collapsedFlex={0.5}
                  />
                ))}
              </div>

              <div className="md:hidden space-y-4 mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">常玩</h4>
                {frequentGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                    className={`${getGlassStyle("rounded-2xl border shadow-lg overflow-hidden")} transition-all duration-300`}
                  >
                    <button
                      onClick={() => setActiveFrequentGame(index)}
                      className="w-full flex items-center justify-between p-4 text-left"
                      aria-expanded={activeFrequentGame === index}
                    >
                      <h3 className="text-lg font-semibold text-foreground">{game.name}</h3>
                      <motion.div
                        animate={{ rotate: activeFrequentGame === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-primary text-lg">▼</span>
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {activeFrequentGame === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0">
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                              <div className="flex-1 flex flex-col gap-2 order-2 sm:order-1">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {game.description}
                                </p>
                              </div>
                              <div className="h-28 w-28 shrink-0 rounded-xl overflow-hidden shadow-md order-1 sm:order-2">
                                <OptimizedImage
                                  src={processImagePath(game.coverImage)}
                                  alt={game.name}
                                  width={112}
                                  height={112}
                                  className="w-full h-full"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              <div className="md:hidden space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">偶尔玩/通关</h4>
                {occasionalGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                    className={`${getGlassStyle("rounded-2xl border shadow-lg overflow-hidden")} transition-all duration-300`}
                  >
                    <button
                      onClick={() => setActiveOccasionalGame(index)}
                      className="w-full flex items-center justify-between p-4 text-left"
                      aria-expanded={activeOccasionalGame === index}
                    >
                      <h3 className="text-lg font-semibold text-foreground">{game.name}</h3>
                      <motion.div
                        animate={{ rotate: activeOccasionalGame === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-primary text-lg">▼</span>
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {activeOccasionalGame === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0">
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                              <div className="flex-1 flex flex-col gap-2 order-2 sm:order-1">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {game.description}
                                </p>
                              </div>
                              <div className="h-28 w-28 shrink-0 rounded-xl overflow-hidden shadow-md order-1 sm:order-2">
                                <OptimizedImage
                                  src={processImagePath(game.coverImage)}
                                  alt={game.name}
                                  width={112}
                                  height={112}
                                  className="w-full h-full"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Toast _message="邮箱已复制到剪贴板" visible={toastVisible} />
    </div>
  );
}
