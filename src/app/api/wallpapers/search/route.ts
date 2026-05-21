import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    if (!q || q.trim() === '') {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const keyword = q.trim()
    // 过滤特殊字符，防止SQL注入
    const safeKeyword = keyword.replace(/[%_{}'"\\]/g, '')

    // 搜索标题或标签
    // .or() 组合条件：标题模糊匹配 OR 标签数组包含关键词
    const { data, error } = await supabaseAdmin
      .from('wallpapers')
      .select('*')
      .or(`title.ilike.%${safeKeyword}%,tags.cs.{${safeKeyword}}`)
      .limit(50)

    if (error) {
      console.error('Supabase search error:', error)
      return NextResponse.json(
        { error: 'Failed to search wallpapers' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      wallpapers: data || []
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
