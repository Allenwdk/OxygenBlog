# Tasks

- [x] Task 1: 重构 MomentCard 卡片样式 — 接入毛玻璃设计系统
  - [x] SubTask 1.1: 将 MomentCard 外层容器从无边框浮动内容改为 `glass-card` + `shadow-glass-md` 毛玻璃卡片样式
  - [x] SubTask 1.2: 添加 hover 上浮效果（translate-y）和阴影增强（shadow-glass-lg）
  - [x] SubTask 1.3: 优化头像样式，添加更精致的渐变和阴影效果
  - [x] SubTask 1.4: 将内容截断从硬字符截断（200字符）改为按行数截断（4行），配合底部渐变淡出遮罩效果
  - [x] SubTask 1.5: 优化图片网格布局，实现自适应：单张占宽、两张双列、三张及以上三列
  - [x] SubTask 1.6: 优化操作栏样式和间距，增加视觉层次

- [x] Task 2: 增强操作栏交互反馈
  - [x] SubTask 2.1: 为点赞按钮添加缩放弹跳动画（whileTap scale）和计数过渡效果
  - [x] SubTask 2.2: 为分享按钮添加复制链接到剪贴板功能，并显示"已复制"Toast 提示
  - [x] SubTask 2.3: 为评论按钮添加点击展开评论区域（或跳转到详情页评论区）的交互

- [x] Task 3: 改进 MomentForm 发布表单 — 可折叠设计
  - [x] SubTask 3.1: 将表单默认设为收起状态，仅显示一个"发布动态"触发按钮
  - [x] SubTask 3.2: 添加展开/收起动画（AnimatePresence + height/opacity 过渡）
  - [x] SubTask 3.3: 发布成功后自动收起表单
  - [x] SubTask 3.4: 将触发按钮设计为与页面风格协调的毛玻璃样式

- [x] Task 4: 增加时间分组标记
  - [x] SubTask 4.1: 实现日期分组逻辑，将动态按"今天"、"昨天"、"具体日期"进行分组
  - [x] SubTask 4.2: 在每组之间渲染日期分隔标记，样式为带主题色装饰的标签/徽章
  - [x] SubTask 4.3: 保持时间线视觉连接的连贯性

- [x] Task 5: 优化页面头部区域
  - [x] SubTask 5.1: 在标题下方添加统计摘要（动态总数、最新发布时间）
  - [x] SubTask 5.2: 优化标题排版，增加副标题描述
  - [x] SubTask 5.3: 统计信息使用 `muted-foreground` 色调，保持视觉轻量

- [x] Task 6: 改进详情视图设计
  - [x] SubTask 6.1: 将详情视图内容包裹在 `glass-card` 毛玻璃卡片中
  - [x] SubTask 6.2: 优化返回按钮样式，使其更明显易点击
  - [x] SubTask 6.3: 改进详情视图中图片的网格布局，支持更宽的自适应展示
  - [x] SubTask 6.4: 为详情视图中的图片添加点击放大预览功能（Lightbox）

- [x] Task 7: 实现图片预览弹窗（Lightbox）
  - [x] SubTask 7.1: 创建轻量级图片预览组件，支持全屏查看大图
  - [x] SubTask 7.2: 添加背景遮罩和关闭按钮
  - [x] SubTask 7.3: 支持 ESC 键和点击遮罩关闭
  - [x] SubTask 7.4: 添加进入/退出动画（scale + opacity）

- [x] Task 8: 改进空状态设计
  - [x] SubTask 8.1: 使用项目主题色设计精致的 SVG 图标/插图替代 emoji
  - [x] SubTask 8.2: 优化空状态文案的排版和间距

# Task Dependencies
- Task 1 (MomentCard 重构) 无依赖，可独立进行
- Task 2 (操作栏交互) 依赖 Task 1 中的操作栏样式重构
- Task 3 (发布表单折叠) 无依赖，可独立进行
- Task 4 (时间分组) 依赖 Task 1 完成后的卡片样式
- Task 5 (页面头部) 无依赖，可独立进行
- Task 6 (详情视图) 依赖 Task 7 (Lightbox 组件)
- Task 7 (Lightbox) 无依赖，可独立进行
- Task 8 (空状态) 无依赖，可独立进行
