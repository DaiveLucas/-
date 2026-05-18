'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart, Download, Share2, Moon, Sun, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getWallpaperById,
  getSimilarWallpapers,
  formatResolution,
  formatNumber,
} from '@/lib/wallpaper-data';
import { useFavorites } from '@/hooks/use-favorites';
import { downloadImage } from '@/lib/download';

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

// 导航栏组件
function Navbar({ favoriteCount }: { favoriteCount: number }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="w-5 h-5 text-muted-foreground" />
            </Button>
          </Link>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={toggleTheme}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>
          )}
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

export default function WallpaperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const wallpaperId = params.id as string;
  const wallpaper = getWallpaperById(wallpaperId);
  const similarWallpapers = wallpaper ? getSimilarWallpapers(wallpaper) : [];
  const { isFavorite, toggleFavorite, favoriteCount } = useFavorites();

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
    await downloadImage(wallpaper.imageUrl, `${wallpaper.title}.jpg`);
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
      <Navbar favoriteCount={favoriteCount} />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 大图区域 */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden shadow-float bg-muted">
              <Image
                src={wallpaper.imageUrl}
                alt={wallpaper.title}
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>

          {/* 信息面板 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{wallpaper.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {wallpaper.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
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
                className="w-full gap-2"
                onClick={() => toggleFavorite(wallpaper.id)}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite(wallpaper.id) ? 'fill-current' : ''
                  }`}
                />
                {isFavorite(wallpaper.id) ? '已收藏' : '收藏壁纸'}
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
                  <div className="relative rounded-xl overflow-hidden shadow-card hover:shadow-float transition-all duration-300 aspect-[3/4] bg-muted group">
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
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
      </main>

      <Footer />
    </div>
  );
}
