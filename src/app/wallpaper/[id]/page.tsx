'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart, Download, Share2, Search, Sparkles, Maximize2, Monitor, ChevronLeft, ChevronRight, X, ChevronDown, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getWallpaperById,
  getSimilarWallpapers,
  formatResolution,
  formatNumber,
} from '@/lib/wallpaper-data';
import { wallpapers as staticWallpapers } from '@/lib/wallpaper-data';
import type { Wallpaper } from '@/types/wallpaper';
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
  wallpaper: Wallpaper;
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

  // 拖动相关 - 用useRef避免闭包延迟
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const lastOffset = useRef({ x: 0, y: 0 });
  const [dragTransform, setDragTransform] = useState('translate(0px, 0px)');

  // 重置加载状态和拖动偏移当壁纸改变时
  useEffect(() => {
    setImageLoaded(false);
    offset.current = { x: 0, y: 0 };
    lastOffset.current = { x: 0, y: 0 };
    setDragTransform('translate(0px, 0px)');
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

  // 拖动事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - lastOffset.current.x,
      y: e.clientY - lastOffset.current.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    offset.current = { x: newX, y: newY };
    setDragTransform(`translate(${newX}px, ${newY}px)`);
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      lastOffset.current = { ...offset.current };
    }
  };

  // 判断图片是横版还是竖版
  const isLandscape = wallpaper.resolution.width >= wallpaper.resolution.height;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 overflow-hidden"
      onClick={onClose}
    >
      {/* 关闭按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
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
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
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
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      )}
      {/* 图片容器 - 撑满全屏 */}
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
      >
        {/* 缩略图（模糊占位） */}
        <img
          src={wallpaper.thumbnailUrl}
          alt={wallpaper.title}
          className={isLandscape
            ? 'w-full h-full object-cover'
            : 'h-full max-w-full object-contain'
          }
          style={{
            filter: imageLoaded ? 'blur(0px)' : 'blur(20px)',
            opacity: imageLoaded ? 0 : 1,
            position: imageLoaded ? 'absolute' : 'relative',
            transform: dragTransform,
            transition: isDragging.current ? 'none' : 'filter 0.5s ease-out, opacity 0.5s ease-out',
          }}
          draggable={false}
        />
        {/* 原图 */}
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          className={isLandscape
            ? 'w-full h-full object-cover'
            : 'h-full max-w-full object-contain'
          }
          style={{
            opacity: imageLoaded ? 1 : 0,
            position: imageLoaded ? 'relative' : 'absolute',
            transform: dragTransform,
            transition: isDragging.current ? 'none' : 'opacity 0.5s ease-out',
          }}
          onLoad={() => setImageLoaded(true)}
          draggable={false}
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
  const { isFavorite, toggleFavorite, favoriteCount } = useFavorites();

  // 页面淡入效果
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 壁纸数据状态 - 优先从 API 获取
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarWallpapers, setSimilarWallpapers] = useState<Wallpaper[]>([]);

  // 从 sessionStorage 读取壁纸ID列表
  const [allWallpaperIds, setAllWallpaperIds] = useState<string[]>([]);

  // 初始化：从 sessionStorage 读取壁纸ID列表
  useEffect(() => {
    const stored = sessionStorage.getItem('allWallpaperIds');
    if (stored) {
      try {
        const ids = JSON.parse(stored);
        if (Array.isArray(ids) && ids.length > 0) {
          setAllWallpaperIds(ids);
        } else {
          // 降级使用静态数据
          setAllWallpaperIds(staticWallpapers.map(w => w.id));
        }
      } catch {
        setAllWallpaperIds(staticWallpapers.map(w => w.id));
      }
    } else {
      // 降级使用静态数据
      setAllWallpaperIds(staticWallpapers.map(w => w.id));
    }
  }, []);

  // 从 API 获取壁纸详情
  useEffect(() => {
    const fetchWallpaper = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/wallpapers/${wallpaperId}`);
        if (response.ok) {
          const data = await response.json();
          setWallpaper(data.wallpaper);
        } else {
          // API 失败，降级使用静态数据
          const fallback = getWallpaperById(wallpaperId);
          setWallpaper(fallback || null);
        }
      } catch (error) {
        console.error('Failed to fetch wallpaper from API, using fallback:', error);
        // 降级方案
        const fallback = getWallpaperById(wallpaperId);
        setWallpaper(fallback || null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWallpaper();
  }, [wallpaperId]);

  // 获取相似壁纸 - 从 API 获取同分类壁纸
  useEffect(() => {
    if (!wallpaper) return;
    
    const fetchSimilar = async () => {
      try {
        const response = await fetch(`/api/wallpapers?page=1&limit=7&category=${wallpaper.category}`);
        if (response.ok) {
          const data = await response.json();
          // 过滤掉当前壁纸，取前6张
          const filtered = (data.wallpapers as Wallpaper[])
            .filter(w => w.id !== wallpaper.id)
            .slice(0, 6);
          setSimilarWallpapers(filtered);
        } else {
          // API 失败，降级使用静态数据
          setSimilarWallpapers(getSimilarWallpapers(wallpaper));
        }
      } catch {
        // 降级使用静态数据
        setSimilarWallpapers(getSimilarWallpapers(wallpaper));
      }
    };

    fetchSimilar();
  }, [wallpaper]);

  // 全屏预览状态
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenDefaultRatio, setFullscreenDefaultRatio] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 分辨率选择相关
  const [showResMenu, setShowResMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [mediumError, setMediumError] = useState(false);

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

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

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

  // 根据原始宽高比计算指定宽度对应的高度
  const getHeightForWidth = (width: number) => {
    const ratio = wallpaper.resolution.height / wallpaper.resolution.width;
    return Math.round(width * ratio);
  };

  // 分辨率选项
  const resolutionOptions = [
    { label: '标清', width: 800, desc: '适合快速预览' },
    { label: '高清', width: 1280, desc: '日常使用' },
    { label: '超清', width: 1920, desc: '最佳画质' },
  ];

  // 获取指定分辨率的URL
  const getUrlForResolution = (width: number) => {
    if (width >= 1920) return wallpaper.imageUrl;
    const height = getHeightForWidth(width);
    const idMatch = wallpaper.imageUrl.match(/\/id\/(\d+)\//);
    const id = idMatch ? idMatch[1] : wallpaper.id;
    return `https://picsum.photos/id/${id}/${width}/${height}`;
  };

  const handleDownload = async (width?: number) => {
    const url = width ? getUrlForResolution(width) : wallpaper.imageUrl;
    await downloadImage(url, `${wallpaper.title}.jpg`, wallpaper);
    // 调用下载计数 API
    try {
      await fetch(`/api/wallpapers/${wallpaper.id}/download`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to update download count:', error);
    }
    setShowResMenu(false);
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
    <div className={`min-h-screen bg-background flex flex-col transition-opacity duration-200 ease-out ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
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
                {/* 加载失败显示 */}
                {imageError && mediumError ? (
                  <div className="w-full aspect-video flex flex-col items-center justify-center gap-3 bg-muted/50">
                    <ImageOff className="w-12 h-12 text-muted-foreground" />
                    <span className="text-muted-foreground">图片加载失败，请稍后重试</span>
                  </div>
                ) : (
                  <>
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
                      onError={() => {
                        setMediumError(true);
                        // 如果 mediumUrl 加载失败，尝试加载原图
                        if (!imageLoaded) {
                          setImageLoaded(true);
                        }
                      }}
                    />
                    {/* 加载指示器 */}
                    {!imageLoaded && !mediumError && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted overflow-hidden">
                        <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
                      </div>
                    )}
                  </>
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
                
                {/* 分辨率选择下载 */}
                <div className="relative w-full">
                  <Button
                    variant="outline"
                    className="w-full gap-2 justify-between"
                    onClick={() => setShowResMenu(!showResMenu)}
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      下载壁纸
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  
                  {showResMenu && (
                    <>
                      {/* 点击外部关闭 */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowResMenu(false)} 
                      />
                      
                      {/* 分辨率菜单 */}
                      <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 z-50">
                        {resolutionOptions.map((opt) => (
                          <button
                            key={opt.width}
                            onClick={() => handleDownload(opt.width)}
                            className="w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted flex items-center justify-between"
                          >
                            <span className="font-medium">{opt.label}</span>
                            <span className="text-muted-foreground text-xs">{opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
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
