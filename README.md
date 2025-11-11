# OxygenBlog - 博客发布系统

一个基于Next.js和TypeScript的现代化博客系统，支持自动发布到GitHub Pages。

## 功能特性

### 已完成功能
- ✅ 现代化响应式博客界面
- ✅ Markdown文章支持
- ✅ 自动构建和部署到GitHub Pages
- ✅ 高级发布页面编辑器
- ✅ 自动化GitHub发布脚本
- ✅ 主题和样式系统
- ✅ 评论系统集成(Giscus)

### 最新功能: 自动发布系统
现在您可以使用GitHub token自动化上传和发布博客文章！

## 快速开始

### 1. 环境配置
确保在GitHub仓库设置中配置了以下secrets：
- `BLOG_GITHUB_TOKEN`: 具有repo权限的个人访问令牌
- `BLOG_GITHUB_BRANCH`: 部署分支 (通常是main)
- `BLOG_GITHUB_REPO`: 仓库名称
- `BLOG_GITHUB_OWNER`: 仓库作者/组织名

### 2. 安装依赖
```bash
pnpm install
```

### 3. 本地开发
```bash
pnpm run dev
```
访问 http://localhost:3000 查看博客

### 4. 构建生产环境
```bash
pnpm run build
```

## 自动发布系统使用指南

### 脚本功能
自动发布脚本(`scripts/auto-publish.js`)支持以下功能：
- 解析Markdown文章文件
- 自动生成文章元数据
- 创建或更新GitHub仓库文件
- 触发GitHub Actions自动部署

### 使用方法

#### 1. 单个文件发布
```bash
# 发布指定的Markdown文件
pnpm publish-file posts/my-article.md

# 或者使用完整路径
pnpm publish-file ./content/posts/my-article.md
```

#### 2. 批量发布目录
```bash
# 发布整个目录下的所有Markdown文件
pnpm publish-dir posts

# 或者使用完整路径
pnpm publish-dir ./content/posts
```

#### 3. 交互式发布
```bash
# 启动交互式模式，会显示所有可用的Markdown文件
pnpm publish
```

### Markdown文件格式

文章文件应该包含frontmatter元数据和正文内容：

```markdown
---
title: 文章标题
summary: 文章摘要
date: 2024-01-15
tags: [技术, JavaScript, Next.js]
category: 技术分享
---

这里是文章正文内容，支持Markdown语法。

## 章节标题

正文内容...

- 列表项1
- 列表项2
```

### 脚本选项

脚本支持以下命令行参数：
- `--file <路径>`: 发布单个文件
- `--dir <路径>`: 发布整个目录
- `--help`: 显示帮助信息
- `--version`: 显示版本信息

### 环境变量
脚本会自动从以下环境变量读取配置：
- `BLOG_GITHUB_TOKEN`: GitHub访问令牌
- `BLOG_GITHUB_BRANCH`: 目标分支
- `BLOG_GITHUB_REPO`: 仓库名称
- `BLOG_GITHUB_OWNER`: 仓库所有者

### 示例

#### 示例1: 发布单篇文章
```bash
# 创建一个新文章
echo "---
title: 我的第一篇博客
summary: 这是一篇介绍博客系统的文章
date: $(date +%Y-%m-%d)
tags: [博客, 介绍]
category: 随笔
---

# 欢迎来到我的博客

这是一篇关于博客系统的介绍文章。

## 主要特性

- 现代化设计
- 自动化部署
- Markdown支持
" > posts/first-post.md

# 发布文章
pnpm publish-file posts/first-post.md
```

#### 示例2: 批量发布多篇文章
```bash
# 发布所有posts目录下的文章
pnpm publish-dir posts
```

#### 示例3: 查看可发布的文件
```bash
# 交互式模式
pnpm publish
```

### 错误处理

脚本包含完善的错误处理机制：
- 文件不存在检查
- GitHub API错误处理
- 网络连接问题处理
- 权限验证

### 日志输出

脚本提供详细的操作日志：
- ✅ 成功操作
- ❌ 错误信息
- ℹ️ 提示信息
- 📝 处理进度

### 高级用法

#### 自定义部署
脚本会自动触发GitHub Actions工作流，您也可以手动触发：
```bash
# 通过GitHub CLI手动触发
gh workflow run deploy.yml
```

#### 监控部署状态
在GitHub Actions页面可以实时查看部署状态和日志。

## 项目结构

```
OxygenBlog/
├── src/
│   ├── app/                 # Next.js应用目录
│   ├── components/          # React组件
│   ├── lib/                # 工具库
│   └── styles/             # 样式文件
├── scripts/
│   ├── auto-publish.js     # 自动发布脚本
│   └── sync-theme-colors.js # 主题同步脚本
├── posts/                  # 文章文件(可选)
├── public/                 # 静态资源
├── .github/workflows/      # GitHub Actions
├── package.json
└── README.md
```

## 开发工作流

1. **本地开发**: 使用 `pnpm run dev` 启动开发服务器
2. **文章编辑**: 使用发布页面或创建Markdown文件
3. **自动发布**: 使用 `pnpm publish` 命令发布文章
4. **自动部署**: GitHub Actions自动构建和部署
5. **在线查看**: 通过GitHub Pages访问博客

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License

---

**注意**: 确保在生产环境中正确配置GitHub secrets，以避免发布失败。