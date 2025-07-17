# Oxyegn Blog Platform
本项目是一个基于 NEXT.js 制作的一个美观、配置方便、简洁的博客平台，目前为 V1.3 版本，后续会根据需求进行更新。

## 功能
- 支持 Markdown 格式的博客文章
- 支持分类功能
- 支持自定义导航栏、侧边栏、页脚等
- 支持深色模式

## 如何启动本地调试服务器

**node版本: >= 22**

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
- 实例：
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

### 主题色配置
项目内置了 10 种精心设计的主题色方案，支持自定义配置：

**预设主题**：`blue`(蓝色)、`purple`(紫色)、`green`(绿色)、`orange`(橙色)、`red`(红色)、`cyan`(青色)、`pink`(粉色)、`gold`(金色)、`indigo`(靛蓝)、`emerald`(祖母绿)

**快速切换**：在 `src/setting/WebSetting.ts` 中修改：
```typescript
// 切换到绿色主题
export const themeColors = themePresets.green;

// 自定义主题色
export const themeColors = {
  primary: "#your-primary-color",
  secondary: "#your-secondary-color", 
  accent: "#your-accent-color",
};
```

**颜色用途**：
- `primary`：主要按钮、重要文字强调
- `secondary`：次要按钮、标题渐变  
- `accent`：装饰元素、动画高亮

所有主题色都支持自动深色模式适配和平滑过渡效果。

## 如何部署
- 支持一键部署到 Vercel
- 支持一键部署到 GitHub Pages
  1. Fork本仓库
  2. 在Setting里面打开Page，并且选择Github Action 方式配置
  3. 打开 Action ，选择 Deploy to Github Page， 点击 Run WorkFlow
  4. 等待部署完毕，点击Github域名进入您的网站


## 更新日志

V 1.0.0 2025.6.29
- 第一个版本

V 1.1.0 2025.6.30
1. 支持文件名为title
2. 修复代码高亮问题
3. 增加Reference和版权声明
4. 性能优化
5. 图云页面支持自定义图片
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

V 1.2.2 2025.7.1
1. 修复了静态页面样式丢失的bug
2. 现在已经支持GitHub Action 一键部署到Github Page！

V 1.2.3 2025.7.1
1. 修复了Github Action部署时没有仓库名时候的bug

V 1.2.4 2025.7.4
1. 修复了非Github根域名部署的情况下头像丢失的问题
2. 添加basePath支持以适配GitHub Pages部署
3. 添加环境变量NEXT_PUBLIC_BASE_PATH配置，用于处理GitHub Pages部署时的路径问题
4. 修改头像和图片组件以自动处理basePath
5. 优化CI工作流触发条件

V 1.3.0 2025.7.13
1. 添加了主题色和背景图的功能！现在你可以在 WebSetting 里配置你喜欢的主题色,也可以 在WebSetting 文件里配置你喜欢的背景图！
2. 修复了博客文章里列表和行内代码不能换行的问题

V 1.3.1 2025.7.15
1. 更新了主题色配置
2. 优化了暗黑模式下的页面显示

V 1.3.2 2025.7.16
1. 修复了主题色切换后闪烁的问题
2. 增加了卡片的毛玻璃特效，在有背景的情况下更美观
3. 关于我页面的动画字体提供了彩虹渐变和主题色渐变两种选项
4. 全面优化深色模式和浅色模式的特效
5. 修复了Reference不受主题色约束的问题
6. 暗色模式下背景增加了暗色遮罩

V 1.3.3 2025.7.17
1. 优化了setting的提示词，现在更直观更易懂
2. 精简代码，保持依赖的整洁
3. 在关于我页面的自我介绍添加了第三段
4. 修复 Github Action 重复构建问题


# 感谢您的使用，在使用过程中遇到任何问题可以提出Issues或联系开发者，助力平台变得更好
