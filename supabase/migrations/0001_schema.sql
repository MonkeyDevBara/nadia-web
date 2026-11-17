-- =============================================================================
-- Portfolio + CMS — skema database
-- Jalankan SELURUH file ini di Supabase > SQL Editor (sekali), lalu jalankan
-- supabase/seed.sql untuk mengisi data awal.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Fungsi util
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- site_settings (tepat 1 baris, id = 1)
-- ---------------------------------------------------------------------------
create table public.site_settings (
  id                      integer primary key default 1 check (id = 1),

  -- Profil & Hero
  name                    text not null default '',
  initials                text not null default '',
  role                    text not null default '',
  hero_small_word         text not null default '',
  hero_big_word           text not null default '',
  headline                text not null default '',
  description             text not null default '',
  hero_image_url          text,
  signature_url           text,
  signature_text          text not null default '',
  badge_enabled           boolean not null default true,
  badge_text              text not null default '',
  tagline                 text not null default '',

  -- Teks & tampilan section landing page
  show_stats              boolean not null default true,
  show_work               boolean not null default true,
  show_expertise          boolean not null default true,
  show_process            boolean not null default true,
  show_certificates       boolean not null default true,
  show_testimonials       boolean not null default true,
  work_eyebrow            text not null default '',
  work_title              text not null default '',
  work_link_label         text not null default '',
  expertise_eyebrow       text not null default '',
  expertise_title         text not null default '',
  tools_title             text not null default '',
  tools                   text[] not null default '{}',
  process_eyebrow         text not null default '',
  process_title           text not null default '',
  certificates_eyebrow    text not null default '',
  certificates_title      text not null default '',

  -- Kontak & CTA
  contact_eyebrow         text not null default '',
  cta_title               text not null default '',
  cta_text                text not null default '',
  cta_button_label        text not null default '',
  cta_button_link         text not null default '',
  email                   text not null default '',
  phone                   text not null default '',
  address                 text not null default '',
  website                 text not null default '',
  socials                 jsonb not null default '[]'::jsonb
                          check (jsonb_typeof(socials) = 'array'),

  -- SEO & pengaturan
  seo_title               text not null default '',
  seo_description         text not null default '',
  og_image_url            text,
  favicon_url             text,
  accent_color            text check (accent_color is null or accent_color ~ '^#[0-9a-fA-F]{6}$'),
  ga_id                   text,

  updated_at              timestamptz not null default now()
);

create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  sort_order  integer not null default 0
);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  category_id   uuid references public.categories (id) on delete set null,
  summary       text not null default '',
  content_md    text not null default '',
  client        text not null default '',
  year          integer check (year is null or year between 1990 and 2100),
  period        text not null default '',
  role          text not null default '',
  tools         text[] not null default '{}',
  cover_url     text,
  cover_width   integer not null default 1000 check (cover_width > 0),
  cover_height  integer not null default 750 check (cover_height > 0),
  live_url      text,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  is_featured   boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index projects_status_sort_idx on public.projects (status, sort_order);
create index projects_category_idx on public.projects (category_id);

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- Maksimal 3 project featured
create or replace function public.enforce_max_featured()
returns trigger
language plpgsql
as $$
begin
  if new.is_featured and (
    select count(*) from public.projects
    where is_featured and id <> new.id
  ) >= 3 then
    raise exception 'Maksimal 3 project featured' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger projects_max_featured
  before insert or update of is_featured on public.projects
  for each row execute function public.enforce_max_featured();

-- ---------------------------------------------------------------------------
-- project_images (galeri)
-- ---------------------------------------------------------------------------
create table public.project_images (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  image_url   text not null,
  alt         text not null default '',
  width       integer not null default 1000 check (width > 0),
  height      integer not null default 750 check (height > 0),
  sort_order  integer not null default 0
);

create index project_images_project_idx on public.project_images (project_id, sort_order);

-- ---------------------------------------------------------------------------
-- expertises
-- ---------------------------------------------------------------------------
create table public.expertises (
  id          uuid primary key default gen_random_uuid(),
  icon        text not null default 'Sparkles',
  title       text not null,
  description text not null default '',
  sort_order  integer not null default 0
);

-- ---------------------------------------------------------------------------
-- process_steps (maksimal 6)
-- ---------------------------------------------------------------------------
create table public.process_steps (
  id          uuid primary key default gen_random_uuid(),
  icon        text not null default 'Sparkles',
  title       text not null,
  description text not null default '',
  sort_order  integer not null default 0
);

