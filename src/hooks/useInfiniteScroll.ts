'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseInfiniteScrollOptions {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll({
  isLoading,
  hasMore,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '0px 0px 300px 0px',
}: UseInfiniteScrollOptions) {
  const [isInitialized, setIsInitialized] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastLoadTimeRef = useRef(0);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const now = Date.now();
      if (
        entries[0].isIntersecting &&
        !isLoading &&
        hasMore &&
        now - lastLoadTimeRef.current >= 1000
      ) {
        lastLoadTimeRef.current = now;
        onLoadMore();
      }
    },
    [isLoading, hasMore, onLoadMore]
  );

  useEffect(() => {
    if (isInitialized) return;
    setIsInitialized(true);

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersect, threshold, rootMargin, isInitialized]);

  return { sentinelRef };
}