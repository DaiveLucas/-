'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Shuffle,
  Heart,
  Download,
  RefreshCw,
  Sun,
  Moon,
  Globe,
  MoreHorizontal,
  Info,
} from 'lucide-react';
import { wallpapers } from '@/lib/wallpaper-data';

interface SidebarProps {
  searchInputRef?: React.RefObject<HTMLDivElement | null>;
}

// Tooltip 组件定义在组件外部
function TooltipItem({ 
  text, 
  children, 
  tooltip, 
  setTooltip 
}: { 
  text: string; 
  children: React.ReactNode;
  tooltip: string | null;
  setTooltip: (t: string | null) => void;
}) {
  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setTooltip(text)}
      onMouseLeave={() => setTooltip(null)}
    >
      {children}
      {tooltip === text && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md whitespace-nowrap shadow-md z-50">
          {text}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ searchInputRef }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  const handleRandomWallpaper = () => {
    const randomIndex = Math.floor(Math.random() * wallpapers.length);
    const randomWallpaper = wallpapers[randomIndex];
    router.push(`/wallpaper/${randomWallpaper.id}`);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const iconClass = (active: boolean) =>
    `w-5 h-5 transition-colors duration-200 ${active ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`;

  return (
    <>
      {/* 桌面端侧边栏 */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-16 flex-col items-center py-4 bg-background/80 backdrop-blur-md border-r border-border z-40">
        {/* Logo */}
        <div className="mb-6">
          <Link href="/" className="text-xl font-bold text-primary">
            🖼️
          </Link>
        </div>

        {/* 主要图标 */}
        <nav className="flex flex-col items-center space-y-1 flex-1">
          <TooltipItem text="首页" tooltip={tooltip} setTooltip={setTooltip}>
            <Link
              href="/"
              className={`p-3 rounded-lg transition-colors ${isActive('/') ? 'bg-muted' : 'hover:bg-muted/50'}`}
            >
              <Home className={iconClass(isActive('/'))} />
            </Link>
          </TooltipItem>

          <TooltipItem text="随机壁纸" tooltip={tooltip} setTooltip={setTooltip}>
            <button
              onClick={handleRandomWallpaper}
              className="p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Shuffle className={iconClass(false)} />
            </button>
          </TooltipItem>

          <TooltipItem text="收藏夹" tooltip={tooltip} setTooltip={setTooltip}>
            <Link
              href="/favorites"
              className={`p-3 rounded-lg transition-colors ${isActive('/favorites') ? 'bg-muted' : 'hover:bg-muted/50'}`}
            >
              <Heart className={iconClass(isActive('/favorites'))} />
            </Link>
          </TooltipItem>

          <TooltipItem text="下载历史" tooltip={tooltip} setTooltip={setTooltip}>
            <Link
              href="/downloads"
              className={`p-3 rounded-lg transition-colors ${isActive('/downloads') ? 'bg-muted' : 'hover:bg-muted/50'}`}
            >
              <Download className={iconClass(isActive('/downloads'))} />
            </Link>
          </TooltipItem>

          <TooltipItem text="刷新" tooltip={tooltip} setTooltip={setTooltip}>
            <button
              onClick={handleRefresh}
              className="p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <RefreshCw className={iconClass(false)} />
            </button>
          </TooltipItem>
        </nav>

        {/* 分隔线 */}
        <div className="w-8 h-px bg-border my-2" />

        {/* 底部图标 */}
        <div className="flex flex-col items-center space-y-1">
          <TooltipItem text={isDark ? '浅色模式' : '深色模式'} tooltip={tooltip} setTooltip={setTooltip}>
            <button
              onClick={toggleTheme}
              className="p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {mounted && (isDark ? <Sun className={iconClass(false)} /> : <Moon className={iconClass(false)} />)}
            </button>
          </TooltipItem>

          <TooltipItem text="语言切换" tooltip={tooltip} setTooltip={setTooltip}>
            <button className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Globe className={iconClass(false)} />
            </button>
          </TooltipItem>

          <div className="relative">
            <TooltipItem text="更多" tooltip={tooltip} setTooltip={setTooltip}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <MoreHorizontal className={iconClass(false)} />
              </button>
            </TooltipItem>

            {/* 更多菜单 */}
            {showMoreMenu && (
              <div className="absolute left-full ml-2 top-0 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[120px] z-50">
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted flex items-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  关于
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 移动端底部 Tab 栏 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-md border-t border-border z-40">
        <div className="flex items-center justify-around h-full">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">首页</span>
          </Link>

          <button
            onClick={handleRandomWallpaper}
            className="flex flex-col items-center justify-center gap-1 px-4 py-2 text-muted-foreground"
          >
            <Shuffle className="w-5 h-5" />
            <span className="text-[10px]">随机</span>
          </button>

          <Link
            href="/favorites"
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 ${isActive('/favorites') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px]">收藏</span>
          </Link>

          <Link
            href="/downloads"
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 ${isActive('/downloads') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Download className="w-5 h-5" />
            <span className="text-[10px]">下载</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
