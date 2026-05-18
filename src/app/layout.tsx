import type { Metadata } from 'next';
import Script from 'next/script';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '壁纸画廊 | 发现你的下一张壁纸',
    template: '%s | 壁纸画廊',
  },
  description:
    'AI精选高质量壁纸，每日更新。自然风景、动漫、赛博朋克、极简、治愈系、太空、抽象等多种分类，一键收藏下载。',
  keywords: [
    '壁纸',
    '高清壁纸',
    '桌面壁纸',
    '手机壁纸',
    '壁纸下载',
    'AI壁纸',
    '壁纸推荐',
  ],
  authors: [{ name: '壁纸画廊' }],
  generator: 'Coze Code',
  openGraph: {
    title: '壁纸画廊 | 发现你的下一张壁纸',
    description: 'AI精选高质量壁纸，每日更新。',
    siteName: '壁纸画廊',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="dark"||(!localStorage.getItem("theme")&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`,
          }}
        />
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
