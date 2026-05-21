import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // 先获取总数
    const { count, error: countError } = await supabaseAdmin
      .from('wallpapers')
      .select('*', { count: 'exact', head: true })

    if (countError || !count) {
      console.error('Failed to get count:', countError)
      return NextResponse.json(
        { error: 'Failed to get random wallpaper' },
        { status: 500 }
      )
    }

    // 随机偏移量
    const randomOffset = Math.floor(Math.random() * count)

    // 获取随机一条
    const { data, error } = await supabaseAdmin
      .from('wallpapers')
      .select('*')
      .range(randomOffset, randomOffset)
      .limit(1)

    if (error || !data || data.length === 0) {
      console.error('Failed to get random wallpaper:', error)
      return NextResponse.json(
        { error: 'Failed to get random wallpaper' },
        { status: 500 }
      )
    }

    // 转换为前端 Wallpaper 类型格式
    const wallpaper = data[0]
    const { width, height, ...rest } = wallpaper
    const formattedWallpaper = { ...rest, resolution: { width, height } }

    return NextResponse.json({
      wallpaper: formattedWallpaper
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
