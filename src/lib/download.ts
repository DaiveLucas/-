// 下载工具函数 - 解决跨域下载问题

/**
 * 下载图片文件（支持跨域）
 * 使用 fetch + blob 方式，失败时 fallback 到 window.open
 */
export async function downloadImage(
  imageUrl: string,
  filename: string
): Promise<void> {
  try {
    // 尝试 fetch + blob 方式下载
    const response = await fetch(imageUrl, {
      mode: 'cors',
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 延迟释放 blob URL
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  } catch {
    // 跨域失败时，fallback 到新窗口打开
    console.warn('下载失败，改为新窗口打开');
    window.open(imageUrl, '_blank');
  }
}

/**
 * 批量下载图片
 * @param items 图片列表
 * @param interval 每次下载间隔（毫秒）
 */
export async function downloadMultipleImages(
  items: Array<{ url: string; filename: string }>,
  interval: number = 300
): Promise<void> {
  for (let i = 0; i < items.length; i++) {
    const { url, filename } = items[i];
    await downloadImage(url, filename);
    if (i < items.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
}
