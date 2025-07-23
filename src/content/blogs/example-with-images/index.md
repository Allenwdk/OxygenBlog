---
title: 示例文章
date: 2022-01-15
category: 技术
tags: ["Markdown", "渲染", "展示"]
excerpt: 展示博客平台强大的 Markdown 渲染能力，包括代码高亮、数学公式、表格等丰富功能。
---

# Markdown 渲染效果展示

这篇文章展示了我们博客平台强大的 Markdown 渲染能力。让我们一起来看看各种元素的渲染效果！ 🚀

## 代码高亮

### JavaScript 代码

```javascript
// React 函数组件示例
const BlogPost = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    console.log('组件已挂载');
    return () => console.log('组件将卸载');
  }, []);
  
  return (
    <article className="blog-post">
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};

export default BlogPost;
```

```js
console.log('这是 JavaScript 代码中的控制台输出');
```
```python
print("这是 Python 代码中的输出")
```
```Python
print("这是 Python 代码中的输出")
```

### Python 代码

```python
# 数据分析示例
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

def analyze_data(data_path):
    """分析数据并返回统计信息"""
    df = pd.read_csv(data_path)
    
    # 基本统计信息
    stats = {
        'shape': df.shape,
        'missing_values': df.isnull().sum(),
        'data_types': df.dtypes
    }
    
    return stats

# 使用示例
if __name__ == "__main__":
    result = analyze_data('data.csv')
    print(f"数据形状: {result['shape']}")
```

### SQL 查询

```sql
-- 复杂查询示例
SELECT 
    u.username,
    COUNT(p.id) as post_count,
    AVG(p.view_count) as avg_views,
    MAX(p.created_at) as last_post_date
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.username
HAVING COUNT(p.id) > 5
ORDER BY avg_views DESC
LIMIT 10;
```

## 数学公式

### 行内公式

这是一个行内公式：$E = mc^2$，爱因斯坦的质能方程。

### 块级公式

二次方程的解：

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

傅里叶变换：

$$F(\omega) = \int_{-\infty}^{\infty} f(t) e^{-i\omega t} dt$$


## 表格展示

### 技术栈对比

| 框架 | 语言 | 性能 | 学习曲线 | 生态系统 | 推荐指数 |
|------|------|------|----------|----------|----------|
| React | JavaScript | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Vue.js | JavaScript | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Angular | TypeScript | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Svelte | JavaScript | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

### 项目进度表

| 阶段 | 开始日期 | 结束日期 | 状态 | 负责人 |
|------|----------|----------|------|--------|
| 需求分析 | 2024-01-01 | 2024-01-07 | ✅ 完成 | 张三 |
| UI 设计 | 2024-01-08 | 2024-01-15 | ✅ 完成 | 李四 |
| 前端开发 | 2024-01-16 | 2024-02-15 | 🔄 进行中 | 王五 |
| 后端开发 | 2024-01-20 | 2024-02-20 | ⏳ 待开始 | 赵六 |
| 测试部署 | 2024-02-21 | 2024-02-28 | ⏳ 待开始 | 全员 |

## 引用块

> 💡 **重要提示**
> 
> 这是一个重要的引用块。它可以用来突出显示重要信息、警告或者引用他人的话。
> 
> 引用块支持多行内容，并且可以包含其他 Markdown 元素。

> 📚 **学习建议**
> 
> 在学习新技术时，建议采用以下步骤：
> 1. 理解基本概念
> 2. 动手实践
> 3. 阅读官方文档
> 4. 参与社区讨论

## 列表

### 无序列表

- 🎯 **目标明确**：设定清晰的学习目标
- 📅 **计划合理**：制定可执行的学习计划
- 💪 **持续练习**：通过实践巩固知识
- 🤝 **交流分享**：与他人交流学习心得
- 📈 **持续改进**：根据反馈调整学习方法

### 有序列表

1. 准备阶段
   - 确定学习目标 长度测试salkdjlakjldjasldjalsjdlkasjdlasjldkjaslkjdlkasjdlkjasldjlkasjdklasjlkdjas
   - 收集学习资料
   - 制定时间计划

2. **学习阶段**
   - 理论学习
   - 实践操作
   - 问题记录

3. **巩固阶段**
   - 知识总结
   - 项目实战
   - 经验分享

## 任务列表

- [x] 完成 Markdown 渲染器优化
- [x] 添加代码高亮功能
- [x] 支持数学公式渲染
- [ ] 添加图片懒加载
- [ ] 实现全文搜索
- [ ] 优化移动端体验

## 链接和图片

这里有一些有用的链接：

- [React 官方文档](https://react.dev/)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- ![博客图片演示](/assets/example.svg)

## 分隔线

---

## 行内代码

在 JavaScript 中，你可以使用 `const` 关键字声明常量，使用 `let` 声明变量。React 组件通常使用 `useState` 和 `useEffect` 钩子来管理状态和副作用。

`这是长度测试aksjdlasjdlkashdalsjdlkasjdlkasjdoiqwjlkasnxlkas`

## Emoji 支持

我们的博客平台支持 emoji！ :smile: :rocket: :heart: 

你可以使用各种 emoji 来让文章更生动：
- 技术相关：:computer: :gear: :wrench: :hammer:
- 情感表达：:joy: :thinking: :confused: :relieved:
- 状态指示：:white_check_mark: :x: :warning: :information_source:

## 总结

通过这篇文章，我们展示了博客平台强大的 Markdown 渲染能力：

1. **代码高亮**：支持多种编程语言的语法高亮
2. **数学公式**：支持 LaTeX 格式的数学公式渲染
3. **表格**：美观的表格样式和响应式设计
4. **引用块**：带有图标的美化引用块
5. **列表**：支持有序、无序和任务列表
6. **Emoji**：丰富的表情符号支持

这些功能让我们能够创建更加丰富和专业的技术博客内容！ 🎉