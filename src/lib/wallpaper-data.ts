import type { Wallpaper, CategoryConfig, WallpaperCategory, DatabaseCategory } from '@/types/wallpaper';

// 导出 mapWallpaper 函数供其他模块使用
export function mapWallpaper(w: Record<string, unknown>): Wallpaper {
  const { width, height, image_url, thumbnail_url, medium_url, source_id, created_at, ...rest } = w;
  return {
    ...rest,
    imageUrl: image_url as string,
    thumbnailUrl: thumbnail_url as string,
    mediumUrl: medium_url as string | undefined,
    sourceId: source_id as string | undefined,
    createdAt: created_at as string,
    resolution: { width: width as number, height: height as number },
  } as unknown as Wallpaper;
}

// 导出 shuffleArray 函数供其他模块使用
export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 分类配置（15个分类）
export const categories: CategoryConfig[] = [
  { id: 'all', label: '全部' },
  { id: 'nature', label: '自然' },
  { id: 'mountain', label: '山川' },
  { id: 'ocean', label: '海洋' },
  { id: 'forest', label: '森林' },
  { id: 'sunset', label: '日落' },
  { id: 'cozy', label: '治愈' },
  { id: 'cottage', label: '小屋' },
  { id: 'galaxy', label: '星河' },
  { id: 'abstract', label: '抽象' },
  { id: 'scifi', label: '科幻' },
  { id: 'anime', label: '动漫' },
  { id: 'city', label: '城市' },
  { id: 'flower', label: '花卉' },
  { id: 'animal', label: '动物' },
  { id: 'sky', label: '天空' },
];

