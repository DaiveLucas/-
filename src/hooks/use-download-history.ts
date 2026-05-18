'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Wallpaper } from '@/types/wallpaper';

const STORAGE_KEY = 'downloaded-wallpapers';

interface DownloadHistoryItem {
  wallpaper: Wallpaper;
  downloadedAt: string;
}

export function useDownloadHistory() {
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 localStorage 加载
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDownloadHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load download history:', e);
    }
    setIsLoaded(true);
  }, []);

  // 保存到 localStorage
  const saveToStorage = useCallback((history: DownloadHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save download history:', e);
    }
  }, []);

  // 添加下载记录
  const addDownload = useCallback((wallpaper: Wallpaper) => {
    setDownloadHistory((prev) => {
      // 检查是否已存在
      const exists = prev.some((item) => item.wallpaper.id === wallpaper.id);
      if (exists) {
        // 更新下载时间，移到最前面
        const filtered = prev.filter((item) => item.wallpaper.id !== wallpaper.id);
        const newHistory = [{ wallpaper, downloadedAt: new Date().toISOString() }, ...filtered];
        saveToStorage(newHistory);
        return newHistory;
      }
      const newHistory = [{ wallpaper, downloadedAt: new Date().toISOString() }, ...prev];
      saveToStorage(newHistory);
      return newHistory;
    });
  }, [saveToStorage]);

  // 移除下载记录
  const removeDownload = useCallback((wallpaperId: string) => {
    setDownloadHistory((prev) => {
      const newHistory = prev.filter((item) => item.wallpaper.id !== wallpaperId);
      saveToStorage(newHistory);
      return newHistory;
    });
  }, [saveToStorage]);

  // 清空所有下载记录
  const clearHistory = useCallback(() => {
    setDownloadHistory([]);
    saveToStorage([]);
  }, [saveToStorage]);

  // 检查是否已下载
  const isDownloaded = useCallback((wallpaperId: string) => {
    return downloadHistory.some((item) => item.wallpaper.id === wallpaperId);
  }, [downloadHistory]);

  return {
    downloadHistory,
    isLoaded,
    addDownload,
    removeDownload,
    clearHistory,
    isDownloaded,
  };
}
