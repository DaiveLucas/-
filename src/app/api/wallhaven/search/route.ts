import { NextResponse } from 'next/server';

// Wallhaven API 配置
const WALLHAVEN_API_KEY = 'gPO0YUhv7FN2jPea6CdRyz7fIhqXVEbp';
const WALLHAVEN_SEARCH_URL = 'https://wallhaven.cc/api/v1/search';

interface WallhavenWallpaper {
  id: string;
  url: string;
  short_url: string;
  uploader: {
    username: string;
    group: string;
  };
  views: number;
  favorites: number;
  source: string;
  purity: string;
  category: string;
  dimension_x: number;
  dimension_y: number;
  resolution: string;
  ratio: string;
  created_at: string;
  path: string;
  thumbs: {
    large: string;
    original: string;
    small: string;
  };
  colors: string[];
  tags: Array<{
    id: number;
    name: string;
    alias: string;
    category_id: number;
    category: string;
  }>;
}

interface WallhavenResponse {
  data: WallhavenWallpaper[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    query: string;
  };
}

// 分类映射：Wallhaven 分类到我们的分类
function mapWallhavenCategory(wallhavenCategory: string, tags: Array<{ id: number; name: string; alias: string; category_id: number; category: string }>): string {
  const tagNames = tags.map(t => t.name.toLowerCase());
  
  // 根据标签判断分类
  if (tagNames.some(t => ['anime', 'anime girl', 'anime boy', 'manga'].includes(t))) {
    return 'anime';
  }
  if (tagNames.some(t => ['landscape', 'nature', 'mountains', 'sky', 'forest', 'sunset', 'sunrise', 'ocean', 'sea', 'lake'].includes(t))) {
    return 'landscape';
  }
  if (tagNames.some(t => ['cyberpunk', 'neon', 'futuristic', 'sci-fi', 'sci fi'].includes(t))) {
    return 'cyberpunk';
  }
  if (tagNames.some(t => ['space', 'galaxy', 'stars', 'universe', 'nebula', 'planet'].includes(t))) {
    return 'space';
  }
  if (tagNames.some(t => ['minimalism', 'minimal', 'minimalist', 'simple', 'clean'].includes(t))) {
    return 'minimalist';
  }
  if (tagNames.some(t => ['abstract', 'abstract art', 'geometric', 'gradient', 'colorful'].includes(t))) {
    return 'abstract';
  }
  if (tagNames.some(t => ['cute', 'kawaii', 'healing', 'cozy', 'calm'].includes(t))) {
    return 'healing';
  }
  
  // 根据 Wallhaven 分类
  if (wallhavenCategory === 'anime') return 'anime';
  if (wallhavenCategory === 'general') return 'landscape';
  
  return 'abstract'; // 默认分类
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');

  if (!query.trim()) {
    return NextResponse.json({ wallpapers: [], total: 0, hasMore: false });
  }

  try {
    const params = new URLSearchParams({
      apikey: WALLHAVEN_API_KEY,
      q: query,
      categories: '111',     // 通用+动漫+人物
      purity: '100',         // SFW
      sorting: 'relevance',
      per_page: '24',
      page: page.toString()
    });

    const response = await fetch(`${WALLHAVEN_SEARCH_URL}?${params}`, {
      headers: {
        'User-Agent': 'WallpaperGallery/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Wallhaven API error: ${response.status}`);
    }

    const data: WallhavenResponse = await response.json();

    // 转换为我们的格式
    const wallpapers = data.data.map(w => ({
      id: `wallhaven-${w.id}`,
      title: `Wallhaven ${w.id}`,
      imageUrl: w.path,
      thumbnailUrl: w.thumbs.small,
      mediumUrl: w.thumbs.large,
      category: mapWallhavenCategory(w.category, w.tags),
      tags: w.tags.slice(0, 5).map(t => t.name),
      resolution: {
        width: w.dimension_x,
        height: w.dimension_y
      },
      source: 'Wallhaven',
      views: w.views,
      downloads: w.favorites,
      createdAt: w.created_at
    }));

    return NextResponse.json({
      wallpapers,
      total: data.meta.total,
      page: data.meta.current_page,
      hasMore: data.meta.current_page < data.meta.last_page
    });
  } catch (error) {
    console.error('Wallhaven search error:', error);
    return NextResponse.json({ 
      wallpapers: [], 
      total: 0, 
      hasMore: false,
      error: 'Wallhaven search failed' 
    }, { status: 500 });
  }
}
