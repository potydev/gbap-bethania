-- =============================================
-- SQL Schema untuk Renungan Harian (Devotions)
-- Jalankan di Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. TABEL RENUNGAN (Devotions)
-- =============================================
CREATE TABLE public.devotions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  scripture TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  author TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. INDEX untuk performa
-- =============================================
CREATE INDEX idx_devotions_date ON public.devotions(date);

-- =============================================
-- 3. TRIGGER auto-update updated_at
-- =============================================
CREATE TRIGGER trigger_devotions_updated_at
  BEFORE UPDATE ON public.devotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 4. RLS Policies
-- =============================================
ALTER TABLE public.devotions ENABLE ROW LEVEL SECURITY;

-- Public can read devotions
CREATE POLICY "Anyone can view devotions"
  ON public.devotions FOR SELECT
  USING (true);

-- Authenticated users can manage devotions
CREATE POLICY "Authenticated users can manage devotions"
  ON public.devotions FOR ALL
  USING (auth.role() = 'authenticated');
