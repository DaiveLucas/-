'use client';

import { useState, useEffect, useCallback } from 'react';
import type { FavoriteState } from '@/types/wallpaper';

const STORAGE_KEY = 'wallpaper-favorites';

// 收藏状态管理 Hook
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteState>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 localStorage 加载收藏状态
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
    setIsLoaded(true);
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    }
  }, [favorites, isLoaded]);

  // 切换收藏状态
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  // 添加收藏
  const addFavorite = useCallback((id: string) => {
    setFavorites(prev => ({
      ...prev,
      [id]: true,
    }));
  }, []);

  // 移除收藏
  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  // 检查是否已收藏
  const isFavorite = useCallback((id: string): boolean => {
    return !!favorites[id];
  }, [favorites]);

  // 获取所有收藏的 ID 列表
  const getFavoriteIds = useCallback((): string[] => {
    return Object.keys(favorites).filter(id => favorites[id]);
  }, [favorites]);

  // 获取收藏数量
  const favoriteCount = Object.values(favorites).filter(Boolean).length;

  // 清空所有收藏
  const clearFavorites = useCallback(() => {
    setFavorites({});
  }, []);

  return {
    favorites,
    isLoaded,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteIds,
    favoriteCount,
    clearFavorites,
  };
}
