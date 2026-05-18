import type { Wallpaper, CategoryConfig, WallpaperCategory } from '@/types/wallpaper';

// 分类配置
export const categories: CategoryConfig[] = [
  { id: 'all', label: '全部' },
  { id: 'popular', label: '热门' },
  { id: 'latest', label: '最新' },
  { id: 'anime', label: '动漫' },
  { id: 'landscape', label: '风景' },
  { id: 'healing', label: '治愈系' },
  { id: 'cyberpunk', label: '赛博朋克' },
  { id: 'minimalist', label: '极简' },
  { id: 'space', label: '太空' },
  { id: 'abstract', label: '抽象' },
];

// Mock 壁纸数据（使用 picsum.photos 稳定图片服务）
// 注意：thumbnailUrl 使用不同高度比例，实现真正的瀑布流效果
export const wallpapers: Wallpaper[] = [
  {
    id: '1',
    title: '雪山日出',
    imageUrl: 'https://picsum.photos/id/15/1920/1280',
    thumbnailUrl: 'https://picsum.photos/id/15/600/400', // 3:2 横向
    category: 'landscape',
    tags: ['自然风景', '山川', '日出'],
    resolution: { width: 1920, height: 1280 },
    source: 'Picsum',
    views: 12580,
    downloads: 3420,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: '动漫风格',
    imageUrl: 'https://picsum.photos/id/65/1920/1080',
    thumbnailUrl: 'https://picsum.photos/id/65/600/750', // 4:5 竖向
    category: 'anime',
    tags: ['动漫', '唯美', '梦幻'],
    resolution: { width: 1920, height: 1080 },
    source: 'Picsum',
    views: 8920,
    downloads: 2100,
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    title: '霓虹城市',
    imageUrl: 'https://picsum.photos/id/32/1920/1280',
    thumbnailUrl: 'https://picsum.photos/id/32/600/900', // 2:3 竖向
    category: 'cyberpunk',
    tags: ['赛博朋克', '霓虹', '城市'],
    resolution: { width: 1920, height: 1280 },
    source: 'Picsum',
    views: 15600,
    downloads: 4800,
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    title: '极简建筑',
    imageUrl: 'https://picsum.photos/id/57/1920/1080',
    thumbnailUrl: 'https://picsum.photos/id/57/600/600', // 1:1 正方形
    category: 'minimalist',
    tags: ['极简', '建筑', '纯净'],
    resolution: { width: 1920, height: 1080 },
    source: 'Picsum',
    views: 6500,
    downloads: 1800,
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    title: '治愈森林',
    imageUrl: 'https://picsum.photos/id/16/1920/1280',
    thumbnailUrl: 'https://picsum.photos/id/16/600/800', // 3:4 竖向
    category: 'healing',
    tags: ['治愈系', '森林', '自然'],
    resolution: { width: 1920, height: 1280 },
    source: 'Picsum',
    views: 11200,
    downloads: 3200,
    createdAt: '2024-01-11',
  },
  {
    id: '6',
    title: '璀璨星空',
    imageUrl: 'https://picsum.photos/id/26/1920/1280',
    thumbnailUrl: 'https://picsum.photos/id/26/600/350', // 宽幅横向
    category: 'space',
    tags: ['太空', '星空', '宇宙'],
    resolution: { width: 1920, height: 1280 },
    source: 'Picsum',
    views: 18900,
    downloads: 5600,
    createdAt: '2024-01-10',
  },
  {
    id: '7',
    title: '抽象艺术',
    imageUrl: 'https://picsum.photos/id/49/1920/1080',
    thumbnailUrl: 'https://picsum.photos/id/49/600/850', // 竖向长图
    category: 'abstract',
    tags: ['抽象', '艺术', '色彩'],
    resolution: { width: 1920, height: 1080 },
    source: 'Picsum',
    views: 7800,
    downloads: 2200,
    createdAt: '2024-01-09',
  },
  {
    id: '8',
    title: '海浪沙滩',
    imageUrl: 'https://picsum.photos/id/10/1920/1280',
    thumbnailUrl: 'https://picsum.photos/id/10/600/500', // 6:5 接近正方形
    category: 'landscape',
    tags: ['自然风景', '大海', '沙滩'],
    resolution: { width: 1920, height: 1280 },
    source: 'Picsum',
    views: 9500,
    downloads: 2700,
    createdAt: '2024-01-08',
  },
  {
    id: '9',
    title: '银河星云',
    imageUrl: 'https://picsum.photos/id/27/1920/1280',
    thumbnailUrl: 'https://picsum.photos/id/27/600/700', // 接近正方形偏竖
    category: 'space',
    tags: ['太空', '银河', '星云'],
    resolution: { width: 1920, height: 1280 },
    source: 'Picsum',
    views: 22100,
    downloads: 6800,
    createdAt: '2024-01-07',
  },
  {
    id: '10',
    title: '城市夜景',
    imageUrl: 'https://picsum.photos/id/37/1920/1280',
    thumbnailUrl: 'https://picsum.photos/id/37/600/380', // 宽幅
    category: 'cyberpunk',
    tags: ['赛博朋克', '城市', '夜景'],
    resolution: { width: 1920, height: 1280 },
    source: 'Picsum',
    views: 13400,
    downloads: 4100,
    createdAt: '2024-01-06',
  },
  {
    id: '11',
    title: '梦幻花海',
    imageUrl: 'https://picsum.photos/id/23/1920/1080',
    thumbnailUrl: 'https://picsum.photos/id/23/600/950', // 长竖图
    category: 'healing',
    tags: ['治愈系', '花海', '梦幻'],
    resolution: { width: 1920, height: 1080 },
    source: 'Picsum',
    views: 10800,
    downloads: 2900,
    createdAt: '2024-01-05',
  },
  {
    id: '12',
    title: '极简线条',
    imageUrl: 'https://picsum.photos/id/28/1920/1080',
    thumbnailUrl: 'https://picsum.photos/id/28/600/550', // 接近正方形
    category: 'minimalist',
    tags: ['极简', '线条', '几何'],
    resolution: { width: 1920, height: 1080 },
    source: 'Picsum',
    views: 5200,
    downloads: 1500,
    createdAt: '2024-01-04',
  },
  {
    id: '13',
    title: '山川湖泊',
    imageUrl: 'https://picsum.photos/id/14/1920/1280',
    thumbnailUrl: 'https://picsum.photos/id/14/600/320', // 超宽幅
    category: 'landscape',
    tags: ['自然风景', '山川', '湖泊'],
    resolution: { width: 1920, height: 1280 },
    source: 'Picsum',
    views: 14200,
    downloads: 3900,
    createdAt: '2024-01-03',
  },
  {
    id: '14',
    title: '动漫风景',
    imageUrl: 'https://picsum.photos/id/48/1920/1080',
    thumbnailUrl: 'https://picsum.photos/id/48/600/720', // 竖向
    category: 'anime',
    tags: ['动漫', '风景', '唯美'],
    resolution: { width: 1920, height: 1080 },
    source: 'Picsum',
    views: 7600,
    downloads: 2100,
    createdAt: '2024-01-02',
  },
  {
    id: '15',
    title: '抽象光影',
    imageUrl: 'https://picsum.photos/id/43/1920/1080',
    thumbnailUrl: 'https://picsum.photos/id/43/600/650', // 接近正方形
    category: 'abstract',
    tags: ['抽象', '光影', '艺术'],
    resolution: { width: 1920, height: 1080 },
    source: 'Picsum',
    views: 6800,
    downloads: 1900,
    createdAt: '2024-01-01',
  },
  {
    id: '16',
    title: '未来城市',
    imageUrl: 'https://picsum.photos/id/42/1920/1280',
    thumbnailUrl: 'https://picsum.photos/id/42/600/1000', // 长竖图
    category: 'cyberpunk',
    tags: ['赛博朋克', '未来', '城市'],
    resolution: { width: 1920, height: 1280 },
    source: 'Picsum',
    views: 16800,
    downloads: 5200,
    createdAt: '2023-12-31',
  },
];

