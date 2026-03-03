# GBAP Bethania - Church Management System

Sistem manajemen gereja modern untuk GBAP Bethania yang mencakup manajemen anggota, keuangan, acara, dan renungan harian.

## 🚀 Fitur Utama

- **Manajemen Anggota** - Kelola data jemaat dan anggota gereja
- **Manajemen Keuangan** - Tracking pemasukan, pengeluaran, dan laporan keuangan
- **Manajemen Acara** - Jadwal ibadah dan kegiatan gereja
- **Renungan Harian** - Bagikan renungan dan firman Tuhan kepada jemaat
- **Dashboard Admin** - Panel kontrol lengkap untuk administrator
- **Autentikasi** - Sistem login yang aman dengan Supabase

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Testing**: Vitest
- **Package Manager**: Bun

## 📦 Instalasi

### Prerequisites

- [Bun](https://bun.sh) atau Node.js v18+
- Akun [Supabase](https://supabase.com)

### Setup Lokal

```bash
# Clone repository
git clone https://github.com/potydev/gbap-bethania.git

# Masuk ke direktori proyek
cd gbap-bethania

# Install dependencies
bun install

# Setup environment variables
# Buat file .env.local dan isi dengan kredensial Supabase
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Jalankan development server
bun run dev
```

## 🗄️ Database Setup

1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan SQL schema di `src/sql/schema.sql` di SQL Editor Supabase
3. Jalankan SQL untuk devotions di `src/sql/devotions.sql`
4. Copy URL dan Anon Key dari Settings > API

## 🧪 Testing

```bash
# Jalankan tests
bun test

# Jalankan tests dengan UI
bun test:ui
```

## 📁 Struktur Proyek

```
src/
├── components/      # React components
│   ├── dashboard/   # Dashboard components
│   ├── landing/     # Landing page components
│   └── ui/          # shadcn/ui components
├── contexts/        # React contexts (Auth)
├── hooks/           # Custom hooks
├── lib/             # Utilities dan konfigurasi
├── pages/           # Page components
└── sql/             # Database schemas
```

## 🚀 Deployment

Build aplikasi untuk production:

```bash
bun run build
```

Deploy ke platform pilihan Anda (Vercel, Netlify, dll.)

## 📝 License

MIT License - Copyright (c) 2026 GBAP Bethania

## 👥 Kontributor

- **potydev** - Initial work

## 📞 Kontak

Untuk pertanyaan atau dukungan, hubungi tim GBAP Bethania.
