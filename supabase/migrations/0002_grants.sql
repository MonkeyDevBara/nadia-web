-- =============================================================================
-- Hak akses (GRANT) untuk role Supabase.
-- Project Supabase baru tidak lagi memberi hak otomatis ke tabel yang dibuat lewat SQL,
-- sehingga tanpa file ini API menolak dengan "permission denied for table ...".
-- Aman dijalankan berulang. Jalankan SETELAH 0001_schema.sql.
-- RLS tetap yang membatasi baris mana yang boleh dilihat/diubah.
-- =============================================================================

grant usage on schema public to anon, authenticated;

-- Pengunjung (anon): hanya baca. Tabel messages sengaja TIDAK diberi hak ke anon.
grant select on
  public.site_settings,
  public.categories,
  public.projects,
  public.project_images,
  public.expertises,
  public.process_steps,
  public.testimonials,
  public.stats,
  public.certificates
to anon;

-- Owner (authenticated): CRUD penuh
grant select, insert, update, delete on
  public.site_settings,
  public.categories,
  public.projects,
  public.project_images,
  public.expertises,
  public.process_steps,
  public.testimonials,
  public.stats,
  public.certificates,
  public.messages
to authenticated;

-- Kirim pesan dari form kontak (rate limit di dalam fungsi)
grant execute on function public.submit_message(text, text, text, text) to anon, authenticated;
