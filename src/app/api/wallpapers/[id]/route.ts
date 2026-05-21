import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/wallpapers/[id] - 获取单张壁纸详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Missing wallpaper id' },
      { status: 400 }
    );
  }

  try {
    // 查询壁纸详情
    const { data, error } = await supabaseAdmin
      .from('wallpapers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Wallpaper not found' },
        { status: 404 }
      );
    }

    // 更新浏览量 views + 1
    await supabaseAdmin
      .from('wallpapers')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id);

    return NextResponse.json({ wallpaper: data });
  } catch (error) {
    console.error('Error fetching wallpaper:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
