# 动态页面 UI 设计优化 Spec

## Why
当前动态页面（/moments）虽然功能完整，但在视觉设计和交互体验上与项目的整体设计语言存在明显差距。卡片缺少项目统一的毛玻璃样式，布局层次感不足，发布表单位置和交互细节需要优化，图片展示不够灵活，详情视图也需要更好的设计处理。需要对动态页面进行全面的 UI 优化，使其与博客列表、首页等页面保持一致的设计品质。

## What Changes
- MomentCard 卡片接入项目毛玻璃设计系统（glass-card），增强卡片层次感和视觉品质
- 优化页面头部区域，增加统计信息展示和更清晰的内容层级
- 改进 MomentForm 发布表单设计，使其可折叠收起、减少页面空间占用
- 优化图片画廊展示，支持响应式网格布局和图片预览放大功能
- 改进详情视图设计，使用毛玻璃卡片包裹，增加更好的阅读体验
- 优化操作栏交互反馈，增加动效和状态提示
- 改进空状态设计，使用更精致的视觉表现
- 增加动态分组/归档时间标记，增强时间线感
- 确保所有改动与项目现有主题系统（oklch色彩、毛玻璃、motion动画）完全兼容

## Impact
- Affected specs: 动态页面 UI 展示、用户交互体验
- Affected code:
  - `src/app/moments/ClientMomentsPage.tsx` — 页面主布局和逻辑
  - `src/components/moments/MomentCard.tsx` — 动态卡片组件
  - `src/components/moments/MomentForm.tsx` — 发布表单组件
  - 可能需要新建少量辅助组件（如图片预览弹窗）

## ADDED Requirements

### Requirement: 毛玻璃卡片样式
系统 SHALL 将 MomentCard 卡片接入项目统一的毛玻璃设计系统。

#### Scenario: 卡片展示
- **WHEN** 用户访问动态页面
- **THEN** 每张动态卡片使用 `glass-card` + `shadow-glass-md` 样式渲染，与博客卡片视觉风格保持一致

#### Scenario: 卡片悬浮
- **WHEN** 用户将鼠标悬停在动态卡片上
- **THEN** 卡片产生上浮效果（translate-y微移）和阴影增强（shadow-glass-lg），提供视觉反馈

### Requirement: 可折叠发布表单
系统 SHALL 提供可折叠收起的发布表单，默认收起状态以节省空间。

#### Scenario: 默认状态
- **WHEN** 用户首次访问动态页面
- **THEN** 发布表单默认收起，仅显示一个"发布动态"的触发按钮

#### Scenario: 展开发布
- **WHEN** 用户点击"发布动态"按钮
- **THEN** 表单以动画展开，显示完整的发布界面

#### Scenario: 发布后收起
- **WHEN** 用户成功发布动态
- **THEN** 表单自动收起，新动态出现在列表顶部

### Requirement: 时间分组标记
系统 SHALL 在动态列表中按日期分组显示，增强时间线感。

#### Scenario: 按日期分组
- **WHEN** 动态列表中存在不同日期的动态
- **THEN** 相同日期的动态归为一组，组间显示日期分隔标记（如"今天"、"昨天"、"2026年06月08日"）

### Requirement: 改进图片展示
系统 SHALL 提供更灵活的响应式图片网格和图片预览功能。

#### Scenario: 图片网格
- **WHEN** 动态包含多张图片
- **THEN** 图片以自适应网格布局展示，单张占宽、两张双列、三张及以上三列网格

#### Scenario: 图片预览
- **WHEN** 用户点击动态中的图片
- **THEN** 弹出全屏图片预览弹窗，支持查看大图和关闭

### Requirement: 增强详情视图
系统 SHALL 使用毛玻璃卡片样式优化详情视图的阅读体验。

#### Scenario: 详情展示
- **WHEN** 用户点击某条动态查看详情
- **THEN** 详情视图使用 `glass-card` 包裹，有圆角和柔和阴影，提供沉浸式阅读体验

#### Scenario: 详情导航
- **WHEN** 用户在详情视图中
- **THEN** 能够清晰看到返回按钮、作者信息、完整内容和图片

### Requirement: 增强操作栏交互
系统 SHALL 为操作栏按钮增加更好的交互反馈。

#### Scenario: 点赞反馈
- **WHEN** 用户点击点赞按钮
- **THEN** 心形图标产生缩放弹跳动画，数字有变化过渡效果

#### Scenario: 分享反馈
- **WHEN** 用户点击分享按钮
- **THEN** 复制当前动态链接到剪贴板，并显示短暂的"已复制"提示

### Requirement: 改进空状态
系统 SHALL 提供更精致的空状态展示。

#### Scenario: 无动态时
- **WHEN** 动态列表为空
- **THEN** 显示精心设计的空状态界面，包含主题相关的插图或图标和引导文案

### Requirement: 页面头部优化
系统 SHALL 在页面头部区域展示动态统计摘要信息。

#### Scenario: 统计展示
- **WHEN** 用户访问动态页面
- **THEN** 页面头部显示动态总数和最新动态时间等统计信息

## MODIFIED Requirements

### Requirement: MomentCard 内容截断策略
将现有的硬截断（200字符）改为按行数截断，配合渐变遮罩效果。

#### Scenario: 长内容展示
- **WHEN** 动态内容超过 4 行
- **THEN** 显示前 4 行并在底部添加渐变淡出遮罩，附带"展开全文"按钮

### Requirement: 详情视图图片网格
优化详情视图中的图片展示，使用更合理的网格布局。

#### Scenario: 多图展示
- **WHEN** 详情视图包含多张图片
- **THEN** 使用响应式网格布局，大图自适应容器宽度

## REMOVED Requirements

### Requirement: 无
本次优化不移除任何现有功能，仅增强视觉和交互体验。
