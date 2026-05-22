import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '16', 10)
    const category = searchParams.get('category')

    const offset = (page - 1) * limit

    // 构建查询
    let query = supabase
      .from('wallpapers')
      .select('*', { count: 'exact' })

    // 分类过滤（如果不是 'all'）
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // 按创建时间降序排列 + 分页
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch wallpapers' },
        { status: 500 }
      )
    }

    const total = count || 0
    const hasMore = offset + limit < total

    // 转换为前端 Wallpaper 类型格式
    const formattedWallpapers = (data || []).map((w: Record<string, unknown>) => {
      const { width, height, ...rest } = w as Record<string, unknown> & { width: number; height: number }
      return { ...rest, resolution: { width, height } }
    })

    return NextResponse.json({
      wallpapers: formattedWallpapers,
      total,
      page,
      hasMore
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
