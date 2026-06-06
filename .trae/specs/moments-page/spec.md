# 动态页面功能 Spec

## Why
用户希望在博客中添加一个类似QQ空间的"动态"页面，可以快捷发布短内容（文字或文字+图片），用于分享日常碎片化内容，与长篇文章形成互补。

## What Changes
- 新增 `/moments` 页面，展示所有动态列表（时间线布局），顶部包含快捷发布输入框
- 新增 API 路由支持动态内容的上传和保存
- 新增动态详情页面 `/moments/[slug]`
- 数据存放路径：`content/moment/作者名/yyMMddHHmmss/content.md`
- 图片上传到与 Markdown 相同的目录

## Impact
- 新增页面路由：`/moments`、`/moments/[slug]`
- 新增 API 路由：`/api/moments`、`/api/moments/local`
- 新增组件：MomentCard、MomentList、MomentForm（集成在 Moments 页面）
- 新增目录结构：`src/content/moments/`
- 修改导航栏：添加"动态"入口

## ADDED Requirements

### Requirement: 动态列表页展示
系统 SHALL 在 `/moments` 页面展示所有已发布的动态，以时间线方式排列。

#### Scenario: 成功加载动态列表
- **WHEN** 用户访问 `/moments` 页面
- **THEN** 系统递归扫描 `src/content/moments/` 目录下的所有 `.md` 文件
- **THEN** 按日期倒序排列（最新的在前）
- **THEN** 以卡片形式展示每条动态的摘要（标题、作者、日期、内容预览）

#### Scenario: 动态列表为空
- **WHEN** `src/content/moments/` 目录下没有 `.md` 文件
- **THEN** 页面显示空状态提示文案

### Requirement: 动态详情页面
系统 SHALL 在 `/moments/[slug]` 展示动态的完整内容，包括所有图片和文字。

#### Scenario: 成功加载动态详情
- **WHEN** 用户点击某条动态卡片
- **THEN** 系统导航到对应的 `/moments/[slug]` 页面
- **THEN** 渲染完整的 Markdown 内容（包含图片）
- **THEN** 使用与博客详情页相同的 Markdown 渲染组件

### Requirement: 动态发布表单
系统 SHALL 在 `/moments` 页面顶部提供快捷发布输入框，支持发布文字或文字+图片的短内容。

#### Scenario: 填写并发布动态
- **WHEN** 用户访问 `/moments` 页面
- **THEN** 页面顶部显示发布输入区域，包含以下字段：
  - 作者名（必填）
  - 动态内容输入框（支持 Markdown 语法和文字+图片）
  - 可选的简短标签/话题
- **THEN** 提供图片插入功能（点击按钮选择本地图片文件）
- **THEN** 点击图片插入按钮时，弹出文件选择器，支持选择本地图片文件

#### Scenario: 上传图片并预览
- **WHEN** 用户选择了本地图片文件
- **THEN** 系统显示图片预览
- **THEN** 将图片信息暂存到表单数据中（base64 或 File 对象）
- **THEN** 在输入框中插入 `![描述](图片占位标识)` 格式的引用

#### Scenario: 发布动态后刷新列表
- **WHEN** 用户点击发布按钮成功发布动态
- **THEN** 页面自动刷新动态列表
- **THEN** 新发布的动态显示在列表顶部（最新在前）

### Requirement: 动态内容保存
系统 SHALL 提供 API 端点保存动态内容到指定路径。

#### Scenario: GitHub Pages 环境发布
- **WHEN** 用户在 GitHub Pages 环境提交动态
- **THEN** 调用 `/api/moments` 端点
- **THEN** 系统使用 GitHub API 将 `content.md` 文件保存到 `src/content/moments/作者名/yyyyMMddHHmmss/content.md`
- **THEN** 如果有图片，将每个图片保存为同目录下的 `yyyy-MM-dd-HH-mm-ss_序号.扩展名` 格式
- **THEN** 图片引用路径更新为相对路径（如 `./2025-01-20-14-30-00_1.jpg`）

#### Scenario: 本地开发环境发布
- **WHEN** 用户在本地开发环境提交动态
- **THEN** 调用 `/api/moments/local` 端点
- **THEN** 系统使用 Node.js `fs/promises` 将文件保存到本地 `src/content/moments/` 目录
- **THEN** 结构与服务端发布保持一致

### Requirement: 时间线展示布局
系统 SHALL 以类似 QQ 空间的时间线方式展示动态。

#### Scenario: 时间线渲染
- **WHEN** 用户在 `/moments` 页面浏览动态
- **THEN** 每条动态卡片左侧显示日期竖线和圆点
- **THEN** 右侧显示动态内容（类似聊天气泡或卡片样式）
- **THEN** 整体布局简洁，突出内容本身

## MODIFIED Requirements

### Requirement: 导航栏
现有导航栏 SHALL 新增"动态"入口链接。

#### Scenario: 导航栏更新
- **WHEN** 用户打开导航栏（桌面/移动端）
- **THEN** 显示包含"首页"、"博客"、"归档"、"动态"、"发布"、"关于"的导航项
- **THEN** "动态"链接指向 `/moments`

## REMOVED Requirements
无
