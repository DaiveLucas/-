'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchRef: React.RefObject<HTMLDivElement | null>;
}

export function SearchBar({ searchQuery, onSearchChange, searchRef }: SearchBarProps) {
  return (
    <div ref={searchRef} className="w-full px-3 pt-3 pb-2">
      <div className="relative max-w-md mx-auto">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="搜索壁纸..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 pl-10 pr-4 text-sm rounded-lg bg-card/50 border-border/30 focus:bg-card focus:border-border/50 transition-all"
        />
      </div>
    </div>
  );
}