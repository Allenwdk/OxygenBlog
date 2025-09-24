---
title: 使用GitHub Action配置Oxygen Blog
date: 2025-9-24
category: 技术
tags: [Github]
excerpt: 这是一篇简要介绍如何使用GitHub Action配置个人blog的文章
reference: [
  { description: "OxygenBlogPlatform官方Readmd", link: "https://github.com/seasalt-haiyan/OxygenBlogPlatform/blob/main/README.md" },
]
---
# 使用GitHub Action配置Oxygen Blog

## （可选）安装加速器

1. 使用浏览器打开[Watt Toolkit官网](https://steampp.net/download)
2. 选择下载Windows版
3. 推荐使用蓝奏云下载
4. 安装
5. 打开安装的Watt Toolkit，在网络加速选项中勾选Github
6. 选择一键加速

## 注册/登录GitHub账户

### 注册GitHub账户

1. 打开[Github](https://www.github.com)
2. 点击Sign in，在接下来的界面中选择Create an account
3. 输入你的邮箱、密码、用户名，选择你的国家，完成注册流程
4. 注册完成后重新登陆

### 登录GitHub账户

1. 打开[Github](https://www.github.com)
2. 点击Sign in，输入用户名、密码，完成登录

## Fork OxygenBlogPlatform

1. 打开[OxygenBlogPlatform项目主页](https://github.com/seasalt-haiyan/OxygenBlogPlatform)
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
