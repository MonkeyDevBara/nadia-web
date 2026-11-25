-- =============================================================================
-- Artikel (menu "Articles"). Jalankan SETELAH 0001 dan 0002. Aman dijalankan berulang.
-- =============================================================================

create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  excerpt       text not null default '',
  content_md    text not null default '',
  tags          text[] not null default '{}',
  cover_url     text,
  cover_width   integer not null default 1200 check (cover_width > 0),
  cover_height  integer not null default 630 check (cover_height > 0),
  source_url    text,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  published_on  date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists articles_status_date_idx
  on public.articles (status, published_on desc, created_at desc);

drop trigger if exists articles_updated_at on public.articles;
create trigger articles_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

alter table public.articles enable row level security;

drop policy if exists "public read published articles" on public.articles;
create policy "public read published articles" on public.articles
  for select to anon using (status = 'published');

drop policy if exists "owner all articles" on public.articles;
create policy "owner all articles" on public.articles
  for all to authenticated using (true) with check (true);

grant select on public.articles to anon;
grant select, insert, update, delete on public.articles to authenticated;
