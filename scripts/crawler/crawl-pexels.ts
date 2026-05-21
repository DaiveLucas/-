/**
 * 壁纸数据采集爬虫（简化版）
 * 从 Pexels 采集壁纸数据并存储到 Supabase
 */

import { createClient } from '@supabase/supabase-js';

// 配置
const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// 分类列表
const CATEGORIES = ['风景', '建筑', '动物', '人物', '简约', '抽象', '科技', '美食', '旅行', '艺术'];

// 标签列表
const TAG_POOL = ['自然风景', '山川', '海洋', '日落', '城市', '建筑', '极简', '抽象艺术', '动漫', '人物', '动物', '科技', '宇宙', '森林', '花艺', '美食', '旅行', '复古', '黑白', '水彩', '街头', '夜景', '沙漠', '雪景', '秋天'];

// 工具函数：随机选择
function randomPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 从 Pexels 获取壁纸
async function fetchPexels(page: number = 1, perPage: number = 30): Promise<any[]> {
  console.log(`📷 Fetching Pexels (page ${page})...`);
  
  const response = await fetch(`https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`, {
    headers: { 'Authorization': PEXELS_API_KEY }
  });
  
  const data = await response.json();
  
  return data.photos.map((photo: any, index: number) => {
    const width = photo.width;
    const height = photo.height;
    let ratio: string;
    let resWidth: number;
    let resHeight: number;
    
    if (width > height * 1.2) {
      ratio = 'landscape'; // 横向
      resWidth = 1920;
      resHeight = Math.round(1920 * height / width);
    } else if (height > width * 1.2) {
      ratio = 'portrait'; // 竖向
      resHeight = 1920;
      resWidth = Math.round(1920 * width / height);
    } else {
      ratio = 'square'; // 正方形
      resWidth = 1920;
      resHeight = 1920;
    }
    
    return {
      id: `pexels-${photo.id}`,
      title: photo.alt || `Beautiful Wallpaper ${photo.id}`,
      source: 'pexels',
      source_id: String(photo.id),
      width: resWidth,
      height: resHeight,
      ratio: ratio,
      category: CATEGORIES[index % CATEGORIES.length],
      tags: randomPick(TAG_POOL, 4),
      downloads: 0,
      views: 0,
      likes: 0,
      thumbnail_url: photo.src.tiny,
      medium_url: photo.src.medium,
      image_url: photo.src.large,
      color: photo.avg_color || '#ffffff',
      photographer: photo.photographer || 'Unknown',
      photographer_url: photo.photographer_url || '',
      created_at: new Date().toISOString(),
    };
  });
}

// 保存壁纸数据到数据库
async function saveWallpapers(wallpapers: any[]): Promise<number> {
  const { error } = await supabase
    .from('wallpapers')
    .upsert(wallpapers, { onConflict: 'id' });
  
  if (error) {
    console.error('Failed to save wallpapers:', error.message);
    return 0;
  }
  return wallpapers.length;
}

// 主函数
async function main() {
  console.log('🚀 Starting wallpaper crawler...\n');
  
  const allWallpapers: any[] = [];
  
  try {
    // 从 Pexels 获取 5 页数据
    for (let page = 1; page <= 5; page++) {
      const wallpapers = await fetchPexels(page, 30);
      allWallpapers.push(...wallpapers);
    }
    
    console.log(`\n📊 Total wallpapers fetched: ${allWallpapers.length}`);
    
  } catch (err) {
    console.error('Error fetching wallpapers:', err);
    return;
  }
  
  // 保存到数据库
  console.log('\n💾 Saving to database...');
  
  const saved = await saveWallpapers(allWallpapers);
  
  console.log(`\n🎉 Done! Saved ${saved} wallpapers to Supabase.`);
}

main().catch(console.error);
