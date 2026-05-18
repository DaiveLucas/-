// 壁纸分类
export type WallpaperCategory =
  | 'all'
  | 'popular'
  | 'latest'
  | 'anime'
  | 'landscape'
  | 'healing'
  | 'cyberpunk'
  | 'minimalist'
  | 'space'
  | 'abstract';

// 分类配置
export interface CategoryConfig {
  id: WallpaperCategory;
  label: string;
  icon?: string;
}

// 壁纸数据
export interface Wallpaper {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  mediumUrl?: string; // 中等尺寸（宽800），用于详情页首屏
  category: WallpaperCategory;
  tags: string[];
  resolution: {
    width: number;
    height: number;
  };
  source?: string;
  views?: number;
  downloads?: number;
  createdAt: string;
}

// 收藏状态
export interface FavoriteState {
  [id: string]: boolean;
}
