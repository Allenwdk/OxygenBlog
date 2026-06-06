# Tasks

- [ ] Task 1: 创建动态 API 路由（服务端上传）
  - [ ] 创建 `/src/app/api/moments/route.ts` - GitHub API 端点
  - [ ] 实现文件保存逻辑：`src/content/moments/作者名/yyyyMMddHHmmss/content.md`
  - [ ] 实现多图片上传支持，保存到同一目录
  - [ ] 复用现有的 GitHub API 调用模式（参考 `/api/publish/route.ts`）

- [ ] Task 2: 创建动态本地 API 路由（本地开发环境）
  - [ ] 创建 `/src/app/api/moments/local/route.ts` - 本地文件保存端点
  - [ ] 使用 `fs/promises` API 实现文件写入
  - [ ] 复用现有的本地保存模式（参考 `/api/publish/local/route.ts`）

- [ ] Task 3: 创建动态发布表单组件（集成到 Moments 页面）
  - [ ] 创建 `/src/components/moments/MomentForm.tsx`
  - [ ] 实现作者名输入字段（必填）
  - [ ] 集成简化版 Markdown 编辑器（支持文字和图片插入）
  - [ ] 添加图片插入功能：点击按钮选择本地文件
  - [ ] 实现 base64 预览和本地文件暂存
  - [ ] 发布时同时上传 content.md 和所有图片文件

- [ ] Task 4: 创建动态列表页面组件（含快捷发布框）
  - [ ] 创建 `/src/app/moments/page.tsx` - 服务端组件，扫描 `src/content/moments/` 目录
  - [ ] 实现递归扫描 `.md` 文件并解析 front matter（参考 `blogs/page.tsx`）
  - [ ] 按日期倒序排列动态列表
  - [ ] 创建 `/src/app/moments/ClientMomentsPage.tsx` - 客户端组件
  - [ ] 在页面顶部集成 MomentForm 快捷发布输入框
  - [ ] 发布成功后自动刷新动态列表

- [ ] Task 6: 创建动态卡片和时间线布局组件
  - [ ] 创建 `/src/components/moments/MomentCard.tsx`
  - [ ] 实现时间线样式（左侧竖线和圆点，右侧内容卡片）
  - [ ] 展示动态摘要（标题、作者、日期、内容预览、图片缩略图）
  - [ ] 添加点击跳转到详情页的逻辑

- [ ] Task 7: 创建动态详情页面
  - [ ] 创建 `/src/app/moments/[slug]/page.tsx` - 服务端组件
  - [ ] 根据 slug 查找对应的 `.md` 文件
  - [ ] 解析 front matter 和 Markdown 内容
  - [ ] 转换相对路径图片为 public 路径（参考 `blogs/[slug]/page.tsx`）
  - [ ] 创建 `/src/app/moments/[slug]/ClientMomentDetail.tsx` - 客户端渲染组件

- [ ] Task 8: 更新导航栏
  - [ ] 修改 `/src/components/Navigation.tsx`
  - [ ] 在导航项中添加"动态"入口，链接指向 `/moments`
  - [ ] 确保桌面端和移动端都显示新的导航项

# Task Dependencies
- Task 1 和 Task 2 可以并行执行（独立的 API 路由）
- Task 3 依赖 Task 1 的 API 接口定义
- Task 4 依赖 Task 3（需要 MomentForm 组件），同时 Task 6 和 Task 7 依赖 Task 4 的数据结构定义
- Task 8 可以独立执行，不依赖其他任务
