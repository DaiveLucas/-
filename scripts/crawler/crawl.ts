/**
 * 壁纸数据采集爬虫
 * 从 Unsplash、Pexels、Wallhaven 采集壁纸数据并存储到 Supabase
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';
import { createWriteStream, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// 配置
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;
const WALLHAVEN_API_KEY = process.env.WALLHAVEN_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// 临时目录
const TEMP_DIR = '/tmp/wallpaper-crawler';
if (!existsSync(TEMP_DIR)) {
  mkdirSync(TEMP_DIR, { recursive: true });
}

// 分类映射
const CATEGORY_MAP: Record<string, string> = {
  'nature': '风景',
  'landscape': '风景',
  'travel': '风景',
  'architecture': '建筑',
  'interiors': '建筑',
  'animals': '动物',
  'wildlife': '动物',
  'people': '人物',
  'portrait': '人物',
  'anime': '动漫',
  'anime-manga': '动漫',
  'technology': '科技',
  'minimalist': '简约',
  'minimalism': '简约',
  'abstract': '抽象',
  'art': '艺术',
  'food': '美食',
  'cars': '汽车',
  'vehicles': '汽车',
};

// 标签列表
const TAG_POOL = ['自然风景', '山川', '海洋', '日落', '城市', '建筑', '极简', '抽象艺术', '动漫', '人物', '动物', '科技', '宇宙', '森林', '花艺', '美食', '旅行', '复古', '黑白', '水彩'];

// 工具函数：HTTP 请求
function fetchJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const lib = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'WallpaperGallery/1.0',
        ...headers
      }
    };

    lib.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${data.substring(0, 100)}`));
        }
      });
    }).on('error', reject);
  });
}

// 工具函数：下载文件
function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const lib = urlObj.protocol === 'https:' ? https : http;
    
    const file = createWriteStream(filepath);
    lib.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      unlinkSync(filepath);
      reject(err);
    });
  });
}

// 工具函数：随机选择
function randomPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 工具函数：生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// 从 Unsplash 获取壁纸
async function fetchUnsplash(page: number = 1, perPage: number = 30): Promise<any[]> {
  console.log(`📷 Fetching Unsplash (page ${page})...`);
  
  const url = `https://api.unsplash.com/photos?order_by=popular&page=${page}&per_page=${perPage}`;
  const data = await fetchJson<any[]>(url, { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` });
  
  return data.map(photo => ({
    id: `unsplash-${photo.id}`,
    title: photo.description || photo.alt_description || 'Beautiful Wallpaper',
    source: 'unsplash',
    source_id: photo.id,
    width: photo.width,
    height: photo.height,
    ratio: photo.width > photo.height ? 'landscape' : (photo.width < photo.height ? 'portrait' : 'square'),
    category: CATEGORY_MAP[photo.categories?.[0]?.slug || ''] || CATEGORY_MAP[photo.topic_submissions?.['nature']?.slug || ''] || '风景',
    tags: randomPick(TAG_POOL, 3),
    downloads: 0,
    views: 0,
    likes: photo.likes,
    thumbnail_url: photo.urls.thumb,
    medium_url: photo.urls.small,
    image_url: photo.urls.full,
    color: photo.color || '#ffffff',
    photographer: photo.user?.name || 'Unknown',
    photographer_url: photo.user?.links?.html || '',
    created_at: new Date().toISOString(),
  }));
}

// 从 Pexels 获取壁纸
async function fetchPexels(page: number = 1, perPage: number = 30): Promise<any[]> {
  console.log(`📷 Fetching Pexels (page ${page})...`);
  
  const url = `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`;
  const data = await fetchJson<{ photos: any[] }>(url, { 'Authorization': PEXELS_API_KEY });
  
  return data.photos.map(photo => ({
    id: `pexels-${photo.id}`,
    title: photo.alt || 'Beautiful Wallpaper',
    source: 'pexels',
    source_id: String(photo.id),
    width: photo.width,
    height: photo.height,
    ratio: photo.width > photo.height ? 'landscape' : (photo.width < photo.height ? 'portrait' : 'square'),
    category: CATEGORY_MAP[Math.random() > 0.5 ? 'nature' : 'minimalist'] || '风景',
    tags: randomPick(TAG_POOL, 3),
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
  }));
}

// 从 Wallhaven 获取壁纸
async function fetchWallhaven(page: number = 1): Promise<any[]> {
  console.log(`📷 Fetching Wallhaven (page ${page})...`);
  
  const url = `https://wallhaven.cc/api/v1/search?sorting=popular&page=${page}&apikey=${WALLHAVEN_API_KEY}`;
  const data = await fetchJson<{ data: any[] }>(url);
  
  return data.data.map(wallpaper => ({
    id: `wallhaven-${wallpaper.id}`,
    title: 'Beautiful Wallpaper',
    source: 'wallhaven',
    source_id: wallpaper.id,
    width: wallpaper.dimension_x,
    height: wallpaper.dimension_y,
    ratio: wallpaper.dimension_x > wallpaper.dimension_y ? 'landscape' : (wallpaper.dimension_x < wallpaper.dimension_y ? 'portrait' : 'square'),
    category: CATEGORY_MAP[wallpaper.category] || '风景',
    tags: wallpaper.tags?.map((t: any) => t.name) || randomPick(TAG_POOL, 3),
    downloads: 0,
    views: 0,
    likes: 0,
    thumbnail_url: wallpaper.thumbs.small,
    medium_url: wallpaper.thumbs.large,
    image_url: wallpaper.path,
    color: wallpaper.colors?.[0] || '#ffffff',
    photographer: 'Unknown',
    photographer_url: '',
    created_at: new Date().toISOString(),
  }));
}

// 上传图片到 Supabase Storage
async function uploadToStorage(url: string, filename: string): Promise<string | null> {
  try {
    const localPath = join(TEMP_DIR, filename);
    await downloadFile(url, localPath);
    
    const { data, error } = await supabase.storage
      .from('wallpapers')
      .upload(filename, localPath, { upsert: true });
    
    if (error) {
      console.error(`Failed to upload ${filename}:`, error.message);
      return null;
    }
    
    // 清理本地文件
    unlinkSync(localPath);
    
    // 获取公开URL
    const { data: urlData } = supabase.storage.from('wallpapers').getPublicUrl(filename);
    return urlData.publicUrl;
  } catch (err) {
    console.error(`Error uploading ${filename}:`, err);
    return null;
  }
}

// 保存壁纸数据到数据库
async function saveWallpaper(wallpaper: any): Promise<boolean> {
  const { error } = await supabase
    .from('wallpapers')
    .upsert(wallpaper, { onConflict: 'id' });
  
  if (error) {
    console.error(`Failed to save ${wallpaper.id}:`, error.message);
    return false;
  }
  return true;
}

// 主函数
async function main() {
  console.log('🚀 Starting wallpaper crawler...\n');
  
  const allWallpapers: any[] = [];
  
  try {
    // 从三个网站获取壁纸
    const [unsplash, pexels, wallhaven] = await Promise.all([
      Promise.all([1, 2, 3].map(p => fetchUnsplash(p, 20))).then(arr => arr.flat()),
      Promise.all([1, 2, 3].map(p => fetchPexels(p, 20))).then(arr => arr.flat()),
      Promise.all([1, 2, 3].map(p => fetchWallhaven(p))).then(arr => arr.flat()),
    ]);
    
    allWallpapers.push(...unsplash, ...pexels, ...wallhaven);
    console.log(`\n📊 Total wallpapers fetched: ${allWallpapers.length}`);
    
  } catch (err) {
    console.error('Error fetching wallpapers:', err);
  }
  
  // 保存到数据库
  console.log('\n💾 Saving to database...');
  let saved = 0;
  
  for (const wallpaper of allWallpapers) {
    const success = await saveWallpaper(wallpaper);
    if (success) {
      saved++;
      process.stdout.write(`\r✅ Saved ${saved}/${allWallpapers.length}`);
    }
  }
  
  console.log(`\n\n🎉 Done! Saved ${saved} wallpapers to Supabase.`);
  
  // 清理临时目录
  try {
    if (existsSync(TEMP_DIR)) {
      const files = require('fs').readdirSync(TEMP_DIR);
      files.forEach((f: string) => unlinkSync(join(TEMP_DIR, f)));
    }
  } catch (e) {
    // ignore
  }
}

main().catch(console.error);
