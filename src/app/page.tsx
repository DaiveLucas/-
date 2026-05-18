'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback, memo } from 'react';
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
  generateWallpaperPage,
} from '@/lib/wallpaper-data';
import { downloadImage } from '@/lib/download';
import type { WallpaperCategory, Wallpaper } from '@/types/wallpaper';
import Sidebar from '@/components/Sidebar';
import { Footer } from '@/components/Footer';

// 导航栏组件（移除深色模式按钮）
function Navbar({
  favoriteCount,
  onSearchClick,
}: {
  favoriteCount: number;
  onSearchClick: () => void;
}) {
  return (
    <header className="hidden md:flex sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/10 transition-all duration-300">
      <div className="flex-1 h-14 flex items-center justify-between px-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-medium text-foreground">壁纸画廊</span>
        </Link>

        {/* 右侧操作 */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-9 h-9"
            onClick={onSearchClick}
          >
            <Search className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Link href="/favorites">
            <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 relative">
              <Heart className="w-4 h-4 text-muted-foreground" />
              {favoriteCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">
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

// 精简搜索框组件 - 紧凑设计
function SearchBar({
  searchQuery,
  onSearchChange,
  searchRef,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={searchRef} className="w-full px-3 pt-3 pb-2">
      <div className="relative max-w-md mx-auto">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="搜索壁纸..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 pl-10 pr-4 text-sm rounded-lg bg-card/50 border-border/30 focus:bg-card focus:border-border/50 transition-all"
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
    <div className="sticky top-14 md:top-14 z-20 bg-background/80 backdrop-blur-md border-b border-border/10">
      <div className="w-full px-6">
        <div className="flex items-center justify-center gap-1.5 py-2.5 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={`rounded-full px-3 h-7 text-xs whitespace-nowrap transition-all ${
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

// 壁纸卡片组件 - Unsplash风格（用memo包裹避免重新渲染）
const WallpaperCard = memo(function WallpaperCard({
  wallpaper,
  isFavorite,
  onToggleFavorite,
}: {
  wallpaper: Wallpaper;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await downloadImage(wallpaper.imageUrl, `${wallpaper.title}.jpg`, wallpaper);
  };

  // hover 预加载 mediumUrl
  const handleMouseEnter = () => {
    setIsHovered(true);
    // 预加载中等尺寸图片
    if (wallpaper.mediumUrl) {
      const img = new window.Image();
      img.src = wallpaper.mediumUrl;
    }
  };

  return (
    <Link
      href={`/wallpaper/${wallpaper.id}`}
      className="masonry-item block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-muted/30">
        {/* 骨架/模糊占位 */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        
        {/* 图片 - 按原始比例展示 */}
        <img
          src={wallpaper.thumbnailUrl}
          alt={wallpaper.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-auto object-cover rounded-lg transition-all duration-500 ${
            isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'
          } ${
            isHovered && isLoaded ? 'scale-[1.02]' : 'scale-100'
          }`}
        />

        {/* Hover 遮罩 - 黑色半透明 */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 rounded-lg ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* 右上角操作按钮 */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-white hover:text-red-500 hover:bg-white/90'
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              className="w-8 h-8 rounded-full bg-white/90 text-foreground hover:bg-white flex items-center justify-center transition-all duration-200"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 收藏标记（非hover时显示） */}
        {isFavorite && !isHovered && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <Heart className="w-3 h-3 text-white fill-current" />
          </div>
        )}
      </div>
    </Link>
  );
});

// 骨架屏组件 - 替代加载转圈
function SkeletonGrid() {
  // 随机高度的骨架块
  const heights = [180, 220, 260, 300, 340, 280, 200, 240];
  
  return (
    <div className="columns-1 md:columns-3 gap-2 px-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="mb-2 break-inside-avoid"
        >
          <div
            className="bg-muted/50 rounded-lg animate-pulse"
            style={{ height: heights[i % heights.length] }}
          />
        </div>
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
  
  // 无限滚动状态
  const [page, setPage] = useState(1);
  const [allWallpapers, setAllWallpapers] = useState<Wallpaper[]>(wallpapers);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastLoadTimeRef = useRef(0); // 防抖时间戳

  // 加载更多壁纸
  const loadMore = useCallback(async () => {
    // 加锁机制：正在加载 / 没有更多 / 1秒内已加载过
    const now = Date.now();
    if (isLoading || !hasMore || now - lastLoadTimeRef.current < 1000) return;
    
    setIsLoading(true);
    lastLoadTimeRef.current = now;
    
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const nextPage = page + 1;
    const newWallpapers = generateWallpaperPage(nextPage);
    
    if (newWallpapers.length === 0) {
      setHasMore(false);
    } else {
      // 追加数据，不刷新页面
      setAllWallpapers((prev) => [...prev, ...newWallpapers]);
      setPage(nextPage);
    }
    
    setIsLoading(false);
  }, [page, isLoading, hasMore]);

  // 设置 IntersectionObserver
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px 300px 0px' } // 提前300px触发
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, isLoading, hasMore]);

  // 滚动到搜索框
  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // 根据分类和搜索过滤壁纸
  const filteredWallpapers = useMemo(() => {
    // 先根据搜索词筛选（传入动态壁纸列表）
    let result = searchQuery.trim()
      ? searchWallpapers(searchQuery, allWallpapers)
      : allWallpapers;

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
  }, [activeCategory, searchQuery, allWallpapers]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar searchInputRef={searchRef} />
      
      {/* 移动端顶部导航 */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-12 bg-background/90 backdrop-blur-md border-b border-border z-30 flex items-center px-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-medium text-sm text-foreground">壁纸画廊</span>
        </Link>
      </header>

      <main className="flex-1 md:ml-16 pt-14 md:pt-0">
        <Navbar favoriteCount={favoriteCount} onSearchClick={scrollToSearch} />
        <div className="flex-1">
          {/* 精简搜索框 - 紧贴分类栏上方 */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchRef={searchRef}
          />
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <div className="py-3 pb-20 md:pb-6">
            {/* 瀑布流网格 - 固定3列 */}
            <div className="masonry-grid w-full px-6 max-w-7xl mx-auto">
              {filteredWallpapers.map((wallpaper) => (
                <WallpaperCard
                  key={wallpaper.id}
                  wallpaper={wallpaper}
                  isFavorite={!!favorites[wallpaper.id]}
                  onToggleFavorite={() => toggleFavorite(wallpaper.id)}
                />
              ))}
            </div>
            
            {/* 无限滚动哨兵元素 */}
            {!searchQuery && activeCategory === 'all' && (
              <>
                <div ref={sentinelRef} className="h-4" />
                {isLoading && <SkeletonGrid />}
                {!hasMore && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    已加载全部壁纸
                  </div>
                )}
              </>
            )}
            
            {/* 筛选模式下的提示 */}
            {(searchQuery || activeCategory !== 'all') && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                已展示 {filteredWallpapers.length} 张壁纸
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
