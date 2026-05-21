-- 壁纸表
CREATE TABLE IF NOT EXISTS wallpapers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  source_id TEXT,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  ratio TEXT NOT NULL DEFAULT 'landscape',
  category TEXT NOT NULL DEFAULT '风景',
  tags TEXT[] DEFAULT '{}',
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  thumbnail_url TEXT NOT NULL,
  medium_url TEXT NOT NULL,
  image_url TEXT NOT NULL,
  color TEXT DEFAULT '#ffffff',
  photographer TEXT,
  photographer_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_wallpapers_category ON wallpapers(category);
CREATE INDEX IF NOT EXISTS idx_wallpapers_created_at ON wallpapers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallpapers_downloads ON wallpapers(downloads DESC);

-- 启用 RLS
ALTER TABLE wallpapers ENABLE ROW LEVEL SECURITY;

-- 创建公开读取策略
CREATE POLICY "Public read access" ON wallpapers
  FOR SELECT USING (true);

-- 创建服务端完全访问策略
CREATE POLICY "Service role full access" ON wallpapers
  FOR ALL USING (auth.role() = 'service_role');
