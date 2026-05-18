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
export const wallpapers: Wallpaper[] = [
  {
    id: '1',
    title: '雪山日出',
    imageUrl: 'https://picsum.photos/id/15/1920/1280',
    thumbnailUrl: 'https://picsum.photos/id/15/600/400',
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
    thumbnailUrl: 'https://picsum.photos/id/65/600/338',
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
    thumbnailUrl: 'https://picsum.photos/id/32/600/400',
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
    thumbnailUrl: 'https://picsum.photos/id/57/600/338',
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
    thumbnailUrl: 'https://picsum.photos/id/16/600/400',
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
    thumbnailUrl: 'https://picsum.photos/id/26/600/400',
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
    thumbnailUrl: 'https://picsum.photos/id/49/600/338',
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
    thumbnailUrl: 'https://picsum.photos/id/10/600/400',
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
    thumbnailUrl: 'https://picsum.photos/id/27/600/400',
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
    thumbnailUrl: 'https://picsum.photos/id/37/600/400',
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
    thumbnailUrl: 'https://picsum.photos/id/23/600/338',
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
    thumbnailUrl: 'https://picsum.photos/id/28/600/338',
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
    thumbnailUrl: 'https://picsum.photos/id/14/600/400',
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
    thumbnailUrl: 'https://picsum.photos/id/48/600/338',
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
    thumbnailUrl: 'https://picsum.photos/id/43/600/338',
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
    thumbnailUrl: 'https://picsum.photos/id/42/600/400',
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
