'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFavorites } from '@/hooks/use-favorites';
import {
  wallpapers,
  categories,
  getPopularWallpapers,
  getLatestWallpapers,
  searchWallpapers,
} from '@/lib/wallpaper-data';
import { downloadImage } from '@/lib/download';
import type { WallpaperCategory } from '@/types/wallpaper';
import Sidebar from '@/components/Sidebar';

// Footer 组件
function Footer() {
  return (
    <footer className="border-t border-border/20 bg-background/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground text-sm">
            壁紙畫廊 · AI精选高质量壁纸
          </p>
          <p className="text-muted-foreground/60 text-xs">
            © 2026 壁紙畫廊 All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// 导航栏组件（移除深色模式按钮）
function Navbar({
  favoriteCount,
  onSearchClick,
}: {
  favoriteCount: number;
  onSearchClick: () => void;
}) {
  return (
    <header className="hidden md:flex sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/20 transition-all duration-300">
      <div className="flex-1 h-16 flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">壁纸画廊</span>
        </Link>

        {/* 右侧操作 */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onSearchClick}
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Link href="/favorites">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Heart className="w-5 h-5 text-muted-foreground" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">
                  {favoriteCount > 9 ? '9+' : favoriteCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

// AI 搜索框组件
function AISearchBar({
  searchQuery,
  onSearchChange,
  searchRef,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={searchRef} className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          发现你的下一张壁纸
        </h1>
        <p className="text-lg text-muted-foreground">
          AI精选高质量壁纸 · 每日更新
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        </div>
        <Input
          type="text"
          placeholder="搜索你想要的壁纸..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-14 pl-14 pr-6 text-lg rounded-2xl bg-card border-border shadow-card focus:shadow-float transition-shadow"
        />
      </div>
    </div>
  );
}

// 分类标签栏组件
function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: WallpaperCategory;
  onCategoryChange: (category: WallpaperCategory) => void;
}) {
  return (
    <div className="sticky top-16 md:top-16 z-20 bg-background/80 backdrop-blur-md border-b border-border/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={`rounded-full px-4 whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 壁纸卡片组件
function WallpaperCard({
  wallpaper,
  isFavorite,
  onToggleFavorite,
}: {
  wallpaper: (typeof wallpapers)[0];
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await downloadImage(wallpaper.imageUrl, `${wallpaper.title}.jpg`, wallpaper);
  };

  return (
    <Link
      href={`/wallpaper/${wallpaper.id}`}
      className="masonry-item block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-xl bg-muted shadow-card group-hover:shadow-float transition-all duration-300">
        {/* 图片 - 使用 img 标签让图片按原始比例自然撑开，实现真正的瀑布流 */}
        <img
          src={wallpaper.thumbnailUrl}
          alt={wallpaper.title}
          className={`w-full h-auto object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />

        {/* Hover 遮罩 */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-medium text-sm mb-2 truncate">
              {wallpaper.title}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={isFavorite ? 'default' : 'secondary'}
                className={`rounded-full px-3 ${
                  isFavorite
                    ? 'bg-destructive text-white hover:bg-destructive/90'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite();
                }}
              >
                <Heart
                  className={`w-4 h-4 mr-1 ${isFavorite ? 'fill-current' : ''}`}
                />
                {isFavorite ? '已收藏' : '收藏'}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full px-3 bg-white/20 text-white hover:bg-white/30"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-1" />
                下载
              </Button>
            </div>
          </div>
        </div>

        {/* 收藏标记 */}
        {isFavorite && !isHovered && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-destructive flex items-center justify-center shadow-lg">
            <Heart className="w-4 h-4 text-white fill-current" />
          </div>
        )}
      </div>
    </Link>
  );
}

// 瀑布流网格组件
function WallpaperGrid({
  wallpapers: wallpapersList,
  favorites,
  onToggleFavorite,
}: {
  wallpapers: typeof wallpapers;
  favorites: Record<string, boolean>;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <div className="masonry-grid max-w-7xl mx-auto px-6">
      {wallpapersList.map((wallpaper) => (
        <WallpaperCard
          key={wallpaper.id}
          wallpaper={wallpaper}
          isFavorite={!!favorites[wallpaper.id]}
          onToggleFavorite={() => onToggleFavorite(wallpaper.id)}
        />
      ))}
    </div>
  );
}

// 主页面
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<WallpaperCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const { favorites, toggleFavorite, favoriteCount } = useFavorites();

  // 滚动到搜索框
  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // 根据分类和搜索过滤壁纸
  const filteredWallpapers = useMemo(() => {
    // 先根据搜索词筛选
    let result = searchQuery.trim()
      ? searchWallpapers(searchQuery)
      : wallpapers;

    // 再根据分类筛选（热门和最新需要特殊处理）
    if (activeCategory === 'popular') {
      result = searchQuery.trim()
        ? getPopularWallpapers().filter((w) =>
            result.some((r) => r.id === w.id)
          )
        : getPopularWallpapers();
    } else if (activeCategory === 'latest') {
      result = searchQuery.trim()
        ? getLatestWallpapers().filter((w) =>
            result.some((r) => r.id === w.id)
          )
        : getLatestWallpapers();
    } else if (activeCategory !== 'all') {
      result = result.filter((w) => w.category === activeCategory);
    }

    return result;
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar searchInputRef={searchRef} />
      
      {/* 移动端顶部导航 */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background/90 backdrop-blur-md border-b border-border z-30 flex items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">壁纸画廊</span>
        </Link>
      </header>

      <main className="flex-1 md:ml-16 pt-16 md:pt-0">
        <Navbar favoriteCount={favoriteCount} onSearchClick={scrollToSearch} />
        <div className="flex-1">
          <AISearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchRef={searchRef}
          />
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <div className="py-8 pb-20 md:pb-8">
            <WallpaperGrid
              wallpapers={filteredWallpapers}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
            {/* 已展示全部提示 */}
            <div className="text-center py-12 text-muted-foreground text-sm">
              已展示全部 {filteredWallpapers.length} 张壁纸
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
