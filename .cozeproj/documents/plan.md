# 壁纸网站开发计划（基于用户构思文档）

## 概述

开发一个 **AI辅助开发的私人审美壁纸平台**。核心定位是"内容聚合平台"——通过爬虫采集热门壁纸网站的优质内容，经过筛选后在平台展示。

**整体流程**：热门壁纸网站 → 爬虫采集图片 → 保存数据库 → 网站展示 → 用户搜索/浏览/收藏

**平台**: web  
**视觉风格**: 高级感 + 极简 + 治愈系（参考 Apple、Pinterest、Wallhaven、Unsplash）

**集成能力**: 
- 对象存储（壁纸图片存储）
- AI 搜索（未来扩展）
- 图片生成（未来 AI 二创壁纸）

## 技术方案

| 维度 | 选择 | 理由 |
|------|------|------|
| 框架 | Next.js 16 (App Router) | AI最擅长、现在主流、前后端一体 |
| UI 组件 | shadcn/ui | 快速构建一致性 UI |
| 样式 | Tailwind CSS 4 | UI容易高级、生态完善 |
| 数据库 | SQLite（前期）→ PostgreSQL（后期） | 简单、不需要服务器、适合个人项目 |
| 爬虫 | cheerio / fetch | 采集壁纸数据 |
| 图片存储 | 对象存储 (S3) | 壁纸需要持久化存储和 CDN 加速 |
| 状态管理 | React useState + localStorage | 收藏列表本地持久化 |

## 功能模块

### 1. 首页模块
- **职责**: 壁纸展示与分类筛选、AI搜索
- **要点**: 
  - 顶部毛玻璃导航栏：Logo + 导航分类(热门/最新/动漫/风景/治愈系) + 搜索/深色模式/收藏按钮
  - 中央 AI 搜索框：超大圆角、居中、半透明、高级感阴影
  - 热门分类标签栏
  - 壁纸瀑布流网格（类似 Pinterest）
  - 加载更多按钮
  - 壁纸卡片：图片 + 标签 + 收藏按钮 + 下载按钮 + Hover 动效

### 2. 壁纸详情模块
- **职责**: 单张壁纸大图预览与操作
- **要点**:
  - 大图全屏展示
  - 壁纸信息（名称、分类、标签、分辨率、热度）
  - 收藏、下载、设为壁纸按钮
  - 相似风格推荐

### 3. 收藏模块
- **职责**: 管理用户收藏的壁纸
- **要点**:
  - 收藏列表展示
  - 批量下载
  - 取消收藏

### 4. 搜索模块（未来 AI 增强）
- **职责**: 壁纸搜索
- **要点**:
  - 普通关键词搜索
  - 未来升级为 AI 搜索：输入"治愈系雨夜动漫壁纸"，AI 自动理解关键词推荐

### 数据结构

**壁纸数据**:
```typescript
interface Wallpaper {
  id: string;
  title: string;
  imageUrl: string;        // 原图 URL
  thumbnailUrl: string;    // 缩略图 URL
  category: Category;
  tags: string[];          // AI 自动标签：夜晚、女孩、城市、雨天、霓虹灯
  views: number;           // 热度
  source: string;          // 来源：Wallhaven、Unsplash 等
  width: number;
  height: number;
  createdAt: string;
}

type Category = 'hot' | 'latest' | 'anime' | 'landscape' | 'healing' | 'cyberpunk' | 'minimal' | 'space' | 'abstract';
```

**收藏数据** (localStorage):
```typescript
interface Favorite {
  wallpaper_id: string;
  added_at: string;
}
```

## 未来 AI 功能扩展

1. **AI 搜索**：用户输入"蓝紫色赛博朋克雨夜壁纸"，AI 自动理解关键词
2. **AI 自动标签**：AI 自动识别——夜晚、女孩、城市、雨天、霓虹灯
3. **AI 推荐系统**：根据点击行为自动推荐
4. **AI 二创壁纸**：原图 → AI 风格化 → 生成新壁纸

## 是否有原型设计

是（设计引导已开启，原型已完成，需要根据用户构思调整视觉风格）

## 实施步骤

