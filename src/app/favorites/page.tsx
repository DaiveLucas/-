'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Moon, Sun, Heart, Download, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/use-favorites';
import { wallpapers, formatNumber } from '@/lib/wallpaper-data';

// 导航栏组件
function FavoritesNavbar({ favoriteCount }: { favoriteCount: number }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">壁纸画廊</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
            {isDark ? (
              <Sun className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">
                {favoriteCount > 9 ? '9+' : favoriteCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

// 收藏壁纸卡片
function FavoriteCard({
  wallpaper,
  onRemove,
  onDownload,
}: {
  wallpaper: (typeof wallpapers)[0];
  onRemove: () => void;
  onDownload: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/wallpaper/${wallpaper.id}`}
      className="masonry-item block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-xl bg-muted shadow-card group-hover:shadow-float transition-all duration-300">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={wallpaper.thumbnailUrl}
            alt={wallpaper.title}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* 收藏标记 */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-destructive flex items-center justify-center shadow-lg">
          <Heart className="w-4 h-4 text-white fill-current" />
        </div>

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
                variant="secondary"
                className="rounded-full px-3 bg-white/20 text-white hover:bg-white/30"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                移除
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full px-3 bg-white/20 text-white hover:bg-white/30"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDownload();
                }}
              >
                <Download className="w-4 h-4 mr-1" />
                下载
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// 空态组件
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Heart className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">暂无收藏</h2>
      <p className="text-muted-foreground mb-6">去首页逛逛，收藏你喜欢的壁纸吧</p>
      <Link href="/">
        <Button className="rounded-full px-6">
          去首页逛逛
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}

// 主页面
export default function FavoritesPage() {
  const { favorites, removeFavorite, getFavoriteIds, favoriteCount, isLoaded } = useFavorites();

  // 获取收藏的壁纸列表
  const favoriteWallpapers = useMemo(() => {
    return wallpapers.filter((w) => !!favorites[w.id]);
  }, [favorites]);

  // 批量下载
  const handleDownloadAll = () => {
    favoriteWallpapers.forEach((wallpaper, index) => {
      setTimeout(() => {
        window.open(wallpaper.imageUrl, '_blank');
      }, index * 300);
    });
  };

  // 等待加载
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FavoritesNavbar favoriteCount={favoriteCount} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 标题区 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">我的收藏</h1>
          <p className="text-muted-foreground">你收藏的精选壁纸</p>
        </div>

        {/* 空态 */}
        {favoriteWallpapers.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* 操作栏 */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                共 {favoriteCount} 张壁纸
              </p>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={handleDownloadAll}
              >
                <Download className="w-4 h-4 mr-2" />
                全部下载
              </Button>
            </div>

            {/* 瀑布流网格 */}
            <div className="masonry-grid">
              {favoriteWallpapers.map((wallpaper) => (
                <FavoriteCard
                  key={wallpaper.id}
                  wallpaper={wallpaper}
                  onRemove={() => removeFavorite(wallpaper.id)}
                  onDownload={() => window.open(wallpaper.imageUrl, '_blank')}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
