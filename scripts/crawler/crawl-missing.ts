/**
 * 补充缺失分类的壁纸数据
 */

import { createClient } from '@supabase/supabase-js';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// 需要补充的分类
const MISSING_CATEGORIES = ['ocean', 'sunset', 'nebula', 'abstract', 'city'];

const CATEGORY_CONFIG: Record<string, { keywords: string[]; label: string }> = {
  ocean: { keywords: ['ocean waves', 'beach'], label: '海洋' },
  sunset: { keywords: ['golden hour', 'dusk'], label: '日落' },
  nebula: { keywords: ['space nebula', 'stars galaxy'], label: '星云' },
  abstract: { keywords: ['abstract art', 'geometric'], label: '抽象' },
  city: { keywords: ['cityscape', 'metropolis'], label: '城市' },
};

const PER_CATEGORY = 50;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
    tags: keywords,
    downloads: Math.floor(Math.random() * 20000) + 1000,
    views: Math.floor(Math.random() * 50000) + 5000,
    thumbnail_url: photo.src.tiny,
    medium_url: photo.src.medium,
    image_url: photo.src.large2x || photo.src.large,
    created_at: new Date().toISOString(),
  };
}

async function saveWallpapers(wallpapers: any[]): Promise<number> {
  if (wallpapers.length === 0) return 0;
  
  const uniqueMap = new Map<string, any>();
  wallpapers.forEach(w => uniqueMap.set(w.id, w));
  const unique = Array.from(uniqueMap.values());
  
  let saved = 0;
  for (const w of unique) {
    const { error } = await supabase
      .from('wallpapers')
      .upsert(w, { onConflict: 'id' });
    
    if (!error) saved++;
  }
  
  return saved;
}

async function main() {
  console.log('🔄 Re-fetching missing categories...\n');
  
  for (const category of MISSING_CATEGORIES) {
    const config = CATEGORY_CONFIG[category];
    console.log(`\n📁 Processing: ${config.label} (${category})`);
    
    const allPhotos: any[] = [];
    
    for (const keyword of config.keywords) {
      try {
        const photos = await searchPexels(keyword, 30, 1);
        console.log(`   Found ${photos.length} with "${keyword}"`);
        allPhotos.push(...photos);
        await delay(1000);
      } catch (err) {
        console.error(`   Error: ${err}`);
      }
    }
    
    const transformed = allPhotos
      .slice(0, PER_CATEGORY)
      .map(p => transformPhoto(p, category, config.keywords));
    
    const saved = await saveWallpapers(transformed);
    console.log(`   ✅ Saved ${saved} wallpapers`);
    
    await delay(1500);
  }
  
  // 验证
  console.log('\n📊 Final count per category:');
  for (const cat of MISSING_CATEGORIES) {
    const { count } = await supabase
      .from('wallpapers')
      .select('*', { count: 'exact', head: true })
      .eq('category', cat);
    console.log(`   ${CATEGORY_CONFIG[cat].label} (${cat}): ${count}`);
  }
}

main().catch(console.error);
