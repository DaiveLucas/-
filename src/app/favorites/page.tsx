'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Download, Trash2, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { wallpapers } from '@/lib/wallpaper-data';
import { useFavorites } from '@/hooks/use-favorites';
import { downloadImage, downloadMultipleImages } from '@/lib/download';
import Sidebar from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export default function FavoritesPage() {
  const { favorites, isLoaded, removeFavorite, favoriteCount } = useFavorites();

  const favoriteWallpapers = wallpapers.filter((w) => favorites[w.id]);

  const handleDownload = async (imageUrl: string, title: string) => {
    await downloadImage(imageUrl, `${title}.jpg`);
  };

  const handleDownloadAll = async () => {
    const items = favoriteWallpapers.map((w) => ({
      url: w.imageUrl,
      filename: `${w.title}.jpg`,
      wallpaper: w,
    }));
    await downloadMultipleImages(items);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar />
      
      {/* 移动端顶部导航 */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background/90 backdrop-blur-md border-b border-border z-30 flex items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">壁纸画廊</span>
        </Link>
      </header>

      <main className="flex-1 md:ml-16 pt-20 md:pt-0">
        <Navbar favoriteCount={favoriteCount} />

        <div className="max-w-7xl mx-auto px-6 py-8 pb-24 md:pb-8">
          {/* 标题区 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">我的收藏</h1>
            <p className="text-muted-foreground">你收藏的精选壁纸</p>
          </div>

          {favoriteWallpapers.length === 0 ? (
            /* 空态 */
            <div className="text-center py-20">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <h2 className="text-xl font-semibold mb-2">暂无收藏</h2>
              <p className="text-muted-foreground mb-6">
                去首页逛逛，收藏你喜欢的壁纸吧
              </p>
              <Link href="/">
                <Button className="rounded-full">去首页逛逛</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* 批量操作栏 */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-muted-foreground">
                  共 {favoriteWallpapers.length} 张收藏
                </span>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleDownloadAll}
                >
                  <Download className="w-4 h-4" />
                  全部下载
                </Button>
              </div>

              {/* 收藏网格 */}
              <div className="masonry-grid">
                {favoriteWallpapers.map((wallpaper) => (
                  <div key={wallpaper.id} className="masonry-item group">
                    <div className="relative rounded-2xl overflow-hidden shadow-card hover:shadow-float transition-all duration-300 bg-muted">
                      {/* 使用 img 标签让图片按原始比例自然撑开，实现真正的瀑布流 */}
                      <img
                        src={wallpaper.thumbnailUrl}
                        alt={wallpaper.title}
                        className="w-full h-auto object-cover"
                      />
                      {/* 右上角收藏标记 */}
                      <div className="absolute top-3 right-3 p-2 bg-destructive rounded-full">
                        <Heart className="w-4 h-4 fill-white text-white" />
                      </div>
                      {/* Hover 遮罩 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-medium mb-2">
                            {wallpaper.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeFavorite(wallpaper.id)}
                              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() =>
                                handleDownload(wallpaper.imageUrl, wallpaper.title)
                              }
                              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                            >
                              <Download className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
