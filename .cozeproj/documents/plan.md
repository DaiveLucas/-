# 壁纸网站开发计划

## 概述

开发一个壁纸网站，支持多分类浏览、收藏、下载等核心功能。用户已提供原型参考（Coze 平台上的 HTML 原型），本次开发将严格还原该原型的视觉设计与交互体验。

**平台**: web  
**集成能力**: 
- 对象存储（壁纸图片存储）
- 图片生成（如需 AI 生成壁纸功能）

## 技术方案

| 维度 | 选择 | 理由 |
|------|------|------|
| 框架 | Next.js 16 (App Router) | 已初始化，支持 SSR/ISR 优化图片加载 |
| UI 组件 | shadcn/ui | 已预装，快速构建一致性 UI |
| 样式 | Tailwind CSS 4 | 原型使用 Tailwind，直接迁移 class |
| 图片存储 | 对象存储 (S3) | 壁纸需要持久化存储和 CDN 加速 |
| 状态管理 | React useState + localStorage | 收藏列表本地持久化，无需复杂状态库 |

## 功能模块

### 1. 首页模块
- **职责**: 壁纸展示与分类筛选
- **要点**: 
  - 顶部 Hero 区域：标题 + 副标题
  - 分类标签栏：全部、自然风景、动漫、赛博朋克、极简、治愈系、太空、抽象
  - 壁纸瀑布流/网格展示
  - 卡片交互：悬停显示收藏/下载按钮

### 2. 壁纸详情模块
- **职责**: 单张壁纸大图预览与操作
- **要点**:
  - 大图展示
  - 壁纸信息（名称、分类、分辨率）
  - 收藏、下载、设为壁纸按钮
  - 相关推荐

### 3. 收藏模块
- **职责**: 管理用户收藏的壁纸
- **要点**:
  - 收藏列表展示
  - 批量下载
  - 取消收藏

### 4. 分类页面模块
- **职责**: 按分类浏览壁纸
- **要点**:
  - 继承首页布局
  - 路由参数控制分类筛选

### 数据结构

**壁纸数据**:
```typescript
interface Wallpaper {
  id: string;
  name: string;
  category: Category;
  image_url: string;        // 原图 URL（对象存储）
  thumbnail_url: string;    // 缩略图 URL
  width: number;
  height: number;
  downloads: number;
  created_at: string;
}

type Category = 'all' | 'nature' | 'anime' | 'cyberpunk' | 'minimal' | 'healing' | 'space' | 'abstract';
```

**收藏数据** (localStorage):
```typescript
interface Favorite {
  wallpaper_id: string;
  added_at: string;
}
```

## 是否有原型设计

是（设计引导已开启，用户已提供原型参考 URL）

## 实施步骤

### 阶段一：原型设计
1. 加载 `design-canvas` 技能，基于用户提供的原型参考，确认壁纸网站的视觉设计方案（页面布局、配色、组件样式）。原型完成后提示用户确认，确认后进入开发阶段。

### 阶段二：代码开发
2. **基础设施搭建** — 创建壁纸数据类型定义、mock 数据、API 路由结构
   - `src/types/wallpaper.ts`
   - `src/lib/wallpaper-data.ts`
   - `src/app/api/wallpapers/route.ts`

3. **首页开发** — 实现 Hero 区域、分类标签栏、壁纸网格展示
   - `src/app/page.tsx`
   - `src/components/wallpaper-grid.tsx`
   - `src/components/category-tabs.tsx`

4. **壁纸卡片与交互** — 实现壁纸卡片组件、收藏/下载交互
   - `src/components/wallpaper-card.tsx`
   - `src/hooks/use-favorites.ts`

5. **详情页开发** — 实现壁纸大图预览页
   - `src/app/wallpaper/[id]/page.tsx`

6. **收藏页面开发** — 实现收藏列表页
   - `src/app/favorites/page.tsx`

7. **执行代码检查与验证** — 静态检查 + API 接口测试

## 页面规格

### 全局导航

##### @nav(web-topbar)
> type: topbar
> platform: web

- @page(/) 首页
- @page(/favorites) 我的收藏

### 页面详情

##### @page(/) 首页

**核心职责**：展示壁纸分类与壁纸列表，支持筛选浏览。
**访问路径**：顶部导航直达。
**布局**：Hero 区域（标题+副标题）→ 分类标签栏 → 壁纸网格。
**列表项字段**：缩略图 / 名称 / 收藏按钮 / 下载按钮

**交互说明**

| 元素 | 动作 | 响应 | 传参 | 备注 |
|------|------|------|------|------|
| 分类标签 | 点击 | 切换分类，刷新壁纸列表 | category | — |
| 壁纸卡片 | 点击 | 跳转 @page(/wallpaper)?id | id | — |
| 收藏按钮 | 点击 | 添加/移除收藏，更新收藏状态 | — | localStorage 持久化 |
| 下载按钮 | 点击 | 触发图片下载 | — | — |

##### @page(/wallpaper) 壁纸详情

**核心职责**：展示壁纸大图，提供下载、收藏等操作。
**访问路径**：从首页壁纸卡片点击进入。
**布局**：大图区域 → 操作按钮区 → 壁纸信息 → 相关推荐。

**交互说明**

| 元素 | 动作 | 响应 | 传参 | 备注 |
|------|------|------|------|------|
| 返回按钮 | 点击 | 返回上一页 | — | — |
| 下载按钮 | 点击 | 下载原图 | — | — |
| 收藏按钮 | 点击 | 添加/移除收藏 | — | — |

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
