'use client';

import React from 'react';

export function SkeletonGrid() {
  const heights = [180, 220, 260, 300, 340, 280, 200, 240];

  return (
    <div className="columns-3 gap-3 px-5 max-w-[1800px] mx-auto">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="mb-3 break-inside-avoid">
          <div
            className="bg-muted/50 rounded-lg animate-pulse"
            style={{ height: heights[i % heights.length] }}
          />
        </div>
      ))}
    </div>
  );
}