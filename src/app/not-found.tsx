import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, ImageOff } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* 主内容区 */}
      <main className="md:ml-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
          {/* 插画/图标 */}
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-full bg-muted/50 flex items-center justify-center">
              <ImageOff className="w-16 h-16 text-muted-foreground/60" />
            </div>
            {/* 装饰元素 */}
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary/20" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-primary/10" />
          </div>
          
          {/* 提示文字 */}
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            壁纸不存在或已被删除
          </h1>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            您访问的壁纸可能已被移除，或者链接地址有误。
            <br />
            请返回首页浏览更多精彩壁纸。
          </p>
          
          {/* 操作按钮 */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回上页
            </Button>
            <Link href="/">
              <Button className="gap-2">
                <Home className="w-4 h-4" />
                返回首页
              </Button>
            </Link>
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  );
}
