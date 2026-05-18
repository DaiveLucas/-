import type { Wallpaper } from '@/types/wallpaper';

const DOWNLOAD_HISTORY_KEY = 'downloaded-wallpapers';

// 记录下载历史到 localStorage
function recordDownload(wallpaper: Wallpaper) {
  try {
    const stored = localStorage.getItem(DOWNLOAD_HISTORY_KEY);
    let history: { wallpaper: Wallpaper; downloadedAt: string }[] = stored ? JSON.parse(stored) : [];

    // 检查是否已存在，如果存在则移除旧的
    history = history.filter((item) => item.wallpaper.id !== wallpaper.id);

    // 添加到最前面
    history.unshift({
      wallpaper,
      downloadedAt: new Date().toISOString(),
    });

    localStorage.setItem(DOWNLOAD_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to record download:', e);
  }
}

// 下载单张图片
export async function downloadImage(url: string, filename: string, wallpaper?: Wallpaper) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // 延迟移除元素和释放 blob URL
    setTimeout(() => {
      if (link.parentNode) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(blobUrl);
    }, 1000);

    // 记录下载历史
    if (wallpaper) {
      recordDownload(wallpaper);
    }
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: 直接打开图片
    window.open(url, '_blank');
  }
}

// 批量下载图片
export async function downloadMultipleImages(items: { url: string; filename: string; wallpaper?: Wallpaper }[]) {
  for (let i = 0; i < items.length; i++) {
    await downloadImage(items[i].url, items[i].filename, items[i].wallpaper);
    // 等待一段时间避免浏览器拦截
    if (i < items.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
}
