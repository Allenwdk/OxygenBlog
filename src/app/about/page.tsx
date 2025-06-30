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


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 pt-[65px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 主要内容卡片 */}
        <div className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          {/* 头部区域 */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="p-8 md:p-10 md:pt-8">
            {/* 标语区域 */}
            <div className="text-center mb-12">
              <div className="text-3xl md:text-4xl lg:text-5xl font-semibold max-w-4xl mx-auto relative z-20 py-3 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-200 dark:via-white dark:to-white">
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
              {/* 技术栈卡片 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">⚙️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">技术栈</h3>
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <IconCloud images={images} />
                  </div>
                </div>
                
              </div>

              {/* 兴趣爱好卡片 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-700/50">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">🎯</span>
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

            {/* 联系方式 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-2xl p-8 border border-indigo-200/50 dark:border-indigo-700/50 shadow-lg"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg"
                >
                  <span className="text-2xl">💬</span>
                </motion.div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Image src={GitHubIcon as string} alt="GitHub" width={24} height={24} className="text-gray-800 dark:text-white" />
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