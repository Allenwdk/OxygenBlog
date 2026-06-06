# 前端页面视觉优化

## Why
当前页面虽然使用了毛玻璃效果，但整体设计风格偏重、缺乏层次感。卡片和内容的质感不够精致，需要增强模糊效果来提升品质感，同时增加页面的轻快感和灵动性。

## What Changes
- **导航栏**：增加 `backdrop-blur-xl` 更强烈的模糊效果，添加微妙渐变背景，优化悬停动画
- **卡片组件**：全面使用更透明的毛玻璃效果（bg-white/60 → bg-white/40），增强阴影层次
- **背景层**：添加多层渐变叠加 + 微妙的模糊装饰元素
- **按钮和交互**：增加悬浮时的光晕效果和微妙弹性动画
- **间距和排版**：增加页面间距，让内容呼吸感更强
- **过渡动画**：统一使用更流畅的缓动函数（ease-out-cubic）

## Impact
- 受影响规格：无其他规格
- 受影响代码：`globals.css`, `Navigation.tsx`, `Footer.tsx`, `BackgroundLayer.tsx`, `ClientBlogsPage.tsx`, `AboutPage.tsx`, `page.tsx` 等所有页面组件

## ADDED Requirements

### Requirement: 全局毛玻璃样式系统
系统应提供一套统一的毛玻璃效果工具类，用于不同层级的容器。

#### Scenario: 使用毛玻璃效果的卡片
- **WHEN** 开发者需要使用毛玻璃效果
- **THEN** 可使用预定义的 glass-card、glass-nav 等语义化工具类

### Requirement: 多层阴影层次系统
系统应提供至少三个层级的阴影效果来创建深度感。

#### Scenario: 内容层级区分
- **WHEN** 页面需要展示层次结构
- **THEN** 使用 shadow-sm（底层）、shadow-md（中层）、shadow-lg（悬浮/重点）三级阴影

### Requirement: 动态模糊装饰元素
背景层应包含微妙的模糊装饰来增加质感。

#### Scenario: 页面加载时显示装饰
- **WHEN** 页面渲染 BackgroundLayer
- **THEN** 背景中会出现几个随机位置的模糊圆形光斑，颜色与主题色协调

## MODIFIED Requirements

### Requirement: 导航栏样式
**当前实现**: 简单半透明背景 `bg-background/80` + `backdrop-blur-md`
**修改为**: 更强的模糊效果 `bg-background/60` + `backdrop-blur-xl`，添加微妙渐变底色，悬停时增加下划线动画

### Requirement: 卡片组件样式
**当前实现**: 基础毛玻璃 `bg-card/90` + `shadow-md`
**修改为**: 更透明的毛玻璃 `bg-white/45 dark:bg-gray-800/45` + `backdrop-blur-xl` + 更强的边框透明度 + shadow-sm，悬浮时升级到 shadow-xl

### Requirement: 按钮交互效果
**当前实现**: 基础颜色变化 + 轻微位移
**修改为**: 增加光晕背景、更平滑的弹性动画、悬浮时的微妙发光效果

### Requirement: Footer样式
**当前实现**: `backdrop-blur-md bg-background/80`
**修改为**: `bg-background/50 backdrop-blur-xl`，更透明的背景和更强的模糊

## REMOVED Requirements
无