// 根据 ID 获取壁纸
export function getWallpaperById(id: string): Wallpaper | undefined {
  return wallpapers.find((w) => w.id === id);
}

// 根据分类筛选壁纸
export function getWallpapersByCategory(category: string): Wallpaper[] {
  if (category === 'all') return wallpapers;
  return wallpapers.filter((w) => w.category === category);
}

// 获取热门壁纸（按下载量排序）
export function getPopularWallpapers(): Wallpaper[] {
  return [...wallpapers].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
}

// 获取最新壁纸（按 id 倒序，id 越大越新）
export function getLatestWallpapers(): Wallpaper[] {
  return [...wallpapers].sort((a, b) => parseInt(b.id) - parseInt(a.id));
}

// 搜索壁纸（匹配标题和标签，不区分大小写）
export function searchWallpapers(query: string): Wallpaper[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return wallpapers;
  
  return wallpapers.filter((w) => {
    const titleMatch = w.title.toLowerCase().includes(lowerQuery);
    const tagMatch = w.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
    return titleMatch || tagMatch;
  });
}

// 获取相似壁纸（同分类，排除自身）
export function getSimilarWallpapers(wallpaper: Wallpaper, limit: number = 6): Wallpaper[] {
  return wallpapers
    .filter((w) => w.category === wallpaper.category && w.id !== wallpaper.id)
    .slice(0, limit);
}

