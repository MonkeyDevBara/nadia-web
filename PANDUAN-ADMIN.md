# Panduan Admin

Panduan ini untuk pemilik website. Tidak perlu bisa coding.

## Masuk

1. Buka `alamat-website-kamu.com/admin`.
2. Isi email dan password, klik **Masuk**.
3. Untuk keluar, klik **Keluar** di menu kiri (di HP: tombol **Menu** di bawah).

Tombol **Lihat Website** ada di Dashboard dan di menu, untuk melihat hasil perubahan.

## Cara kerja semua form

- Ubah isian, lalu klik **Simpan**. Notifikasi hijau = berhasil, merah = gagal (baca pesannya).
- Perubahan langsung tampil di website setelah disimpan.
- Jika kamu mau pindah halaman padahal belum menyimpan, browser akan bertanya dulu.
- Tombol **Hapus** selalu meminta konfirmasi.
- Untuk daftar (Expertise, Process, dll): tombol panah ↑ ↓ mengatur urutan tampil.

## Mengganti gambar

Klik **Pilih gambar** / **Ganti gambar**, pilih file JPG, PNG, atau WebP (maksimal 5 MB). Gambar otomatis dikecilkan dan dikompres. Klik **Hapus** lalu **Simpan** untuk menghilangkan gambar.

Tips foto hero: pakai PNG **tanpa background** (misalnya dari remove.bg) supaya fotonya menyatu dengan lingkaran berwarna.

## Menu per menu

| Menu | Untuk apa |
| --- | --- |
| **Dashboard** | Ringkasan jumlah project, testimoni, pesan belum dibaca |
| **Profil & Hero** | Nama, inisial, role, kata kecil & besar, headline, deskripsi, foto hero, tanda tangan, badge "Available for freelance" (bisa dimatikan), tagline footer |
| **Section & Tampilan** | Judul tiap section, daftar tools, dan saklar untuk menampilkan/menyembunyikan section |
| **Statistik** | Angka highlight di bawah hero (mis. "3+ tahun pengalaman") |
| **Expertise** | Daftar keahlian: pilih ikon, judul, deskripsi |
| **Process** | Langkah kerja (maksimal 6) |
| **Sertifikat** | Sertifikat & award: gambar, judul, penerbit |
| **Testimonials** | Kutipan klien. Bisa disembunyikan satu per satu. Jika kosong, section hilang otomatis |
| **Kontak & CTA** | Judul & teks ajakan, tombol (link WhatsApp/email), email, telepon, alamat, website, sosial media |
| **Projects** | Kelola project/portofolio (lihat di bawah) |
| **Artikel** | Kelola artikel yang tampil di menu Articles (lihat di bawah) |
| **Kategori Project** | Kategori untuk filter di halaman Work |
| **Pesan Masuk** | Pesan dari form kontak di website |
| **SEO & Pengaturan** | Judul & deskripsi untuk Google, gambar saat link dibagikan, favicon, warna aksen, Google Analytics |

### Projects

- **Tambah project**: klik **Tambah project**, isi judul (alamat/slug dibuat otomatis, boleh diubah), kategori, ringkasan, deskripsi, klien, periode, role, tools, cover, dan galeri.
- **Deskripsi** mendukung format sederhana: `**tebal**`, `*miring*`, daftar dengan `- `, dan link `[teks](https://alamat)`. Tab **Preview** menunjukkan hasilnya.
- **Status**: *Draft* = tidak tampil di website. *Published* = tampil.
- **Featured**: tampil di halaman utama (bagian Selected Work). Maksimal **3**. Urutannya mengikuti urutan di daftar project.
- **Urutan**: di daftar project, gunakan panah ↑ ↓.
- **Galeri**: bisa pilih banyak gambar sekaligus; atur urutan dengan panah; isi deskripsi gambar (membantu SEO dan pembaca layar).

### Artikel

- **Tambah artikel**: klik **Tambah artikel**, isi judul (slug dibuat otomatis), ringkasan, tag, isi, dan cover.
- **Isi** mendukung `## judul`, `### sub-judul`, `**tebal**`, `*miring*`, daftar dengan `- `, dan link. Tab **Preview** menunjukkan hasilnya.
- **Status**: *Draft* = tidak tampil. *Published* = tampil di menu **Articles**, terbaru dulu.
- **Tanggal terbit**: kosongkan untuk memakai tanggal hari ini saat dipublikasikan.
- **Link sumber**: isi jika artikel juga terbit di tempat lain (mis. Kompasiana); muncul sebagai tombol "Read original".

### Link tombol "Let's connect"

- WhatsApp: `https://wa.me/628123456789` (nomor tanpa `+`, `0`, atau spasi, diawali kode negara)
- Email: `mailto:nama@email.com`

### Pesan Masuk

Titik merah = belum dibaca. Klik pesan untuk membuka (otomatis ditandai sudah dibaca). Jumlah pesan belum dibaca juga muncul di menu. Pengirim yang sama dibatasi 3 pesan per jam untuk mencegah spam.

## Masalah umum

- **"Maksimal 3 project featured"**: matikan Featured di salah satu project dulu.
- **"Slug sudah dipakai"**: ganti slug project dengan yang lain.
- **Gambar ditolak**: pastikan format JPG/PNG/WebP dan ukuran di bawah 5 MB.
- **Lupa password**: reset lewat dashboard Supabase → Authentication → Users.
