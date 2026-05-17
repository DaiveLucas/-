'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart, Download, Share2, Moon, Sun, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useFavorites } from '@/hooks/use-favorites';
import { getWallpaperById, getSimilarWallpapers, formatResolution, formatNumber } from '@/lib/wallpaper-data';

// 导航栏组件
function DetailNavbar() {
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
          <Link href="/favorites">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="w-5 h-5 text-muted-foreground" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

import { useState } from 'react';

// 详情页主体
export default function WallpaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const wallpaper = getWallpaperById(id);
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);

  // 404 处理
  if (!wallpaper) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">壁纸不存在</h1>
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  const similarWallpapers = getSimilarWallpapers(wallpaper, 6);
  const favorite = isFavorite(wallpaper.id);

  const handleDownload = () => {
    window.open(wallpaper.imageUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <DetailNavbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 返回按钮 */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
        </Link>

        {/* 主内容区 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 大图展示 */}
          <div className="lg:col-span-2">
            <div
              className="relative overflow-hidden rounded-2xl bg-muted shadow-float"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={wallpaper.imageUrl}
                  alt={wallpaper.title}
                  fill
                  className={`object-cover transition-transform duration-500 ${
                    isHovered ? 'scale-[1.02]' : 'scale-100'
                  }`}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* 信息面板 */}
          <div className="space-y-6">
            {/* 标题 */}
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {wallpaper.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{wallpaper.category}</Badge>
                {wallpaper.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 统计信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted">
                <p className="text-sm text-muted-foreground mb-1">浏览</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(wallpaper.views || 0)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted">
                <p className="text-sm text-muted-foreground mb-1">下载</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(wallpaper.downloads || 0)}
                </p>
              </div>
            </div>

            {/* 详细信息 */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">分辨率</span>
                <span className="text-foreground">{formatResolution(wallpaper.resolution)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">来源</span>
                <span className="text-foreground">{wallpaper.source || '未知'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">发布日期</span>
                <span className="text-foreground">{wallpaper.createdAt}</span>
              </div>
            </div>

            <Separator />

            {/* 操作按钮 */}
            <div className="space-y-3">
              <Button
                className={`w-full rounded-xl h-12 ${
                  favorite
                    ? 'bg-destructive text-white hover:bg-destructive/90'
                    : ''
                }`}
                variant={favorite ? 'default' : 'default'}
                onClick={() => toggleFavorite(wallpaper.id)}
              >
                <Heart className={`w-5 h-5 mr-2 ${favorite ? 'fill-current' : ''}`} />
                {favorite ? '已收藏' : '收藏壁纸'}
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl h-12 border-border"
                onClick={handleDownload}
              >
                <Download className="w-5 h-5 mr-2" />
                下载原图
              </Button>
              <Button variant="ghost" className="w-full rounded-xl h-12">
                <Share2 className="w-5 h-5 mr-2" />
                分享
              </Button>
            </div>
          </div>
        </div>

        {/* 相似壁纸 */}
        {similarWallpapers.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-foreground mb-6">相似壁纸</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarWallpapers.map((similar) => (
                <Link
                  key={similar.id}
                  href={`/wallpaper/${similar.id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-xl bg-muted shadow-card group-hover:shadow-float transition-all duration-300">
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={similar.thumbnailUrl}
                        alt={similar.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-xs font-medium truncate">
                        {similar.title}
                      </p>
                    </div>
                    {favorites[similar.id] && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive flex items-center justify-center">
                        <Heart className="w-3 h-3 text-white fill-current" />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
