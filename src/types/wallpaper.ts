// 壁纸分类（前端展示分类）
export type WallpaperCategory =
  | 'all'
  | 'nature'
  | 'mountain'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'cozy'
  | 'cottage'
  | 'galaxy'
  | 'nebula'
  | 'abstract'
  | 'gradient'
  | 'cyberpunk'
  | 'scifi'
  | 'minimal'
  | 'anime'
  | 'city'
  | 'dark'
  | 'flower'
  | 'animal'
  | 'sky';

// 分类配置
export interface CategoryConfig {
  id: WallpaperCategory;
  label: string;
  icon?: string;
}

// 数据库中的原始分类（直接使用英文分类ID，与前端分类一致）
export type DatabaseCategory = 
  | 'nature'
  | 'mountain'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'cozy'
  | 'cottage'
  | 'galaxy'
  | 'nebula'
  | 'abstract'
  | 'gradient'
  | 'cyberpunk'
  | 'scifi'
  | 'minimal'
  | 'anime'
  | 'city'
  | 'dark'
  | 'flower'
  | 'animal'
  | 'sky';

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