// Mock 壁纸数据（三级尺寸：thumbnail 200px, medium 800px, original 1920px）
export const wallpapers: Wallpaper[] = [
  {
    id: '1',
    title: '雪山日出',
    imageUrl: 'https://picsum.photos/id/15/1920/1280',
    thumbnailUrl: 'https://picsum.photos/id/15/200/133', // 缩略图
    mediumUrl: 'https://picsum.photos/id/15/800/533', // 中等尺寸
    category: 'mountain',
    tags: ['mountain', 'peak', 'sunrise'],
    resolution: { width: 1920, height: 1280 },
    source: 'Picsum',
    views: 12580,
    downloads: 3420,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: '动漫风格',
    imageUrl: 'https://picsum.photos/id/65/1920/2400',
    thumbnailUrl: 'https://picsum.photos/id/65/200/250',
    mediumUrl: 'https://picsum.photos/id/65/800/1000',
    category: 'anime',
    tags: ['anime', 'illustration'],
    resolution: { width: 1920, height: 2400 },
    source: 'Picsum',
    views: 8920,
    downloads: 2100,
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    title: '霓虹城市',
    imageUrl: 'https://picsum.photos/id/32/1920/2880',
    thumbnailUrl: 'https://picsum.photos/id/32/200/300',
    mediumUrl: 'https://picsum.photos/id/32/800/1200',
    category: 'city',
    tags: ['city', 'urban', 'skyline'],
    resolution: { width: 1920, height: 2880 },
    source: 'Picsum',
    views: 15600,
    downloads: 4800,
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    title: '极简建筑',
    imageUrl: 'https://picsum.photos/id/57/1920/1920',
    thumbnailUrl: 'https://picsum.photos/id/57/200/200',
    mediumUrl: 'https://picsum.photos/id/57/800/800',
    category: 'scifi',
    tags: ['sci-fi', 'futuristic'],
    resolution: { width: 1920, height: 1920 },
    source: 'Picsum',
    views: 6500,
    downloads: 1800,
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    title: '治愈森林',
    imageUrl: 'https://picsum.photos/id/16/1920/2560',
    thumbnailUrl: 'https://picsum.photos/id/16/200/267',
    mediumUrl: 'https://picsum.photos/id/16/800/1067',
    category: 'cozy',
    tags: ['cozy', 'warm', 'hygge'],
    resolution: { width: 1920, height: 2560 },
    source: 'Picsum',
    views: 11200,
    downloads: 3200,
    createdAt: '2024-01-11',
  },
  {
    id: '6',
    title: '璀璨星空',
    imageUrl: 'https://picsum.photos/id/26/1920/1120',
    thumbnailUrl: 'https://picsum.photos/id/26/200/117',
    mediumUrl: 'https://picsum.photos/id/26/800/467',
    category: 'galaxy',
    tags: ['galaxy', 'milky way'],
    resolution: { width: 1920, height: 1120 },
    source: 'Picsum',
    views: 18900,
    downloads: 5600,
    createdAt: '2024-01-10',
  },
  {
    id: '7',
    title: '抽象艺术',
    imageUrl: 'https://picsum.photos/id/49/1920/2720',
    thumbnailUrl: 'https://picsum.photos/id/49/200/283',
    mediumUrl: 'https://picsum.photos/id/49/800/1133',
    category: 'abstract',
    tags: ['abstract'],
    resolution: { width: 1920, height: 2720 },
    source: 'Picsum',
    views: 7800,
    downloads: 2200,
    createdAt: '2024-01-09',
  },
  {
    id: '8',
    title: '海浪沙滩',
    imageUrl: 'https://picsum.photos/id/10/1920/1600',
    thumbnailUrl: 'https://picsum.photos/id/10/200/167',
    mediumUrl: 'https://picsum.photos/id/10/800/667',
    category: 'ocean',
    tags: ['ocean', 'sea', 'beach'],
    resolution: { width: 1920, height: 1600 },
    source: 'Picsum',
    views: 9500,
    downloads: 2700,
    createdAt: '2024-01-08',
  },
  {
    id: '9',
    title: '银河星云',
    imageUrl: 'https://picsum.photos/id/27/1920/2240',
    thumbnailUrl: 'https://picsum.photos/id/27/200/233',
    mediumUrl: 'https://picsum.photos/id/27/800/933',
    category: 'galaxy',
    tags: ['galaxy', 'milky way'],
    resolution: { width: 1920, height: 2240 },
    source: 'Picsum',
    views: 22100,
    downloads: 6800,
    createdAt: '2024-01-07',
  },
  {
    id: '10',
    title: '城市夜景',
    imageUrl: 'https://picsum.photos/id/37/1920/1216',
    thumbnailUrl: 'https://picsum.photos/id/37/200/127',
    mediumUrl: 'https://picsum.photos/id/37/800/507',
    category: 'city',
    tags: ['city', 'urban', 'skyline'],
    resolution: { width: 1920, height: 1216 },
    source: 'Picsum',
    views: 13400,
    downloads: 4100,
    createdAt: '2024-01-06',
  },
  {
    id: '11',
    title: '梦幻花海',
    imageUrl: 'https://picsum.photos/id/23/1920/3040',
    thumbnailUrl: 'https://picsum.photos/id/23/200/317',
    mediumUrl: 'https://picsum.photos/id/23/800/1267',
    category: 'flower',
    tags: ['flower', 'botanical'],
    resolution: { width: 1920, height: 3040 },
    source: 'Picsum',
    views: 10800,
    downloads: 2900,
    createdAt: '2024-01-05',
  },
  {
    id: '12',
    title: '极简线条',
    imageUrl: 'https://picsum.photos/id/28/1920/1760',
    thumbnailUrl: 'https://picsum.photos/id/28/200/183',
    mediumUrl: 'https://picsum.photos/id/28/800/733',
    category: 'scifi',
    tags: ['sci-fi', 'futuristic'],
    resolution: { width: 1920, height: 1760 },
    source: 'Picsum',
    views: 5200,
    downloads: 1500,
    createdAt: '2024-01-04',
  },
  {
    id: '13',
    title: '山川湖泊',
    imageUrl: 'https://picsum.photos/id/14/1920/1024',
    thumbnailUrl: 'https://picsum.photos/id/14/200/107',
    mediumUrl: 'https://picsum.photos/id/14/800/427',
    category: 'nature',
    tags: ['nature', 'outdoors'],
    resolution: { width: 1920, height: 1024 },
    source: 'Picsum',
    views: 14200,
    downloads: 3900,
    createdAt: '2024-01-03',
  },
  {
    id: '14',
    title: '动漫风景',
    imageUrl: 'https://picsum.photos/id/48/1920/2304',
    thumbnailUrl: 'https://picsum.photos/id/48/200/240',
    mediumUrl: 'https://picsum.photos/id/48/800/960',
    category: 'anime',
    tags: ['anime', 'illustration'],
    resolution: { width: 1920, height: 2304 },
    source: 'Picsum',
    views: 7600,
    downloads: 2100,
    createdAt: '2024-01-02',
  },
  {
    id: '15',
    title: '抽象光影',
    imageUrl: 'https://picsum.photos/id/43/1920/2080',
    thumbnailUrl: 'https://picsum.photos/id/43/200/217',
    mediumUrl: 'https://picsum.photos/id/43/800/867',
    category: 'abstract',
    tags: ['abstract'],
    resolution: { width: 1920, height: 2080 },
    source: 'Picsum',
    views: 6800,
    downloads: 1900,
    createdAt: '2024-01-01',
  },
  {
    id: '16',
    title: '未来城市',
    imageUrl: 'https://picsum.photos/id/42/1920/3200',
    thumbnailUrl: 'https://picsum.photos/id/42/200/333',
    mediumUrl: 'https://picsum.photos/id/42/800/1333',
    category: 'scifi',
    tags: ['sci-fi', 'futuristic'],
    resolution: { width: 1920, height: 3200 },
    source: 'Picsum',
    views: 16800,
    downloads: 5200,
    createdAt: '2023-12-31',
  },
];