create or replace function public.enforce_max_process_steps()
returns trigger
language plpgsql
as $$
begin
  if (select count(*) from public.process_steps) >= 6 then
    raise exception 'Maksimal 6 langkah process' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger process_steps_max
  before insert on public.process_steps
  for each row execute function public.enforce_max_process_steps();

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
create table public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  quote       text not null,
  name        text not null,
  position    text not null default '',
  photo_url   text,
  is_visible  boolean not null default true,
  sort_order  integer not null default 0
);

-- ---------------------------------------------------------------------------
-- stats (angka highlight di bawah hero)
-- ---------------------------------------------------------------------------
create table public.stats (
  id          uuid primary key default gen_random_uuid(),
  value       text not null,
  label       text not null,
  sort_order  integer not null default 0
);

-- ---------------------------------------------------------------------------
-- certificates
-- ---------------------------------------------------------------------------
create table public.certificates (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  issuer        text not null default '',
  image_url     text not null,
  is_highlight  boolean not null default false,
  sort_order    integer not null default 0
);

-- ---------------------------------------------------------------------------
-- messages (form kontak)
-- ---------------------------------------------------------------------------
create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 120),
  email       text not null check (char_length(email) between 3 and 200),
  body        text not null check (char_length(body) between 1 and 5000),
  is_read     boolean not null default false,
  ip_hash     text,
  created_at  timestamptz not null default now()
);

create index messages_created_idx on public.messages (created_at desc);
create index messages_ip_idx on public.messages (ip_hash, created_at desc);

-- Kirim pesan dari publik. Rate limit: maks 3 pesan per ip_hash per jam.
-- SECURITY DEFINER agar anon tidak perlu hak SELECT/INSERT langsung pada tabel.
create or replace function public.submit_message(
  p_name    text,
  p_email   text,
  p_body    text,
  p_ip_hash text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_ip_hash is not null and (
    select count(*) from public.messages
    where ip_hash = p_ip_hash and created_at > now() - interval '1 hour'
  ) >= 3 then
    return 'rate_limited';
  end if;

  insert into public.messages (name, email, body, ip_hash)
  values (p_name, p_email, p_body, p_ip_hash);

  return 'ok';
end;
$$;

revoke all on function public.submit_message(text, text, text, text) from public;
grant execute on function public.submit_message(text, text, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.site_settings  enable row level security;
alter table public.categories     enable row level security;
alter table public.projects       enable row level security;
alter table public.project_images enable row level security;
alter table public.expertises     enable row level security;
alter table public.process_steps  enable row level security;
alter table public.testimonials   enable row level security;
alter table public.stats          enable row level security;
alter table public.certificates   enable row level security;
alter table public.messages       enable row level security;

-- Publik (anon): hanya SELECT, hanya data published / visible
create policy "public read site_settings" on public.site_settings
  for select to anon using (true);
create policy "public read categories" on public.categories
  for select to anon using (true);
create policy "public read published projects" on public.projects
  for select to anon using (status = 'published');
create policy "public read images of published projects" on public.project_images
  for select to anon using (
    exists (
      select 1 from public.projects p
      where p.id = project_images.project_id and p.status = 'published'
    )
  );
create policy "public read expertises" on public.expertises
  for select to anon using (true);
create policy "public read process_steps" on public.process_steps
  for select to anon using (true);
create policy "public read visible testimonials" on public.testimonials
  for select to anon using (is_visible);
create policy "public read stats" on public.stats
  for select to anon using (true);
create policy "public read certificates" on public.certificates
  for select to anon using (true);
-- messages: anon TIDAK punya policy; kirim lewat fungsi public.submit_message()

-- Owner (authenticated): CRUD penuh
create policy "owner all site_settings" on public.site_settings
  for all to authenticated using (true) with check (true);
create policy "owner all categories" on public.categories
  for all to authenticated using (true) with check (true);
create policy "owner all projects" on public.projects
  for all to authenticated using (true) with check (true);
create policy "owner all project_images" on public.project_images
  for all to authenticated using (true) with check (true);
create policy "owner all expertises" on public.expertises
  for all to authenticated using (true) with check (true);
create policy "owner all process_steps" on public.process_steps
  for all to authenticated using (true) with check (true);
create policy "owner all testimonials" on public.testimonials
  for all to authenticated using (true) with check (true);
create policy "owner all stats" on public.stats
  for all to authenticated using (true) with check (true);
create policy "owner all certificates" on public.certificates
  for all to authenticated using (true) with check (true);
create policy "owner all messages" on public.messages
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Storage: bucket "media" (publik baca, hanya owner yang menulis)
-- Batas 5 MB, hanya jpg / png / webp.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "media public read" on storage.objects
  for select to public using (bucket_id = 'media');
create policy "media owner insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
create policy "media owner update" on storage.objects
  for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');
create policy "media owner delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
