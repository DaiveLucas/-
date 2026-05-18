'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart, Download, Share2, Search, Sparkles, Maximize2, Monitor, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getWallpaperById,
  getSimilarWallpapers,
  formatResolution,
  formatNumber,
  wallpapers,
} from '@/lib/wallpaper-data';
import { useFavorites } from '@/hooks/use-favorites';
import { downloadImage } from '@/lib/download';
import Sidebar from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

// 全屏预览组件
function FullscreenPreview({
  wallpaper,
  isOpen,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  defaultDesktopRatio = false,
}: {
  wallpaper: typeof wallpapers[0];
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  defaultDesktopRatio?: boolean;
}) {
  const [isDesktopRatio, setIsDesktopRatio] = useState(defaultDesktopRatio);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 重置加载状态当壁纸改变时
  useEffect(() => {
    setImageLoaded(false);
  }, [wallpaper.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

  const handleEnterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // 浏览器不支持全屏
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* 左右切换按钮 */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      )}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      )}

      {/* 图片容器 - 渐进式加载 */}
      <div
        className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 缩略图（模糊占位） */}
        <img
          src={wallpaper.thumbnailUrl}
          alt={wallpaper.title}
          className={`max-w-full max-h-[90vh] object-contain transition-all duration-500 ${
            isDesktopRatio ? 'aspect-video' : ''
          }`}
          style={{
            filter: imageLoaded ? 'blur(0px)' : 'blur(20px)',
            opacity: imageLoaded ? 0 : 1,
            position: imageLoaded ? 'absolute' : 'relative',
          }}
        />
        {/* 原图 */}
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          className={`max-w-full max-h-[90vh] object-contain transition-all duration-500 ${
            isDesktopRatio ? 'aspect-video' : ''
          }`}
          style={{
            opacity: imageLoaded ? 1 : 0,
            position: imageLoaded ? 'relative' : 'absolute',
          }}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* 底部工具栏 */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleEnterFullscreen}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm"
        >
          <Maximize2 className="w-4 h-4" />
          全屏
        </button>
        <button
          onClick={() => setIsDesktopRatio(!isDesktopRatio)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-white text-sm ${
            isDesktopRatio ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          <Monitor className="w-4 h-4" />
          16:9 比例
        </button>
      </div>
    </div>
  );
}

export default function WallpaperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const wallpaperId = params.id as string;
  const wallpaper = getWallpaperById(wallpaperId);
  const similarWallpapers = wallpaper ? getSimilarWallpapers(wallpaper) : [];
  const { isFavorite, toggleFavorite, favoriteCount } = useFavorites();

  // 全屏预览状态
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenDefaultRatio, setFullscreenDefaultRatio] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 获取所有壁纸ID列表用于切换
  const allWallpaperIds = wallpapers.map(w => w.id);

  useEffect(() => {
    if (wallpaper) {
      const idx = allWallpaperIds.indexOf(wallpaper.id);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [wallpaper, allWallpaperIds]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      router.push(`/wallpaper/${allWallpaperIds[currentIndex - 1]}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < allWallpaperIds.length - 1) {
      router.push(`/wallpaper/${allWallpaperIds[currentIndex + 1]}`);
    }
  };

  if (!wallpaper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">壁纸不存在</h1>
          <Button onClick={() => router.push('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    await downloadImage(wallpaper.imageUrl, `${wallpaper.title}.jpg`, wallpaper);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: wallpaper.title,
        text: `来看看这张精美壁纸：${wallpaper.title}`,
        url: window.location.href,
      });
    }
  };

  const handleSimilarDownload = async (url: string, title: string) => {
    await downloadImage(url, `${title}.jpg`);
  };

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

      <main className="flex-1 md:ml-16 pt-16 md:pt-0">
        <Navbar favoriteCount={favoriteCount} />

        <div className="max-w-7xl mx-auto px-6 py-8 pb-20 md:pb-8">
          {/* 返回按钮 */}
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 大图区域 - 渐进式加载，使用 mediumUrl 首屏 */}
            <div className="lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden shadow-float bg-muted">
                {/* 缩略图（模糊占位）- 始终占据空间 */}
                <img
                  src={wallpaper.thumbnailUrl}
                  alt={wallpaper.title}
                  className="w-full h-auto object-cover"
                  style={{
                    filter: imageLoaded ? 'blur(0px)' : 'blur(20px)',
                    opacity: imageLoaded ? 0 : 1,
                    transition: 'filter 0.5s ease-out, opacity 0.5s ease-out',
                  }}
                />
                {/* 中等尺寸图 - 首屏展示，始终绝对定位覆盖 */}
                <img
                  src={wallpaper.mediumUrl || wallpaper.imageUrl}
                  alt={wallpaper.title}
                  className="w-full h-auto object-cover"
                  style={{
                    opacity: imageLoaded ? 1 : 0,
                    position: 'absolute',
                    inset: 0,
                    transition: 'opacity 0.5s ease-out',
                  }}
                  onLoad={() => setImageLoaded(true)}
                />
                {/* 加载指示器 */}
                {!imageLoaded && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted overflow-hidden">
                    <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
                  </div>
                )}
              </div>
            </div>

            {/* 信息面板 */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{wallpaper.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {wallpaper.tags.map((tag) => (
                    <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>分辨率</span>
                  <span className="text-foreground">
                    {formatResolution(wallpaper.resolution)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>来源</span>
                  <span className="text-foreground">{wallpaper.source}</span>
                </div>
                <div className="flex justify-between">
                  <span>下载量</span>
                  <span className="text-foreground">
                    {formatNumber(wallpaper.downloads)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>浏览量</span>
                  <span className="text-foreground">
                    {formatNumber(wallpaper.views)}
                  </span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3">
                <Button
                  className={`w-full gap-2 ${
                    isFavorite(wallpaper.id) 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : ''
                  }`}
                  onClick={() => toggleFavorite(wallpaper.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite(wallpaper.id) ? 'fill-current' : ''
                    }`}
                  />
                  {isFavorite(wallpaper.id) ? '已收藏 ❤️' : '收藏壁纸'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                  下载原图
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    setShowFullscreen(true);
                    setFullscreenDefaultRatio(false);
                  }}
                >
                  <Maximize2 className="w-4 h-4" />
                  全屏预览
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    setShowFullscreen(true);
                    setFullscreenDefaultRatio(true);
                  }}
                >
                  <Monitor className="w-4 h-4" />
                  设为桌面比例
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  分享
                </Button>
              </div>
            </div>
          </div>

          {/* 相似推荐 */}
          {similarWallpapers.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold mb-6">相似壁纸</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {similarWallpapers.map((item) => (
                  <Link key={item.id} href={`/wallpaper/${item.id}`}>
                    <div className="relative rounded-xl overflow-hidden shadow-card hover:shadow-float transition-all duration-300 bg-muted group">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-full bg-white/80"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSimilarDownload(item.imageUrl, item.title);
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />

      {/* 全屏预览 */}
      <FullscreenPreview
        wallpaper={wallpaper}
        isOpen={showFullscreen}
        onClose={() => setShowFullscreen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={currentIndex < allWallpaperIds.length - 1}
        hasPrev={currentIndex > 0}
        defaultDesktopRatio={fullscreenDefaultRatio}
      />
    </div>
  );
}
