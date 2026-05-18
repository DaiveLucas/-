'use client';

import Link from 'next/link';
import { Heart, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 导航栏组件（桌面端）
export function Navbar({ favoriteCount }: { favoriteCount?: number }) {
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
          {typeof favoriteCount === 'number' && (
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
          )}
        </div>
      </div>
    </header>
  );
}
