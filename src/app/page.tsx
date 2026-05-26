'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import {
  categories,
  searchWallpapers as localSearchWallpapers,
  mapWallpaper,
  shuffleArray,
} from '@/lib/wallpaper-data';
import { wallpapers as staticWallpapers } from '@/lib/wallpaper-data';
import { supabase } from '@/lib/supabase';
import type { WallpaperCategory, Wallpaper } from '@/types/wallpaper';
import Sidebar from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { CategoryTabs } from '@/components/CategoryTabs';
import { WallpaperCard } from '@/components/WallpaperCard';
import { SkeletonGrid } from '@/components/SkeletonGrid';

// 模块级缓存
let cachedWallpapers: Wallpaper[] | null = null;
let cachedPage = 1;

// 主页面
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<WallpaperCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const { favorites, toggleFavorite } = useFavorites();

  const [page, setPage] = useState(cachedPage);
  const [allWallpapers, setAllWallpapers] = useState<Wallpaper[]>(cachedWallpapers || []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastLoadTimeRef = useRef(0);
  const isInitializedRef = useRef(false);

  const handleCategoryChange = async (category: WallpaperCategory) => {
    setActiveCategory(category);
    if (category === 'all') return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallpapers')
        .select('*')
        .eq('category', category)
        .limit(50);
      if (error) throw error;
      const formatted = (data || []).map(w => mapWallpaper(w));
      const unique = Array.from(new Map(formatted.map(w => [w.id, w])).values());
      setAllWallpapers(unique.length > 0 ? unique : staticWallpapers.filter(w => w.category === category));
      setHasMore(false);
    } catch (error) {
      console.error('Failed to fetch category:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (cachedWallpapers && cachedWallpapers.length > 0) return;

    const fetchInitialData = async () => {
      try {
        const allData = [];
        for (const cat of categories.filter(c => c.id !== 'all')) {
          const { data } = await supabase.from('wallpapers').select('*').eq('category', cat.id).limit(2);
          if (data) allData.push(...data);
        }
        const formatted = allData.map(w => mapWallpaper(w));
        const unique = Array.from(new Map(formatted.map(w => [w.id, w])).values());
        setAllWallpapers(unique.length > 0 ? shuffleArray(unique) : staticWallpapers);
        setHasMore(formatted.length > 0);
        setPage(1);
      } catch (error) {
        console.error('Failed to fetch wallpapers:', error);
        setAllWallpapers(staticWallpapers);
        setHasMore(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    cachedWallpapers = allWallpapers;
    cachedPage = page;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('allWallpaperIds', JSON.stringify(allWallpapers.map(w => w.id)));
    }
  }, [allWallpapers, page]);

  const loadMore = useCallback(async () => {
    const now = Date.now();
    if (isLoading || !hasMore || now - lastLoadTimeRef.current < 1000) return;
    if (!isInitializedRef.current) isInitializedRef.current = true;

    setIsLoading(true);
    lastLoadTimeRef.current = now;

    try {
      const nextPage = page + 1;
      const offset = (nextPage - 1) * 16;
      const { data, error } = await supabase
        .from('wallpapers')
        .select('*')
        .order('id', { ascending: true })
        .range(offset, offset + 15);

      if (error) throw error;
      const formatted = (data || []).map(w => mapWallpaper(w));

      if (formatted.length === 0) {
        setHasMore(false);
      } else {
        setAllWallpapers(prev => [...prev, ...formatted]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Failed to load wallpapers:', error);
      setHasMore(false);
    }

    setIsLoading(false);
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();
        if (entries[0].isIntersecting && !isLoading && hasMore && now - lastLoadTimeRef.current >= 1000) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px 300px 0px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore, isLoading, hasMore]);

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Wallpaper[]>([]);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    setIsSearching(true);

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const [supabaseResult, wallhavenResult] = await Promise.allSettled([
          supabase
            .from('wallpapers')
            .select('*')
            .or('title.ilike.%' + searchQuery.trim().replace(/'/g, "''") + '%,tags.cs.{' + searchQuery.trim().replace(/'/g, "''") + '}')
            .limit(30),
          fetch(`/api/wallhaven/search?q=${encodeURIComponent(searchQuery.trim())}&page=1`).then(r => r.json())
        ]);

        const localWallpapers: Wallpaper[] =
          supabaseResult.status === 'fulfilled' && supabaseResult.value.data
            ? supabaseResult.value.data.map(w => mapWallpaper(w))
            : [];

        const wallhavenWallpapers: Wallpaper[] =
          wallhavenResult.status === 'fulfilled' && wallhavenResult.value.wallpapers
            ? wallhavenResult.value.wallpapers
            : [];

        const seenUrls = new Set<string>();
        const merged: Wallpaper[] = [];
        for (const w of [...localWallpapers, ...wallhavenWallpapers]) {
          if (!seenUrls.has(w.imageUrl)) {
            seenUrls.add(w.imageUrl);
            merged.push(w);
          }
        }

        setSearchResults(merged);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults(localSearchWallpapers(searchQuery, allWallpapers));
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery, allWallpapers]);

  const filteredWallpapers = useMemo(() => {
    let result = searchQuery.trim() ? searchResults : allWallpapers;
    if (activeCategory !== 'all') {
      result = result.filter(w => w.category === activeCategory);
    }
    return result;
  }, [activeCategory, searchQuery, allWallpapers, searchResults]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar searchInputRef={searchRef} />

      <header className="md:hidden fixed top-0 left-0 right-0 h-12 bg-background/90 backdrop-blur-md border-b border-border z-30 flex items-center px-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-medium text-sm text-foreground">壁纸画廊</span>
        </Link>
      </header>

      <main className="flex-1 md:ml-16 pt-14 md:pt-0">
        <Navbar onSearchClick={scrollToSearch} />
        <div className="flex-1">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchRef={searchRef}
          />
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
          />
          <div className="py-3 pb-20 md:pb-6">
            {allWallpapers.length === 0 && !isSearching && <SkeletonGrid />}
            {isSearching && <SkeletonGrid />}

            {!isSearching && (
              <div className="columns-3 gap-3 w-full px-5 max-w-[1800px] mx-auto">
                {filteredWallpapers.map((wallpaper) => (
                  <WallpaperCard
                    key={wallpaper.id}
                    wallpaper={wallpaper}
                    isFavorite={!!favorites[wallpaper.id]}
                    onToggleFavorite={() => toggleFavorite(wallpaper.id)}
                  />
                ))}
              </div>
            )}

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

            {!isSearching && (searchQuery || activeCategory !== 'all') && (
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