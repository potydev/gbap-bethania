-- =============================================
-- SQL Schema untuk Manajemen Gereja (Supabase)
-- Jalankan di Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. TABEL JEMAAT (Members)
-- =============================================
CREATE TABLE public.members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  birth_date DATE,
  join_date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Tidak Aktif', 'Pindahan')),
  gender TEXT NOT NULL CHECK (gender IN ('Laki-laki', 'Perempuan')),
  baptized BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. TABEL ACARA (Events)
-- =============================================
CREATE TABLE public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  type TEXT NOT NULL CHECK (type IN ('Ibadah', 'Kegiatan', 'Pelayanan', 'Rapat')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Mendatang' CHECK (status IN ('Mendatang', 'Berlangsung', 'Selesai')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. TABEL KEUANGAN (Finance)
-- =============================================
CREATE TABLE public.finance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL CHECK (type IN ('Pemasukan', 'Pengeluaran')),
  category TEXT NOT NULL,
  amount BIGINT NOT NULL CHECK (amount >= 0),
  description TEXT,
  recorded_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. TABEL PENGUMUMAN (Announcements)
-- =============================================
CREATE TABLE public.announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  urgent BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- =============================================
-- 5. TABEL KEHADIRAN (Attendance)
-- =============================================
CREATE TABLE public.attendance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, member_id)
);

-- =============================================
-- 6. TABEL RENUNGAN (Devotions)
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
-- 7. INDEX untuk performa
-- =============================================
CREATE INDEX idx_members_status ON public.members(status);
CREATE INDEX idx_members_name ON public.members(name);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_finance_date ON public.finance(date);
CREATE INDEX idx_finance_type ON public.finance(type);
CREATE INDEX idx_attendance_event ON public.attendance(event_id);
CREATE INDEX idx_devotions_date ON public.devotions(date);

-- =============================================
-- 8. FUNCTION auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_devotions_updated_at
  BEFORE UPDATE ON public.devotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 9. RLS Policies (Enable when using auth)
-- =============================================
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Authenticated users can manage members"
  ON public.members FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage events"
  ON public.events FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage finance"
  ON public.finance FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage announcements"
  ON public.announcements FOR ALL
  USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage attendance"
  ON public.attendance FOR ALL
  USING (auth.role() = 'authenticated');

-- Public can read devotions, authenticated can manage
-- =============================================
-- 10. SEED DATA (Optional)
-- =============================================

CREATE POLICY "Authenticated users can manage devotions"
  ON public.devotions FOR ALL
  USING (auth.role() = 'authenticated');
  USING (auth.role() = 'authenticated');

-- =============================================
-- 9. SEED DATA (Optional)
-- =============================================
INSERT INTO public.members (name, email, phone, address, birth_date, join_date, status, gender, baptized) VALUES
  ('Maria Susanti', 'maria@email.com', '081234567890', 'Jl. Merpati No. 12', '1985-03-15', '2024-01-10', 'Aktif', 'Perempuan', true),
  ('Budi Hartono', 'budi@email.com', '081234567891', 'Jl. Kenari No. 5', '1978-07-22', '2024-02-15', 'Aktif', 'Laki-laki', true),
  ('Sarah Wijaya', 'sarah@email.com', '081234567892', 'Jl. Dahlia No. 8', '1992-11-03', '2024-03-20', 'Aktif', 'Perempuan', false),
  ('Yohanes Pratama', 'yohanes@email.com', '081234567893', 'Jl. Mawar No. 3', '1990-01-18', '2024-04-05', 'Aktif', 'Laki-laki', true),
  ('Dewi Anggraini', 'dewi@email.com', '081234567894', 'Jl. Melati No. 17', '1988-09-30', '2023-12-01', 'Pindahan', 'Perempuan', true);

INSERT INTO public.events (name, date, time, location, type, description, status) VALUES
  ('Ibadah Minggu', '2026-02-08', '09:00', 'Gedung Utama', 'Ibadah', 'Ibadah minggu rutin', 'Mendatang'),
  ('Retreat Pemuda', '2026-02-20', '08:00', 'Villa Puncak', 'Kegiatan', 'Retreat tahunan pemuda gereja', 'Mendatang'),
  ('Bakti Sosial', '2026-03-01', '07:00', 'Panti Asuhan Harapan', 'Pelayanan', 'Kunjungan dan donasi ke panti asuhan', 'Mendatang'),
  ('Rapat Majelis', '2026-02-10', '19:00', 'Ruang Rapat', 'Rapat', 'Rapat bulanan majelis gereja', 'Mendatang');

INSERT INTO public.finance (date, type, category, amount, description) VALUES
  ('2026-02-02', 'Pemasukan', 'Persembahan Minggu', 15500000, 'Persembahan ibadah minggu'),
  ('2026-02-02', 'Pemasukan', 'Perpuluhan', 8200000, 'Perpuluhan jemaat'),
  ('2026-02-03', 'Pengeluaran', 'Operasional', 3500000, 'Listrik, air, dan kebersihan'),
  ('2026-02-04', 'Pengeluaran', 'Pelayanan', 2000000, 'Dana pelayanan diakonia');