// ==================== 壁纸缓存（用于无限滚动动态生成的壁纸） ====================
const wallpaperCache = new Map<string, Wallpaper>();

// 根据 ID 获取壁纸（先查静态数组，再查缓存）
export function getWallpaperById(id: string): Wallpaper | undefined {
  // 先从静态数组查找
  const staticWallpaper = wallpapers.find((w) => w.id === id);
  if (staticWallpaper) return staticWallpaper;
  
  // 再从缓存查找
  return wallpaperCache.get(id);
}

// 将壁纸添加到缓存
export function addWallpaperToCache(wallpaper: Wallpaper): void {
  wallpaperCache.set(wallpaper.id, wallpaper);
}

// 批量添加壁纸到缓存
export function addWallpapersToCache(wallpaperList: Wallpaper[]): void {
  wallpaperList.forEach((w) => wallpaperCache.set(w.id, w));
}

// 获取所有壁纸（静态 + 缓存），用于随机壁纸功能
export function getAllWallpapers(): Wallpaper[] {
  return [...wallpapers, ...Array.from(wallpaperCache.values())];
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
export function searchWallpapers(query: string, allWallpapers?: Wallpaper[]): Wallpaper[] {
  const targetList = allWallpapers || wallpapers;
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return targetList;
  
  return targetList.filter((w) => {
    const titleMatch = w.title.toLowerCase().includes(lowerQuery);
    const tagMatch = w.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
    return titleMatch || tagMatch;
  });
}

// 按标签获取壁纸（支持缓存）
export function getWallpapersByTag(tag: string): Wallpaper[] {
  const allList = [...wallpapers, ...Array.from(wallpaperCache.values())];
  return allList.filter((w) => w.tags.includes(tag));
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

// 图片比例配置（三级尺寸：thumb 200px, medium 800px, full 1920px）
const ratioConfigs = [
  { thumbWidth: 200, thumbHeight: 107, medWidth: 800, medHeight: 427, fullWidth: 1920, fullHeight: 1024, label: '超宽横图' },
  { thumbWidth: 200, thumbHeight: 133, medWidth: 800, medHeight: 533, fullWidth: 1920, fullHeight: 1280, label: '标准横图' },
  { thumbWidth: 200, thumbHeight: 200, medWidth: 800, medHeight: 800, fullWidth: 1920, fullHeight: 1920, label: '正方形' },
  { thumbWidth: 200, thumbHeight: 250, medWidth: 800, medHeight: 1000, fullWidth: 1920, fullHeight: 2400, label: '竖向图' },
  { thumbWidth: 200, thumbHeight: 300, medWidth: 800, medHeight: 1200, fullWidth: 1920, fullHeight: 2880, label: '长竖图' },
  { thumbWidth: 200, thumbHeight: 333, medWidth: 800, medHeight: 1333, fullWidth: 1920, fullHeight: 3200, label: '极长竖图' },
];

// 分类列表（用于随机分配）
const categoryPool: DatabaseCategory[] = ['nature', 'mountain', 'ocean', 'forest', 'sunset', 'cozy', 'cottage', 'galaxy', 'abstract', 'scifi', 'anime', 'city', 'flower', 'animal', 'sky'];

// 标签池（按分类，使用Pexels搜索关键词）
const tagsPool: Record<DatabaseCategory, string[]> = {
  nature: ['nature', 'outdoors'],
  mountain: ['mountain', 'peak'],
  ocean: ['ocean', 'sea', 'beach'],
  forest: ['forest', 'trees'],
  sunset: ['sunset', 'sunrise'],
  cozy: ['cozy', 'warm', 'hygge'],
  cottage: ['cottage', 'cabin'],
  galaxy: ['galaxy', 'milky way'],
  abstract: ['abstract'],
  scifi: ['sci-fi', 'futuristic'],
  anime: ['anime', 'illustration'],
  city: ['city', 'urban', 'skyline'],
  flower: ['flower', 'botanical'],
  animal: ['animal', 'wildlife'],
  sky: ['sky', 'clouds'],
};

// 壁纸标题模板
const titleTemplates = [
  '静谧时光', '晨曦微光', '暮色温柔', '星河璀璨', '云端漫步',
  '光影交织', '梦幻之境', '远方呼唤', '心灵归宿', '自然低语',
  '城市脉动', '霓虹闪烁', '星空物语', '森林秘境', '海浪轻语',
  '山间云海', '落日余晖', '极光之夜', '银河倾泻', '月球背面',
];

// 生成随机壁纸数据（imageUrl 和 thumbnailUrl 比例一致）
export function generateWallpaperPage(page: number): Wallpaper[] {
  const startId = page * 16 + 1;
  const result: Wallpaper[] = [];
  
  for (let i = 0; i < 16; i++) {
    const id = startId + i;
    // 使用不同的 picsum ID，确保图片不同
    const picsumId = (id * 7) % 1000 + 1;
    
    // 随机选择比例配置
    const ratio = ratioConfigs[Math.floor(Math.random() * ratioConfigs.length)];
    
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
    
    const wallpaper: Wallpaper = {
      id: `page${page}-${i + 1}`,
      title: `${title} #${id}`,
      imageUrl: `https://picsum.photos/id/${picsumId}/${ratio.fullWidth}/${ratio.fullHeight}`,
      thumbnailUrl: `https://picsum.photos/id/${picsumId}/${ratio.thumbWidth}/${ratio.thumbHeight}`,
      mediumUrl: `https://picsum.photos/id/${picsumId}/${ratio.medWidth}/${ratio.medHeight}`,
      category,
      tags,
      resolution: { width: ratio.fullWidth, height: ratio.fullHeight },
      source: 'Picsum',
      views,
      downloads,
      createdAt,
    };
    
    result.push(wallpaper);
    // 同时添加到缓存，确保可以通过 ID 查找到
    wallpaperCache.set(wallpaper.id, wallpaper);
  }
  
  return result;
}
