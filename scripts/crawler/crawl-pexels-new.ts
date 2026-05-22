/**
 * 壁纸数据采集爬虫（新分类版）
 * 从 Pexels 采集壁纸数据并存储到 Supabase
 * 使用新的20个分类体系
 */

import { createClient } from '@supabase/supabase-js';

// 配置
const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// 新分类配置（分类ID + Pexels搜索关键词）
const CATEGORY_CONFIG: Record<string, { keywords: string[]; label: string }> = {
  nature: { keywords: ['nature', 'outdoors'], label: '自然' },
  mountain: { keywords: ['mountain', 'peak'], label: '山川' },
  ocean: { keywords: ['ocean', 'sea', 'beach'], label: '海洋' },
  forest: { keywords: ['forest', 'trees'], label: '森林' },
  sunset: { keywords: ['sunset', 'sunrise'], label: '日落' },
  cozy: { keywords: ['cozy', 'warm', 'hygge'], label: '治愈' },
  cottage: { keywords: ['cottage', 'cabin'], label: '小屋' },
  galaxy: { keywords: ['galaxy', 'milky way'], label: '星河' },
  nebula: { keywords: ['nebula', 'space art'], label: '星云' },
  abstract: { keywords: ['abstract'], label: '抽象' },
  gradient: { keywords: ['gradient', 'colorful'], label: '渐变' },
  cyberpunk: { keywords: ['cyberpunk', 'neon'], label: '赛博朋克' },
  scifi: { keywords: ['sci-fi', 'futuristic'], label: '科幻' },
  minimal: { keywords: ['minimal', 'simple'], label: '极简' },
  anime: { keywords: ['anime', 'illustration'], label: '动漫' },
  city: { keywords: ['city', 'urban', 'skyline'], label: '城市' },
  dark: { keywords: ['dark', 'moody'], label: '暗黑' },
  flower: { keywords: ['flower', 'botanical'], label: '花卉' },
  animal: { keywords: ['animal', 'wildlife'], label: '动物' },
  sky: { keywords: ['sky', 'clouds'], label: '天空' },
};

// 每个分类采集的数量
const PER_CATEGORY = 50;

// 延迟函数（避免 API 限流）
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 从 Pexels 搜索壁纸
async function searchPexels(query: string, perPage: number = 30, page: number = 1): Promise<any[]> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
  
  const response = await fetch(url, {
    headers: { 'Authorization': PEXELS_API_KEY }
  });
  
  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.photos || [];
}

// 转换图片数据
function transformPhoto(photo: any, category: string, keywords: string[]): any {
  const width = photo.width;
  const height = photo.height;
  let ratio: string;
  let resWidth: number;
  let resHeight: number;
  
  if (width > height * 1.2) {
    ratio = 'landscape';
    resWidth = 1920;
    resHeight = Math.round(1920 * height / width);
  } else if (height > width * 1.2) {
    ratio = 'portrait';
    resHeight = 1920;
    resWidth = Math.round(1920 * width / height);
  } else {
    ratio = 'square';
    resWidth = 1920;
    resHeight = 1920;
  }
  
  return {
    id: `pexels-${photo.id}`,
    title: photo.alt || photo.photographer || `Wallpaper ${photo.id}`,
    source: 'Pexels',
    source_id: String(photo.id),
    width: resWidth,
    height: resHeight,
    ratio: ratio,
    category: category,
    tags: keywords, // 使用搜索关键词作为标签
    downloads: Math.floor(Math.random() * 20000) + 1000,
    views: Math.floor(Math.random() * 50000) + 5000,
    thumbnail_url: photo.src.tiny,
    medium_url: photo.src.medium,
    image_url: photo.src.large2x || photo.src.large,
    created_at: new Date().toISOString(),
  };
}

// 保存壁纸数据到数据库
async function saveWallpapers(wallpapers: any[]): Promise<number> {
  if (wallpapers.length === 0) return 0;
  
  // 去重
  const uniqueMap = new Map<string, any>();
  wallpapers.forEach(w => uniqueMap.set(w.id, w));
  const unique = Array.from(uniqueMap.values());
  
  // 分批保存（每批50条）
  const batchSize = 50;
  let saved = 0;
  
  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize);
    const { error } = await supabase
      .from('wallpapers')
      .upsert(batch, { onConflict: 'id' });
    
    if (error) {
      console.error(`   Failed to save batch: ${error.message}`);
    } else {
      saved += batch.length;
    }
  }
  
  return saved;
}

