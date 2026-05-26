'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Download, ImageOff } from 'lucide-react';
import type { Wallpaper } from '@/types/wallpaper';
import { downloadImage } from '@/lib/download';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function WallpaperCard({ wallpaper, isFavorite, onToggleFavorite }: WallpaperCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await downloadImage(wallpaper.imageUrl, `${wallpaper.title}.jpg`, wallpaper);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (wallpaper.mediumUrl) {
      const img = new window.Image();
      img.src = wallpaper.mediumUrl;
    }
  };

  return (
    <Link
      href={`/wallpaper/${wallpaper.id}`}
      className="mb-3 break-inside-avoid block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-muted/30 rounded-lg">
        {!isLoaded && !hasError && (
          <div
            className="w-full bg-muted animate-pulse rounded-lg"
            style={{ aspectRatio: `${wallpaper.resolution.width} / ${wallpaper.resolution.height}` }}
          />
        )}

        {hasError && (
          <div className="absolute inset-0 bg-muted/50 flex flex-col items-center justify-center gap-2 min-h-[150px]">
            <ImageOff className="w-8 h-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">加载失败</span>
          </div>
        )}

        {!hasError && (
          <Image
            src={wallpaper.mediumUrl || wallpaper.thumbnailUrl}
            alt={wallpaper.title}
            width={wallpaper.resolution.width}
            height={wallpaper.resolution.height}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-auto bg-muted/20 rounded-lg transition-all duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${
              isHovered && isLoaded ? 'scale-[1.02]' : 'scale-100'
            }`}
            style={{
              filter: isLoaded ? 'none' : 'blur(10px)',
            }}
          />
        )}

        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white/80 text-white hover:text-red-500 hover:bg-white/90'
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              className="w-8 h-8 rounded-full bg-white/90 text-foreground hover:bg-white flex items-center justify-center transition-all duration-200"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isFavorite && !isHovered && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <Heart className="w-3 h-3 text-white fill-current" />
          </div>
        )}
      </div>
    </Link>
  );
}