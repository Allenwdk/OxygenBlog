---
title: 使用Reference对象数组的示例文章
date: 2023-11-20
category: 技术
tags: [React, Next.js, TypeScript]
readTime: 5
excerpt: 这是一篇展示如何使用Reference对象数组格式的示例文章
reference: [
  { description: "Next.js官方文档", link: "https://nextjs.org/docs" },
  { description: "React官方文档", link: "https://reactjs.org/docs/getting-started.html" },
  { description: "TypeScript官方文档", link: "https://www.typescriptlang.org/docs/" },
  { description: "Tailwind CSS文档", link: "https://tailwindcss.com/docs" },
  { description: "MDN Web文档", link: "https://developer.mozilla.org/zh-CN/" }
]
---

# 使用Reference对象数组的示例文章

这是一篇展示如何在博客中使用Reference对象数组格式的示例文章。在这篇文章中，我们将看到如何在Markdown文件的前置元数据中定义reference数组，以及它们如何在博客详情页面中显示。

## Reference对象数组格式

在博客的前置元数据中，我们可以使用以下格式定义reference：

```yaml
reference: [
  { description: "资源描述", link: "https://example.com" },
  { description: "另一个资源", link: "https://another-example.com" }
]
```

每个reference对象包含两个字段：

1. `description`: 资源的描述文本
2. `link`: 资源的URL链接

## 显示效果

在博客详情页面中，reference将以超链接的形式显示，并且当reference数量超过3个时，会自动折叠并提供展开/收起按钮。

## 暗黑模式适配

Reference显示区域已经适配了暗黑模式，在不同的主题下都能保持良好的可读性和视觉效果。

## 移动端适配

Reference显示区域也进行了移动端适配，在小屏幕设备上能够正确换行并保持良好的布局。

---

这只是一个示例文章，用于展示Reference对象数组的使用方法和显示效果。