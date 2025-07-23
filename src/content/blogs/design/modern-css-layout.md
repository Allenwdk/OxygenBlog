---
title: 现代 CSS 布局技巧
date: 2024-01-05
category: 设计
tags: [CSS, 布局, 前端]
readTime: 10
excerpt: 掌握现代 CSS 布局技术，包括 Grid、Flexbox 和容器查询，打造响应式设计。
---

# 现代 CSS 布局技巧

现代 CSS 提供了强大的布局工具，让我们能够创建复杂而灵活的网页布局。

## CSS Grid 高级技巧

### 1. 网格区域命名
```css
.container {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

### 2. 自适应网格
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
```

## Flexbox 最佳实践

### 1. 完美居中
```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

### 2. 等高列
```css
.columns {
  display: flex;
  gap: 1rem;
}

.column {
  flex: 1;
}
```

## 容器查询

容器查询是 CSS 的新特性，允许基于容器大小应用样式。

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
```

## 响应式设计原则

1. **移动优先**：从小屏幕开始设计
2. **渐进增强**：逐步添加复杂功能
3. **灵活单位**：使用相对单位而非固定像素

## 总结

掌握这些现代 CSS 布局技术，能够帮助你创建更加灵活和响应式的网页设计。