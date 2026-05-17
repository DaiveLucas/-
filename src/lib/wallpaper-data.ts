import type { Wallpaper, CategoryConfig, WallpaperCategory } from '@/types/wallpaper';

// 分类配置
export const categories: CategoryConfig[] = [
  { id: 'all', label: '全部' },
  { id: 'hot', label: '热门' },
  { id: 'latest', label: '最新' },
  { id: 'anime', label: '动漫' },
  { id: 'landscape', label: '风景' },
  { id: 'healing', label: '治愈系' },
  { id: 'cyberpunk', label: '赛博朋克' },
  { id: 'minimalist', label: '极简' },
  { id: 'space', label: '太空' },
  { id: 'abstract', label: '抽象' },
];

// Mock 壁纸数据（使用有效的 Unsplash 图片）
export const wallpapers: Wallpaper[] = [
  {
    id: '1',
    title: '雪山日出',
    imageUrl: 'https://images.unsplash.com/photo-1506905927280-38c5f5a29c19?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905927280-38c5f5a29c19?w=600&q=80',
    category: 'landscape',
    tags: ['自然风景', '山川', '日出'],
    resolution: { width: 1920, height: 1280 },
    source: 'Unsplash',
    views: 12580,
    downloads: 3420,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: '动漫少女',
    imageUrl: 'https://images.unsplash.com/photo-1578632761999-5cde4e881b76?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632761999-5cde4e881b76?w=600&q=80',
    category: 'anime',
    tags: ['动漫', '少女', '唯美'],
    resolution: { width: 1920, height: 1080 },
    source: 'Unsplash',
    views: 8920,
    downloads: 2100,
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    title: '赛博朋克霓虹',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-84c23c927b5d?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-84c23c927b5d?w=600&q=80',
    category: 'cyberpunk',
    tags: ['赛博朋克', '霓虹', '城市'],
    resolution: { width: 1920, height: 1280 },
    source: 'Unsplash',
    views: 15600,
    downloads: 4800,
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    title: '极简白色',
    imageUrl: 'https://images.unsplash.com/photo-1507003217077-2b2d1f4f4f4f?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003217077-2b2d1f4f4f4f?w=600&q=80',
    category: 'minimalist',
    tags: ['极简', '白色', '纯净'],
    resolution: { width: 1920, height: 1080 },
    source: 'Unsplash',
    views: 6500,
    downloads: 1800,
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    title: '治愈森林',
    imageUrl: 'https://images.unsplash.com/photo-1448375247152-0f7239c2d9be?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375247152-0f7239c2d9be?w=600&q=80',
    category: 'healing',
    tags: ['治愈系', '森林', '自然'],
    resolution: { width: 1920, height: 1280 },
    source: 'Unsplash',
    views: 11200,
    downloads: 3200,
    createdAt: '2024-01-11',
  },
  {
    id: '6',
    title: '太空星云',
    imageUrl: 'https://images.unsplash.com/photo-1462337235909-55e106e72053?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1462337235909-55e106e72053?w=600&q=80',
    category: 'space',
    tags: ['太空', '星云', '宇宙'],
    resolution: { width: 1920, height: 1280 },
    source: 'Unsplash',
    views: 18900,
    downloads: 5600,
    createdAt: '2024-01-10',
  },
  {
    id: '7',
    title: '抽象渐变',
    imageUrl: 'https://images.unsplash.com/photo-1557682254-379c2ac5a83e?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557682254-379c2ac5a83e?w=600&q=80',
    category: 'abstract',
    tags: ['抽象', '渐变', '色彩'],
    resolution: { width: 1920, height: 1080 },
    source: 'Unsplash',
    views: 7800,
    downloads: 2200,
    createdAt: '2024-01-09',
  },
  {
    id: '8',
    title: '海浪沙滩',
    imageUrl: 'https://images.unsplash.com/photo-1507525252163-9c8c1a0c0c0c?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525252163-9c8c1a0c0c0c?w=600&q=80',
    category: 'landscape',
    tags: ['自然风景', '大海', '沙滩'],
    resolution: { width: 1920, height: 1280 },
    source: 'Unsplash',
    views: 9500,
    downloads: 2700,
    createdAt: '2024-01-08',
  },
  {
    id: '9',
    title: '星空银河',
    imageUrl: 'https://images.unsplash.com/photo-1519681392205-6cb75de6de51?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519681392205-6cb75de6de51?w=600&q=80',
    category: 'space',
    tags: ['太空', '银河', '星空'],
    resolution: { width: 1920, height: 1280 },
    source: 'Unsplash',
    views: 22100,
    downloads: 6800,
    createdAt: '2024-01-07',
  },
  {
    id: '10',
    title: '城市夜景',
    imageUrl: 'https://images.unsplash.com/photo-1514567387027-3b06529b4dc9?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514567387027-3b06529b4dc9?w=600&q=80',
    category: 'cyberpunk',
    tags: ['赛博朋克', '城市', '夜景'],
    resolution: { width: 1920, height: 1280 },
    source: 'Unsplash',
    views: 13400,
    downloads: 4100,
    createdAt: '2024-01-06',
  },
  {
    id: '11',
    title: '动漫风景',
    imageUrl: 'https://images.unsplash.com/photo-1534447677527-1f9c9e0c0c0c?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677527-1f9c9e0c0c0c?w=600&q=80',
    category: 'anime',
    tags: ['动漫', '风景', '唯美'],
    resolution: { width: 1920, height: 1080 },
    source: 'Unsplash',
    views: 8700,
    downloads: 2400,
    createdAt: '2024-01-05',
  },
  {
    id: '12',
    title: '极光之夜',
    imageUrl: 'https://images.unsplash.com/photo-1531363017027-f9c8c1a0c0c0c?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531363017027-f9c8c1a0c0c0c?w=600&q=80',
    category: 'healing',
    tags: ['治愈系', '极光', '夜空'],
    resolution: { width: 1920, height: 1280 },
    source: 'Unsplash',
    views: 16800,
    downloads: 5200,
    createdAt: '2024-01-04',
  },
  {
    id: '13',
    title: '几何图形',
    imageUrl: 'https://images.unsplash.com/photo-1554049513-c1c1c1c1c1c1?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554049513-c1c1c1c1c1c1?w=600&q=80',
    category: 'abstract',
    tags: ['抽象', '几何', '图形'],
    resolution: { width: 1920, height: 1080 },
    source: 'Unsplash',
    views: 5600,
    downloads: 1500,
    createdAt: '2024-01-03',
  },
  {
    id: '14',
    title: '极简黑白',
    imageUrl: 'https://images.unsplash.com/photo-1544247077-1c1c1c1c1c1c?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544247077-1c1c1c1c1c1c?w=600&q=80',
    category: 'minimalist',
    tags: ['极简', '黑白', '经典'],
    resolution: { width: 1920, height: 1280 },
    source: 'Unsplash',
    views: 7200,
    downloads: 1900,
    createdAt: '2024-01-02',
  },
  {
    id: '15',
    title: '山间云海',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-9c8c1a0c0c0c?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-9c8c1a0c0c0c?w=600&q=80',
    category: 'landscape',
    tags: ['自然风景', '云海', '山川'],
    resolution: { width: 1920, height: 1280 },
    source: 'Unsplash',
    views: 14500,
    downloads: 4300,
    createdAt: '2024-01-01',
  },
  {
    id: '16',
    title: '水彩梦幻',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-be5c5c5c5c5c?w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-be5c5c5c5c5c?w=600&q=80',
    category: 'abstract',
    tags: ['抽象', '水彩', '梦幻'],
    resolution: { width: 1920, height: 1080 },
    source: 'Unsplash',
    views: 6800,
    downloads: 1700,
    createdAt: '2023-12-31',
  },
];

// 根据分类获取壁纸
export function getWallpapersByCategory(category: WallpaperCategory): Wallpaper[] {
  if (category === 'all') return wallpapers;
  if (category === 'hot') return [...wallpapers].sort((a, b) => (b.views || 0) - (a.views || 0));
  if (category === 'latest') return [...wallpapers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return wallpapers.filter(w => w.category === category);
}

// 根据 ID 获取壁纸
export function getWallpaperById(id: string): Wallpaper | undefined {
  return wallpapers.find(w => w.id === id);
}

// 获取相似壁纸（同分类）
export function getSimilarWallpapers(wallpaper: Wallpaper, limit = 6): Wallpaper[] {
  return wallpapers
    .filter(w => w.category === wallpaper.category && w.id !== wallpaper.id)
    .slice(0, limit);
}

// 格式化分辨率
export function formatResolution(resolution: { width: number; height: number }): string {
  return `${resolution.width} × ${resolution.height}`;
}

// 格式化数字
export function formatNumber(num: number): string {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}
