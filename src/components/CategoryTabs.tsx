'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import type { WallpaperCategory } from '@/types/wallpaper';

interface CategoryTabsProps {
  activeCategory: WallpaperCategory;
  onCategoryChange: (category: WallpaperCategory) => void;
  categories: { id: WallpaperCategory; label: string }[];
}

export function CategoryTabs({ activeCategory, onCategoryChange, categories }: CategoryTabsProps) {
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