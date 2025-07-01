# Oxyegn Blog Platform
本项目是一个基于 NEXT.js 制作的一个美观、配置方便、简洁的博客平台，目前为 V1.2.0 版本，后续会根据需求进行更新。

## 功能
- 支持 Markdown 格式的博客文章
- 支持分类功能
- 支持自定义导航栏、侧边栏、页脚等
- 支持深色模式

## 如何配置 (本地)
1. git clone 到本地
2. 安装依赖
```bash
npm install
# or
yarn install
# or
pnpm install
```
3. 运行项目
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
## 博客存放位置
博客存放在`src/content/blogs`文件夹中，需要遵循一定的规范
markdown文件元数据规范如下

```text
---
title: 使用Reference对象数组的示例文章 //名称，不填写则为文件名
date: 2023-11-20 //时间
category: 技术 //分类
tags: [React, Next.js, TypeScript] //标签。目前还不支持通过标签筛选
readTime: 5 //阅读时间
excerpt: 这是一篇展示如何使用Reference对象数组格式的示例文章 //摘要，显示在卡片上
reference: [ //博文参考来源，可不配置
  { description: "Next.js官方文档", link: "https://nextjs.org/docs" },
  { description: "React官方文档", link: "https://reactjs.org/docs/getting-started.html" },
  { description: "TypeScript官方文档", link: "https://www.typescriptlang.org/docs/" },
  { description: "Tailwind CSS文档", link: "https://tailwindcss.com/docs" },
  { description: "MDN Web文档", link: "https://developer.mozilla.org/zh-CN/" }
]
---
```

- markdown文件内部图片如果存放在本地，需要放在**public**文件夹下，然后通过md语法引用路径
## 配置
平台配置存放在setting文件夹中，即改即用
```text
AboutSetting.ts //关于页面的配置
blogSetting.ts //博客页面的配置
FooterSetting //网站页脚配置
HomeSetting //主页配置
NavigationSetting //导航栏配置
WebSetting.ts //网站配置
```
每一个配置文件都为您写好了注释
## 更新日志

V 1.0.0 2025.6.29
- 第一个版本

V 1.1.0 2025.6.30
1. 支持文件名为title
2. 修复代码高亮问题
3. 增加Reference和版权声明
4. 性能优化
5. 词云页面支持自定义图片
6. markdown元数据兼容性提醒

V 1.2.0 2025.6.30
1. 重构博客文件结构支持深层嵌套和灵活配置
2. 新增文章大纲导航组件
3. 优化图片处理逻辑支持相对路径
4. 改进设置文件的注释和配置项

V 1.2.1 2025.7.1
1. 重构博客图片处理逻辑，使用公共目录替代API路由
2. 修复中文URL编码问题，确保正确处理Unicode字符路径,支持中文博客名
3. 移除未使用的性能监控组件代码
4. 更新next配置以支持静态导出和Unicode路由

下版本新功能预告：
- 主题色配置
- 更强的定制化配置
# 感谢您的使用，在使用过程中遇到任何问题可以提出Issues或联系开发者，助力平台变得更好