// 清空数据库中的旧数据
async function clearWallpapers() {
  console.log('🗑️  Clearing existing wallpapers...');
  
  const { error } = await supabase
    .from('wallpapers')
    .delete()
    .neq('id', 'dummy'); // 删除所有数据
  
  if (error) {
    console.error('Failed to clear wallpapers:', error.message);
    return false;
  }
  
  console.log('✅ Database cleared!\n');
  return true;
}

// 主函数
async function main() {
  console.log('🚀 Starting wallpaper crawler with new categories...\n');
  console.log(`📊 Categories: ${Object.keys(CATEGORY_CONFIG).length}`);
  console.log(`📊 Target per category: ${PER_CATEGORY}`);
  console.log(`📊 Total target: ${Object.keys(CATEGORY_CONFIG).length * PER_CATEGORY}\n`);
  
  // 1. 清空旧数据
  const cleared = await clearWallpapers();
  if (!cleared) {
    console.log('⚠️  Continuing without clearing...');
  }
  
  const allWallpapers: any[] = [];
  const categories = Object.keys(CATEGORY_CONFIG);
  
  // 2. 遍历每个分类采集
  for (const category of categories) {
    const config = CATEGORY_CONFIG[category];
    console.log(`\n📁 Processing: ${config.label} (${category})`);
    console.log(`   Keywords: ${config.keywords.join(', ')}`);
    
    const categoryWallpapers: any[] = [];
    
    // 使用第一个关键词进行搜索
    const primaryKeyword = config.keywords[0];
    const secondaryKeyword = config.keywords[1];
    
    try {
      // 搜索第一页
      let photos = await searchPexels(primaryKeyword, 30, 1);
      console.log(`   Found ${photos.length} photos with "${primaryKeyword}" (page 1)`);
      
      // 如果不够，搜索第二页或使用第二关键词
      if (photos.length < PER_CATEGORY && secondaryKeyword) {
        await delay(1000); // 避免限流
        const morePhotos = await searchPexels(secondaryKeyword, 30, 1);
        console.log(`   Found ${morePhotos.length} photos with "${secondaryKeyword}"`);
        photos = [...photos, ...morePhotos];
      }
      
      // 如果还不够，搜索第三页
      if (photos.length < PER_CATEGORY) {
        await delay(1000);
        const page2 = await searchPexels(primaryKeyword, 30, 2);
        console.log(`   Found ${page2.length} photos with "${primaryKeyword}" (page 2)`);
        photos = [...photos, ...page2];
      }
      
      // 转换数据
      const transformed = photos
        .slice(0, PER_CATEGORY)
        .map(photo => transformPhoto(photo, category, config.keywords));
      
      categoryWallpapers.push(...transformed);
      
      console.log(`   ✅ Collected ${categoryWallpapers.length} wallpapers`);
      
      allWallpapers.push(...categoryWallpapers);
      
      // 保存当前分类（避免一次性保存太多）
      if (categoryWallpapers.length > 0) {
        await saveWallpapers(categoryWallpapers);
      }
      
      // 延迟避免 API 限流
      await delay(1500);
      
    } catch (err) {
      console.error(`   ❌ Error: ${err}`);
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 Total wallpapers collected: ${allWallpapers.length}`);
  console.log(`🎉 Done! All wallpapers saved to Supabase.`);
  console.log(`${'='.repeat(50)}`);
  
  // 3. 验证数据库中的数据
  const { count } = await supabase
    .from('wallpapers')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n📈 Database now has ${count} wallpapers.`);
  
  // 4. 显示各分类统计
  console.log('\n📊 Category breakdown:');
  for (const category of categories) {
    const { count: catCount } = await supabase
      .from('wallpapers')
      .select('*', { count: 'exact', head: true })
      .eq('category', category);
    console.log(`   ${CATEGORY_CONFIG[category].label} (${category}): ${catCount}`);
  }
}

main().catch(console.error);
