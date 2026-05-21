import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 使用 RPC 或原始 SQL 来原子性地增加 downloads 计数
    // Supabase 不支持直接 update({ downloads: 'downloads + 1' })
    // 所以先获取当前值再加1
    const { data: current, error: fetchError } = await supabaseAdmin
      .from('wallpapers')
      .select('downloads')
      .eq('id', id)
      .single()

    if (fetchError || !current) {
      console.error('Failed to fetch wallpaper:', fetchError)
      return NextResponse.json(
        { error: 'Wallpaper not found' },
        { status: 404 }
      )
    }

    const { error: updateError } = await supabaseAdmin
      .from('wallpapers')
      .update({ downloads: (current.downloads || 0) + 1 })
      .eq('id', id)

    if (updateError) {
      console.error('Failed to update downloads:', updateError)
      return NextResponse.json(
        { error: 'Failed to update downloads' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
