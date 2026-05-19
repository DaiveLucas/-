'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/use-favorites';
import { getWallpapersByTag } from '@/lib/wallpaper-data';
import { downloadImage } from '@/lib/download';
import type { Wallpaper } from '@/types/wallpaper';
import Sidebar from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

// 壁纸卡片组件
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
        {!isLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
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
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 rounded-lg ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
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
        {isFavorite && !isHovered && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <Heart className="w-3 h-3 text-white fill-current" />
          </div>
        )}
      </div>
    </Link>
  );
});

export default function TagPage() {
  const params = useParams();
  const tagName = decodeURIComponent(params.name as string);
  const { favorites, toggleFavorite, favoriteCount } = useFavorites();
  
  // 获取该标签下的壁纸
  const tagWallpapers = useMemo(() => {
    return getWallpapersByTag(tagName);
  }, [tagName]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* 主内容区 */}
      <main className="md:ml-16">
        <Navbar favoriteCount={favoriteCount} />
        
        {/* 标签信息 */}
        <div className="pt-8 pb-4 px-6">
          <div className="max-w-7xl mx-auto">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4 gap-2">
                ← 返回首页
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              #{tagName}
            </h1>
            <p className="text-muted-foreground">
              共 {tagWallpapers.length} 张壁纸
            </p>
          </div>
        </div>

        {/* 壁纸列表 */}
        <div className="pb-12 px-3">
          <div className="max-w-7xl mx-auto">
            {tagWallpapers.length > 0 ? (
              <div className="columns-1 md:columns-3 gap-2">
                {tagWallpapers.map((wallpaper) => (
                  <WallpaperCard
                    key={wallpaper.id}
                    wallpaper={wallpaper}
                    isFavorite={favorites[wallpaper.id]}
                    onToggleFavorite={() => toggleFavorite(wallpaper.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">该标签下暂无壁纸</p>
                <p className="text-sm text-muted-foreground">更多壁纸即将上线，敬请期待</p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
