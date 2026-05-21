// 壁纸分类
export type WallpaperCategory =
  | 'all'
  | 'popular'
  | 'latest'
  | 'nature'
  | 'anime'
  | 'abstract'
  | 'scifi'
  | 'minimal';

// 分类配置
export interface CategoryConfig {
  id: WallpaperCategory;
  label: string;
  icon?: string;
}

// 数据库中的原始分类（用于数据存储）
export type DatabaseCategory = 'anime' | 'landscape' | 'healing' | 'cyberpunk' | 'minimalist' | 'space' | 'abstract';

// 壁纸数据
export interface Wallpaper {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  mediumUrl?: string; // 中等尺寸（宽800），用于详情页首屏
  category: DatabaseCategory; // 使用数据库分类
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