// 格式化分辨率
export function formatResolution(resolution: { width: number; height: number }): string {
  return `${resolution.width} × ${resolution.height}`;
}

// 格式化数字（如浏览量）
export function formatNumber(num: number | undefined): string {
  if (num === undefined) return '0';
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  }
  return num.toLocaleString();
}

// ==================== 无限滚动分页生成 ====================

// 图片高度比例配置（实现差异化瀑布流）
const heightRatios = [
  { width: 600, height: 320, label: '超宽横图' },   // 16:9 宽幅
  { width: 600, height: 380, label: '宽幅横图' },   // 宽幅
  { width: 600, height: 450, label: '标准横图' },   // 4:3 标准
  { width: 600, height: 600, label: '正方形' },     // 1:1 正方形
  { width: 600, height: 720, label: '竖向图' },     // 5:6 竖向
  { width: 600, height: 800, label: '长竖图' },     // 3:4 竖向
  { width: 600, height: 900, label: '超长竖图' },   // 2:3 竖向
  { width: 600, height: 1000, label: '极长竖图' },  // 超长
];

// 分类列表（用于随机分配）
const categoryPool: WallpaperCategory[] = ['anime', 'landscape', 'healing', 'cyberpunk', 'minimalist', 'space', 'abstract'];

// 标签池（按分类）
const tagsPool: Record<WallpaperCategory, string[]> = {
  all: ['全部', '精选', '推荐', '热门'],
  popular: ['热门', '受欢迎', '高下载', '精选'],
  latest: ['最新', '新上线', '近期', '新鲜'],
  anime: ['动漫', '唯美', '梦幻', '少女', '治愈', '二次元'],
  landscape: ['自然风景', '山川', '海洋', '森林', '日落', '湖泊'],
  healing: ['治愈系', '温馨', '舒适', '宁静', '柔和', '清新'],
  cyberpunk: ['赛博朋克', '霓虹', '未来', '城市', '科技', '科幻'],
  minimalist: ['极简', '简约', '纯净', '留白', '几何', '线条'],
  space: ['太空', '星空', '宇宙', '星云', '银河', '行星'],
  abstract: ['抽象', '艺术', '渐变', '色彩', '几何', '流体'],
};

// 壁纸标题模板
const titleTemplates = [
  '静谧时光', '晨曦微光', '暮色温柔', '星河璀璨', '云端漫步',
  '光影交织', '梦幻之境', '远方呼唤', '心灵归宿', '自然低语',
  '城市脉动', '霓虹闪烁', '星空物语', '森林秘境', '海浪轻语',
  '山间云海', '落日余晖', '极光之夜', '银河倾泻', '月球背面',
];

// 生成随机壁纸数据
export function generateWallpaperPage(page: number): Wallpaper[] {
  const startId = page * 16 + 1;
  const result: Wallpaper[] = [];
  
  for (let i = 0; i < 16; i++) {
    const id = startId + i;
    // 使用不同的 picsum ID，确保图片不同
    // picsum.photos 支持 ID 范围很大，我们用 id * 7 来增加多样性
    const picsumId = (id * 7) % 1000 + 1;
    
    // 随机选择高度比例
    const ratio = heightRatios[Math.floor(Math.random() * heightRatios.length)];
    
    // 随机选择分类
    const category = categoryPool[Math.floor(Math.random() * categoryPool.length)];
    
    // 随机选择 2-3 个标签
    const availableTags = tagsPool[category];
    const tagCount = 2 + Math.floor(Math.random() * 2);
    const tags = availableTags
      .sort(() => Math.random() - 0.5)
      .slice(0, tagCount);
    
    // 随机标题
    const title = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
    
    // 随机浏览量和下载量
    const views = Math.floor(Math.random() * 20000) + 1000;
    const downloads = Math.floor(Math.random() * 5000) + 500;
    
    // 生成日期（越新的页码日期越近）
    const daysAgo = Math.floor(Math.random() * 30) + (page * 2);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const createdAt = date.toISOString().split('T')[0];
    
    result.push({
      id: `page${page}-${i + 1}`,
      title: `${title} #${id}`,
      imageUrl: `https://picsum.photos/id/${picsumId}/1920/1280`,
      thumbnailUrl: `https://picsum.photos/id/${picsumId}/${ratio.width}/${ratio.height}`,
      category,
      tags,
      resolution: { width: 1920, height: 1280 },
      source: 'Picsum',
      views,
      downloads,
      createdAt,
    });
  }
  
  return result;
}
