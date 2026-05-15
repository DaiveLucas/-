'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Image as ImageIcon, Link as LinkIcon, FileText } from 'lucide-react';

interface FetchResult {
  title?: string;
  url?: string;
  status_code?: number;
  status_message?: string;
  text_content?: string;
  images?: Array<{
    url?: string;
    original_url?: string;
    width?: number;
    height?: number;
  }>;
  links?: string[];
  display_info?: {
    no_display?: boolean;
    no_display_reason?: string;
  };
  error?: string;
  details?: string;
}

export default function Home() {
  const [data, setData] = useState<FetchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUrl = 'https://www.coze.cn/session/7631141699774939430';

  useEffect(() => {
    async function fetchUrl() {
      try {
        setLoading(true);
        const response = await fetch('/api/fetch-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: targetUrl }),
        });
        const result = await response.json();
        
        if (result.error) {
          setError(result.error + (result.details ? `: ${result.details}` : ''));
        } else {
          setData(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch URL');
      } finally {
        setLoading(false);
      }
    }

    fetchUrl();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 标题区域 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{data?.title || '页面内容'}</CardTitle>
                {data?.url && (
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <ExternalLink className="h-4 w-4" />
                    <a 
                      href={data.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline break-all"
                    >
                      {data.url}
                    </a>
                  </CardDescription>
                )}
              </div>
              <Badge variant={data?.status_code === 0 ? 'default' : 'destructive'}>
                {data?.status_code === 0 ? '成功' : `错误: ${data?.status_code}`}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* 无法显示提示 */}
        {data?.display_info?.no_display && (
          <Alert>
            <AlertDescription>
              无法显示内容: {data.display_info.no_display_reason}
            </AlertDescription>
          </Alert>
        )}

        {/* 文本内容 */}
        {data?.text_content && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                文本内容
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                {data.text_content}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 图片内容 */}
        {data?.images && data.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ImageIcon className="h-5 w-5" />
                图片 ({data.images.length} 张)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.images.map((img, index) => (
                  <div key={index} className="space-y-2">
                    {img.url ? (
                      <img 
                        src={img.url} 
                        alt={`图片 ${index + 1}`}
                        className="w-full rounded-lg border"
                        style={{ maxWidth: '100%' }}
                      />
                    ) : (
                      <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">图片无法显示</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {img.width && img.height && `${img.width} × ${img.height}`}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 链接内容 */}
        {data?.links && data.links.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <LinkIcon className="h-5 w-5" />
                链接 ({data.links.length} 个)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.links.slice(0, 20).map((link, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <LinkIcon className="h-3 w-3 text-muted-foreground" />
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm break-all"
                    >
                      {link}
                    </a>
                  </li>
                ))}
                {data.links.length > 20 && (
                  <li className="text-muted-foreground text-sm">
                    ... 还有 {data.links.length - 20} 个链接
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
