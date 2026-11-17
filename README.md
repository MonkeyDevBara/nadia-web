# Portfolio + CMS (Next.js 15 + Supabase)

Website portofolio dengan panel admin (`/admin`) untuk mengedit semua teks dan gambar tanpa menyentuh kode.

- **Stack:** Next.js 15 (App Router) · TypeScript strict · Tailwind v4 · Supabase (Postgres, Auth, Storage) · Zod · lucide-react
- **Halaman publik:** Server Components, data di-cache dan otomatis di-refresh saat admin menyimpan.
- **Admin:** login email + password, CRUD semua section, upload gambar (dikompres ke WebP di browser), pesan masuk.

## 1. Setup database di Supabase

1. Buat project di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** → New query → tempel seluruh isi `supabase/migrations/0001_schema.sql` → **Run**.
3. Query baru → tempel seluruh isi `supabase/migrations/0002_grants.sql` → **Run** (hak akses role; project Supabase baru tidak memberikannya otomatis, tanpa ini muncul error `permission denied for table ...`).
4. Query baru → tempel seluruh isi `supabase/seed.sql` → **Run** (mengisi data awal Nadia: profil, 17 project, sertifikat, dll).
5. **Authentication → Users → Add user → Create new user**: isi email + password owner, centang *Auto Confirm User*.
6. **Authentication → Sign In / Providers**: matikan **Allow new users to sign up** (tidak ada register publik; hanya akun yang kamu buat manual yang bisa login).

Yang dibuat oleh migration: 10 tabel, index, trigger (maks 3 project featured, maks 6 langkah process, `updated_at`), RLS di semua tabel, fungsi `submit_message` (rate limit 3 pesan/IP/jam), dan bucket Storage `media` (publik baca, hanya owner yang menulis, maks 5 MB, hanya jpg/png/webp).

> Aturan akses: pengunjung (anon) hanya bisa **membaca** data published/visible. Tabel `messages` tidak bisa dibaca anon; pesan dikirim lewat fungsi `submit_message`. Owner (authenticated) punya CRUD penuh.

## 2. Jalankan di lokal

```bash
cp .env.example .env.local   # lalu isi nilainya
npm install
npm run dev                  # http://localhost:3000
```

Isi `.env.local`:

| Variabel | Dari mana |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` key |
| `IP_HASH_SALT` | string acak apa saja (untuk hash IP di rate limit form kontak) |

Admin: <http://localhost:3000/admin> (login dengan akun dari langkah 1.4). Panduan untuk pemilik website: lihat `PANDUAN-ADMIN.md`.

## 3. Struktur

```
src/app/(public)/         halaman publik (Home, /work, /work/[slug])
src/app/admin/            login + dashboard CMS (diproteksi middleware)
src/components/public|admin|ui
src/lib/supabase/         client server / browser / middleware
src/lib/data/             pembacaan data (public.ts = ber-cache, admin.ts = sesi owner)
src/lib/actions/          server actions (semua mutasi, divalidasi ulang di server)
src/lib/validations/      skema Zod
src/lib/utils/            compressImage, slugify, markdown, icons
supabase/migrations/      skema SQL
supabase/seed.sql         data awal
public/                   gambar bawaan (hero, project, sertifikat) yang dipakai seed
```

Cache publik memakai tag per entitas (`settings`, `projects`, `expertises`, ...). Setiap server action admin memanggil `revalidateTag`, jadi perubahan langsung tampil. Jika data diubah langsung di dashboard Supabase, website ikut ter-update paling lambat 1 jam.

## 4. Deploy ke Vercel

1. Push repo ke GitHub, import di Vercel.
2. Isi Environment Variables yang sama dengan `.env.local`.
3. Deploy. Pastikan domain Vercel/produksi diizinkan di Supabase jika kamu menambah pembatasan CORS/redirect.

## Perintah

```bash
npm run dev     # development
npm run build   # build produksi
npm run lint
```