### 阶段一：原型设计（已完成，需调整）
1. ~~加载 `design-canvas` 技能，确认壁纸网站的视觉设计方案~~ 
   - 当前原型为画廊风（暖灰白背景），需要调整为深色模式风格
   - 更新 Design Token：主色改为黑色/深灰/蓝灰/暗紫，添加毛玻璃效果

### 阶段二：代码开发
2. **基础设施搭建** — 创建壁纸数据类型定义、mock 数据、API 路由结构
   - `src/types/wallpaper.ts`
   - `src/lib/wallpaper-data.ts`
   - `src/app/api/wallpapers/route.ts`

3. **首页开发** — 实现毛玻璃导航栏、AI搜索框、分类标签栏、瀑布流布局
   - `src/app/page.tsx`
   - `src/components/navbar.tsx`
   - `src/components/ai-search.tsx`
   - `src/components/wallpaper-grid.tsx`
   - `src/components/category-tabs.tsx`

4. **壁纸卡片与交互** — 实现壁纸卡片组件、Hover动效、收藏/下载交互
   - `src/components/wallpaper-card.tsx`
   - `src/hooks/use-favorites.ts`

5. **详情页开发** — 实现壁纸大图预览页、相似推荐
   - `src/app/wallpaper/[id]/page.tsx`

6. **收藏页面开发** — 实现收藏列表页
   - `src/app/favorites/page.tsx`

7. **深色模式支持** — 实现主题切换
   - `src/components/theme-toggle.tsx`

8. **执行代码检查与验证** — 静态检查 + API 接口测试

## 页面规格

### 全局导航

##### @nav(web-topbar)
> type: topbar
> platform: web

- @page(/) 发现壁纸
- @page(/favorites) 我的收藏

### 页面详情

##### @page(/) 首页

**核心职责**：展示壁纸分类与壁纸列表，支持筛选浏览，AI搜索入口。
**访问路径**：顶部导航直达。
**布局**：毛玻璃顶栏 → AI搜索框（居中大圆角）→ 分类标签栏 → 壁纸瀑布流 → 加载更多。
**列表项字段**：缩略图 / 标签 / 收藏按钮 / 下载按钮

**交互说明**

| 元素 | 动作 | 响应 | 传参 | 备注 |
|------|------|------|------|------|
| 搜索框 | 输入+回车 | 触发搜索 | keyword | — |
| 分类标签 | 点击 | 切换分类，刷新壁纸列表 | category | — |
| 壁纸卡片 | 点击 | 跳转 @page(/wallpaper)?id | id | — |
| 收藏按钮 | 点击 | 添加/移除收藏，更新收藏状态 | — | localStorage 持久化 |
| 下载按钮 | 点击 | 触发图片下载 | — | — |
| 深色模式按钮 | 点击 | 切换明暗主题 | — | — |
| 加载更多按钮 | 点击 | 加载下一页壁纸 | — | — |

##### @page(/wallpaper) 壁纸详情

**核心职责**：展示壁纸大图，提供下载、收藏等操作，相似推荐。
**访问路径**：从首页壁纸卡片点击进入。
**布局**：大图区域（全屏）→ 信息面板 → 操作按钮区 → 相似推荐。

**交互说明**

| 元素 | 动作 | 响应 | 传参 | 备注 |
|------|------|------|------|------|
| 返回按钮 | 点击 | 返回上一页 | — | — |
| 下载按钮 | 点击 | 下载原图 | — | — |
| 收藏按钮 | 点击 | 添加/移除收藏 | — | — |
| 相似推荐卡片 | 点击 | 跳转 @page(/wallpaper)?id | id | — |

##### @page(/favorites) 我的收藏

**核心职责**：展示用户收藏的壁纸列表。
**访问路径**：顶部导航直达。
**布局**：标题 → 收藏壁纸网格（空态提示）。
**列表项字段**：缩略图 / 名称 / 移除收藏按钮 / 下载按钮

**状态**：
- 空态：显示"暂无收藏，去首页逛逛吧"提示

**交互说明**

| 元素 | 动作 | 响应 | 传参 | 备注 |
|------|------|------|------|------|
| 壁纸卡片 | 点击 | 跳转 @page(/wallpaper)?id | id | — |
| 移除按钮 | 点击 | 从收藏列表移除 | — | — |
| 下载按钮 | 点击 | 触发图片下载 | — | — |
