# OxygenBlog - 智能体指令

## 语言要求

**所有文档、代码注释、提交信息和与用户的回复都必须使用中文。** 代码本身（变量名、函数名）使用英文，但注释和说明使用中文。

## 项目概述

基于 Next.js 15.3.4 的博客平台，支持静态导出（GitHub Pages）。技术栈：TypeScript + React 19 + Tailwind CSS v4。

## 核心约束

**纯静态站点。** 该项目部署在 GitHub Pages 上，所以只能使用静态方法。生产构建使用 `output: "export"` — 不能使用服务端 API、Node 运行时或动态服务端功能。所有数据必须在构建时可用。博客地址：blog.allenwdk.qzz.io

## 常用命令

- `pnpm dev` — 本地开发服务器
- `pnpm run lint` — ESLint 检查 (next lint)
- `pnpm run build` — 生产构建（先运行 `sync-theme`，输出到 `out/`）
- `pnpm install` — 安装/更新依赖

**修改完成后必须执行：** 运行 `pnpm run build` 测试生产环境构建，确保静态导出成功。仅用 dev 服务器测试不够。

## 开发环境

- Node >= 22，CI 使用 Node 24
- 包管理器：pnpm
- 平台：Windows（终端命令需使用 PowerShell 语法）
- 修改依赖后确保 `pnpm-lock.yaml` 保持最新

## 项目结构

```
src/
  app/          — Next.js App Router 页面 (about, archive, blogs, moments, publish, api)
  components/   — React 组件 (shadcn/ui 风格)
  content/blogs/ — Markdown 博客文章（YAML frontmatter）
  hooks/        — 自定义 hooks (useBackgroundStyle)
  lib/          — 工具函数 (utils.ts, process-image-path.ts)
  setting/      — 所有站点配置文件（直接修改，不要新建）
```

## 配置文件

所有站点配置在 `src/setting/` 目录下：
- `WebSetting.ts` — 主题色、背景图、网站标题
- `NavigationSetting.ts` — 导航栏
- `FooterSetting.ts` — 页脚
- `HomeSetting.ts` — 首页
- `AboutSetting.ts` — 关于页面
- `blogSetting.ts` — 博客页面
- `FriendsSetting.ts` — 友情链接页面

主题色：`themePresets` 中有 10 种预设方案，通过 `themeColors = themePresets.<名称>` 选择。CSS 变量在运行时由 `applyThemeColors()` 设置，`layout.tsx` 中的内联脚本也会设置以防止闪烁。

## 博客文章

Markdown 文件存放在 `src/content/blogs/`。必填 frontmatter：
```yaml
---
title: 字符串
date: YYYY-MM-DD
category: 分类名
tags: [标签1, 标签2]
excerpt: 摘要
readTime: 数字  # 可选，省略时自动计算
reference: 数组  # 可选
---
```

本地图片必须放在 `public/` 目录下，引用路径以 `/` 开头。

## ESLint 规则

- `src/components/` 被 ESLint 忽略
- `@typescript-eslint/no-explicit-any` 关闭（允许显式 `any`）
- `prefer-const` 关闭
- 其他 `@typescript-eslint/no-unsafe-*` 规则全部开启

## 构建细节

- `pnpm run build` 在 `next build` 之前触发 `sync-theme`（scripts/sync-theme-colors.js）
- 静态导出输出到 `out/`
- `basePath` 自动配置用于 GitHub Pages（非 `.github.io` 仓库）
- `USE_CUSTOM_DOMAIN=true` 可禁用 basePath
- 生产环境中图片不做优化（静态导出限制）

## Git 提交规范

- 提交信息使用中文，前缀格式：`change: 修复了...` / `change: 新增了...` / `change: 优化了...`

## 现有指令文件

- `.trae/rules/project_rules.md` — TypeScript 编码规范、项目上下文
- `.trae/rules/git-commit-message.md` — 提交信息格式
- `README.md` — 安装、博客格式、部署、更新日志
