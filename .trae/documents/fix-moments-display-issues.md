# 修复动态页面显示问题

## 问题概述

用户报告3个问题：
1. 列表页卡片格式无法正确解析，换行符无法解析
2. 列表页卡片内容的字体颜色应该为白色（而不是灰色）
3. 点进详情页没有内容显示

---

## 当前状态分析

### 问题 1：列表页换行符无法解析

**根因：** [page.tsx:101](file:///Users/allenwdk/OxygenBlog/src/app/moments/page.tsx#L101) 提取 excerpt 时使用了 `.replace(/\n/g, '')` 移除了所有换行符。

**当前代码：**
```typescript
excerpt: frontMatter.excerpt || (content.slice(0, 100).replace(/\n/g, '').substring(0, 100)),
```

### 问题 2：列表页卡片文字颜色为灰色

**根因：** [MomentCard.tsx:60](file:///Users/allenwdk/OxygenBlog/src/components/moments/MomentCard.tsx#L60) 使用了 `text-muted-foreground` 类。

**当前代码：**
```tsx
<p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
```

### 问题 3：详情页无内容显示

**根因分析：**
项目使用 `output: export`（静态导出模式），但 Next.js 15 文档明确指出 **API Routes 在静态导出模式下不受支持**。

- [detail/route.ts](file:///Users/allenwdk/OxygenBlog/src/app/api/moments/detail/route.ts) 使用了 `fs.readFileSync`，这是 Node.js API
- 构建时会报错：`"API Routes" with "output: export"` 错误
- 客户端尝试调用 `/api/moments/detail` 但 API 路由在静态导出中无法工作

**解决方案：** 不使用 API 路由获取详情，改为在服务端直接读取所有动态的完整内容并传递给客户端。

---

## 修复方案

### 修改 1：修复列表页 excerpt 提取逻辑（保留换行符）

**文件：** [src/app/moments/page.tsx](file:///Users/allenwdk/OxygenBlog/src/app/moments/page.tsx)

**位置：** 第 101 行

**修改前：**
```typescript
excerpt: frontMatter.excerpt || (content.slice(0, 100).replace(/\n/g, '').substring(0, 100)),
```

**修改后：**
```typescript
excerpt: frontMatter.excerpt || content.slice(0, 100),
```

### 修改 2：修复列表页卡片文字颜色

**文件：** [src/components/moments/MomentCard.tsx](file:///Users/allenwdk/OxygenBlog/src/components/moments/MomentCard.tsx)

**位置：** 第 60 行

**修改前：**
```tsx
<p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
```

**修改后：**
```tsx
<p className="text-foreground whitespace-pre-wrap leading-relaxed">
```

### 修改 3：重写详情页方案（不使用 API 路由）

**核心思路：** 在服务端读取所有动态的完整 Markdown 内容，传递给客户端组件。客户端点击卡片时直接渲染完整内容，不再调用 API。

#### 步骤 3.1：扩展 MomentPost 接口

**文件：** [src/app/moments/page.tsx](file:///Users/allenwdk/OxygenBlog/src/app/moments/page.tsx)

**位置：** 第 10-17 行（接口定义）和第 98-105 行（数据生成）

**修改内容：**
```typescript
// 在 MomentPost 接口中添加 content 字段
interface MomentPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;  // 新增：完整 Markdown 内容
  date: string;
  author: string;
  slug: string;
}

// 在 getAllMoments 中读取完整内容
momentPosts.push({
  id: slug,
  title: title,
  excerpt: frontMatter.excerpt || content.slice(0, 100),
  content: content,  // 新增：传递完整内容
  date: formatBlogDate(frontMatter.date),
  author: frontMatter.author || 'Unknown',
  slug: slug
});
```

#### 步骤 3.2：修改客户端组件接口

**文件：** [src/app/moments/ClientMomentsPage.tsx](file:///Users/allenwdk/OxygenBlog/src/app/moments/ClientMomentsPage.tsx)

**位置：** 第 13-20 行（MomentPost 接口）和第 49-64 行（fetchMomentDetail 函数）

**修改内容：**
```typescript
// 扩展 MomentPost 接口，添加 content 字段
interface MomentPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;  // 新增
  date: string;
  author: string;
  slug: string;
}

// 删除或注释掉 fetchMomentDetail 函数，改为使用 posts 中的数据
// openDetail 函数修改为直接从 posts 中查找对应数据
const openDetail = useCallback((slug: string) => {
  setSelectedSlug(slug);
  // 从 posts 中查找对应的完整内容
  const post = posts.find(p => p.slug === slug);
  if (post) {
    setDetailData({
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      author: post.author,
      content: post.content  // 直接使用完整内容
    });
  }
}, [posts]);
```

#### 步骤 3.3：移除 detail API 路由或添加 revalidate

**文件：** [src/app/api/moments/detail/route.ts](file:///Users/allenwdk/OxygenBlog/src/app/api/moments/detail/route.ts)

**方案 A（推荐）：** 删除此文件或标记为废弃，因为不再需要。

**方案 B（保留但修复构建错误）：** 添加 `export const revalidate = 0;` 配置。

---

## 修改文件清单

1. **src/app/moments/page.tsx**
   - 扩展 MomentPost 接口（添加 content 字段）
   - 修改 excerpt 提取逻辑（保留换行符）
   - 在数据生成时包含完整 content

2. **src/components/moments/MomentCard.tsx**
   - 修改文字颜色类（`text-muted-foreground` → `text-foreground`）

3. **src/app/moments/ClientMomentsPage.tsx**
   - 扩展 MomentPost 接口（添加 content 字段）
   - 修改 openDetail 逻辑，直接从 posts 中获取完整内容
   - 移除或简化 fetchMomentDetail API 调用

4. **src/app/api/moments/detail/route.ts**（可选）
   - 添加 `export const revalidate = 0;` 以修复构建错误
   - 或直接删除此文件

---

## 验证步骤

1. **列表页换行测试：**
   - 刷新动态列表页
   - 检查卡片中多行内容的换行是否正确显示

2. **颜色测试：**
   - 检查动态卡片正文文字是否为白色（`text-foreground`）
   - 日期和作者标签仍保持灰色（`text-muted-foreground`）

3. **详情页测试：**
   - 点击任意动态卡片
   - 验证详情视图能正确渲染完整 Markdown 内容
   - 检查标题、加粗、列表等格式是否正确

4. **构建验证：**
   ```bash
   pnpm run build
   ```
   - 确保没有 API 路由相关的构建错误
   - 确认静态导出成功生成

---

## 技术决策说明

1. **为什么不在客户端调用 API？**
   - `output: export` 模式下，Next.js 无法处理动态 API 路由
   - 服务端组件可以在构建时读取文件系统
   - 所有数据在构建时已确定，适合静态导出

2. **为什么不使用 revalidate？**
   - 虽然添加 `revalidate = 0` 可能解决构建错误，但这会使 API 路由成为 server-side rendered route
   - 项目部署到 GitHub Pages，不需要 SSR
   - 直接传递数据更简单、更可靠

3. **性能影响：**
   - 构建时会读取所有 `.md` 文件的完整内容
   - 对于少量动态（<100条），影响可忽略
   - 首屏加载时已包含所有数据，无需额外请求
