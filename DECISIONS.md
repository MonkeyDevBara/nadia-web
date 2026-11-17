# DECISIONS

Catatan keputusan teknis penting.

## Fase 1 — UI publik (statis)

- **Scope:** Task 1 (setup) + Task 3 (Home statis) + tampilan `/work`, `/work/[slug]`, 404. Supabase, admin/CMS belum dikerjakan.
- **Tailwind v4:** design token ada di `src/app/globals.css` (`:root` + `@theme inline`). Utility khusus: `label-caps`, `container-x`.
- **Font:** Anton, Playfair Display (italic), Inter, Mrs Saint Delafield via `next/font/google`, diekspos sebagai CSS variable `--font-anton`, `--font-playfair`, `--font-inter`, `--font-signature`.
- **JS client minimal:** satu-satunya client component adalah `MobileMenu` (hamburger). Slider testimoni = CSS scroll-snap + anchor; badge berputar = CSS animation (mati saat `prefers-reduced-motion`).
- **Selected Work / Certificates mobile:** horizontal scroll-snap di bawah `lg`; Selected Work jadi grid 3 kolom di `lg+`.
- **Markdown:** `src/lib/utils/markdown.ts` parser sendiri (paragraf, bold, italic, link http/https/mailto, list). HTML mentah di-escape sebelum diproses, jadi aman untuk `dangerouslySetInnerHTML`.
- **Ikon:** `lucide-react`; daftar ikon yang dipilih admin dibatasi di `src/lib/utils/icons.ts`.
- **Filter /work:** lewat query param `?category=slug`, di-render server-side (tanpa JS).

## Fase 2 — Konten nyata dari CV & PDF portofolio

- **Sumber:** `CV Nadia Zsalsa.pdf` dan `Portofolio Nadia Zsalsa Purwanta.pdf`. Profil ternyata **copywriter / SEO content writer**, bukan UI/UX designer, jadi role, expertise, process, dan kategori project disesuaikan (SEO & Content Writing, Social Media Copywriting, Public Communication, Script & Storytelling).
- **Bahasa publik:** Inggris, mengikuti bahasa portofolio asli (`<html lang="en">`). Admin nanti tetap Bahasa Indonesia.
- **Data:** `src/lib/siteContent.ts` (pengganti `dummyData.ts`). Tipe di `src/types/content.ts` pakai camelCase; dipetakan dari snake_case DB di Task 4.
- **Gambar:** diekstrak dari PDF (bukan di-screenshot) lalu dikonversi ke WebP (maks 1200px, kualitas 80) ke `public/projects/<slug>/`, `public/certificates/`, dan `public/nadia-hero.webp` (cutout transparan). Metadata ukuran ada di `src/lib/portfolioImages.ts` (digenerate). Ditampilkan dengan `next/image`. Nanti dipindah ke Supabase Storage lewat CMS.
- **Project = pengalaman/case study** dari PDF (17 project, 3 featured: SIDIGS, Farla Infinite, Komdigi). Angka (18.5K impressions, +280% followers, 42 artikel, dll.) hanya dari data PDF.
- **Section tambahan:** `Stats` (angka highlight) dan `Certificates` (sertifikat & award). `Testimonials` tetap ada tapi otomatis tersembunyi karena sumber data belum punya testimoni.
- **Asumsi yang perlu dikonfirmasi pemilik:** badge "Available for freelance" aktif; link Instagram `instagram.com/nadia.zsalsa` (dari handle `nadia.zsalsa` di slide kontak); tombol CTA ke WhatsApp `+62 878 6621 2727`; kata hero "Creative / PORTFOLIO" tetap sesuai desain referensi.
- **Resolusi foto hero:** cutout di PDF hanya 324×417 px, jadi agak lembut di layar retina. Ganti dengan foto PNG tanpa background resolusi lebih tinggi lewat CMS.

## Fase 3 — Database + Admin CMS

- **Sumber data:** semua konten publik dibaca dari Supabase. `siteContent.ts` dihapus; isinya dipindah ke `supabase/seed.sql`. Tanpa env Supabase, halaman publik menampilkan `SetupNotice` (bukan data palsu).
- **Skema:** `supabase/migrations/0001_schema.sql` (satu file, jalankan sekali di SQL Editor). Menambah di luar spec awal: tabel `stats`, `certificates`; kolom `site_settings` untuk teks section + saklar tampil/sembunyi + tools + signature_text + accent_color; kolom `projects.period`, `cover_width/height`, `project_images.width/height` (agar `next/image` tidak layout shift).
- **Tipe baris DB = tipe UI** (`src/types/database.ts`, snake_case) supaya form admin bisa berbasis konfigurasi field tanpa lapisan mapping.
- **Keamanan:** RLS di semua tabel. anon: SELECT saja (project published, testimoni visible). `messages`: anon tidak punya policy; kirim lewat fungsi `submit_message` (SECURITY DEFINER) yang sekaligus menegakkan rate limit 3/IP/jam di DB. Trigger DB menegakkan maks 3 featured dan maks 6 process. `SUPABASE_SERVICE_ROLE_KEY` tidak dipakai sama sekali (lebih aman), jadi dihapus dari `.env.example`.
- **Auth:** Supabase Auth email+password, tanpa halaman register. `middleware.ts` memproteksi `/admin/*`; setiap server action juga memanggil `requireUser()` (defense in depth), dan RLS membatasi tulis ke role `authenticated`.
- **Cache:** `unstable_cache` + tag per entitas (`src/lib/data/public.ts`), `revalidate` 1 jam sebagai jaring pengaman; server action memanggil `revalidateTag` + `revalidatePath('/', 'layout')`.
- **Admin berbasis konfigurasi:** `SettingsForm` (site_settings) dan `ListEditor` (expertise/process/testimonial/stats/sertifikat/kategori) dirender dari `fieldConfigs.ts`; project punya form khusus. Server action generik di `lib/actions/crud.ts` (save/delete/move).
- **Upload gambar:** dikompres di browser (Canvas, maks 1920px, WebP q80; fallback JPEG/PNG bila browser tak bisa encode WebP), validasi tipe + 5 MB sebelum upload, langsung ke bucket `media` memakai sesi owner. File yang sudah tidak dipakai tidak otomatis dihapus dari Storage.
- **Peringatan keluar halaman:** `useUnsavedChanges` (beforeunload + intersep klik link internal) karena App Router tidak punya event route-change.
- **Verifikasi:** diuji end-to-end terhadap mock Supabase lokal (pglite + endpoint Auth/PostgREST/Storage) karena Docker tidak tersedia; belum diuji terhadap project Supabase asli.
