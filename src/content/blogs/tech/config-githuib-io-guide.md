---
title: 使用GitHub Action配置Oxygen Blog
date: 2025-9-24
category: 技术
tags: [Github]
readTime: 
excerpt: 这是一篇简要介绍如何使用GitHub Action配置个人blog的文章
reference: [ // 博文参考来源，可不配置
  { description: "Next.js官方文档", link: "https://nextjs.org/docs" },
  { description: "React官方文档", link: "https://reactjs.org/docs/getting-started.html" },
  { description: "TypeScript官方文档", link: "https://www.typescriptlang.org/docs/" },
  { description: "Tailwind CSS文档", link: "https://tailwindcss.com/docs" },
  { description: "MDN Web文档", link: "https://developer.mozilla.org/zh-CN/" }
]
---
# 配置流程

## 注册/登录GitHub账户

### 注册GitHub账户

1. 打开www.github.com
2. 点击Sign in，在接下来的界面中选择Create an account
3. 输入你的邮箱、密码、用户名，选择你的国家，完成注册流程
4. 注册完成后重新登陆

### 登录GitHub账户

1. 打开www.github.com
2. 点击Sign in，输入用户名、密码，完成登录

## Fork OxygenBlogPlatform

1. 打开项目主页https://github.com/seasalt-haiyan/OxygenBlogPlatform
2. 点击Fork按钮，在接下来的界面中点击Create fork
3. 点击后将跳转到你自己的fork项目

## 初次部署OxygenBlog

1. 点击Settings，选中Pages
2. 将Source改为Github Actions
3. 在上方选择Actions
4. 选择I understand my workflows, go ahead and enable them
5. 在左侧Actions选项栏中选择Deploy to GitHub Pages
6. 在右侧单击Run workflow，在弹出菜单中选择Run workflow，刷新界面
7. 坐合放宽，等待约1min15s后刷新界面看到对勾即可完成部署

## 查看你的成果

1. 单击刚刚完成的Deploy to Github Pages
2. 在新打开的页面中右侧deploy下方显示的就是你的blog网址
3. 单击他，即可查看你的成果

## 客制化你的blog
