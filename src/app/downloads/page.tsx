'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Download, Trash2, ArrowLeft, Search, Sparkles } from 'lucide-react';
import { useDownloadHistory } from '@/hooks/use-download-history';
import { downloadImage } from '@/lib/download';
import { useFavorites } from '@/hooks/use-favorites';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';

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
function Navbar() {
  return (
    <header className="hidden md:flex sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">壁纸画廊</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="w-5 h-5 text-muted-foreground" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function DownloadsPage() {
  const { downloadHistory, isLoaded, removeDownload, clearHistory } = useDownloadHistory();
  const { isFavorite } = useFavorites();

  const handleDownload = async (wallpaper: typeof downloadHistory[0]['wallpaper']) => {
    await downloadImage(wallpaper.imageUrl, `${wallpaper.title}.jpg`);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-8 pb-24 md:pb-8">
          {/* 返回按钮 */}
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => window.location.href = '/'}
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Button>

          {/* 标题区 */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">下载历史</h1>
            <p className="text-muted-foreground mt-2">你下载过的壁纸记录</p>
          </div>

          {/* 操作栏 */}
          {downloadHistory.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-muted-foreground">
                共 {downloadHistory.length} 张
              </span>
              <button
                onClick={clearHistory}
                className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                清空历史
              </button>
            </div>
          )}

          {/* 空态 */}
          {downloadHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Download className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">暂无下载记录</p>
              <Link
                href="/"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                去首页逛逛
              </Link>
            </div>
          ) : (
            /* 瀑布流网格 */
            <div className="masonry-grid">
              {downloadHistory.map((item) => {
                const wallpaper = item.wallpaper;
                const isFav = isFavorite(wallpaper.id);

                return (
                  <div key={wallpaper.id} className="masonry-item group">
                    <div className="relative rounded-xl overflow-hidden bg-muted shadow-sm hover:shadow-lg transition-shadow duration-300">
                      {/* 图片 */}
                      <Link href={`/wallpaper/${wallpaper.id}`}>
                        <img
                          src={wallpaper.thumbnailUrl}
                          alt={wallpaper.title}
                          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>

                      {/* Hover 遮罩 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white text-sm font-medium truncate mb-2">{wallpaper.title}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeDownload(wallpaper.id);
                              }}
                              className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg backdrop-blur-sm transition-colors flex items-center justify-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              移除
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(wallpaper);
                              }}
                              className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg backdrop-blur-sm transition-colors flex items-center justify-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              下载
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 收藏标记 */}
                      {isFav && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                          <Heart className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}

                      {/* 下载时间 */}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-[10px] text-white">
                        {new Date(item.downloadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
