create extension if not exists "pgcrypto";

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  year integer not null,
  caption text not null,
  media_url text not null,
  media_path text not null,
  media_type text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quotas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  value numeric(10, 2) not null default 0,
  paid boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  description text not null,
  receipt_url text,
  value numeric(10, 2) not null default 0,
  expense_date date not null,
  created_at timestamptz not null default now()
);

alter table public.gallery_items enable row level security;
alter table public.quotas enable row level security;
alter table public.expenses enable row level security;

drop policy if exists "Galeria publica para leitura" on public.gallery_items;
drop policy if exists "Galeria publica para inserir" on public.gallery_items;
drop policy if exists "Galeria publica para remover" on public.gallery_items;
drop policy if exists "Cotas publicas para leitura" on public.quotas;
drop policy if exists "Cotas publicas para inserir" on public.quotas;
drop policy if exists "Cotas publicas para atualizar" on public.quotas;
drop policy if exists "Cotas publicas para remover" on public.quotas;
drop policy if exists "Despesas publicas para leitura" on public.expenses;
drop policy if exists "Despesas publicas para inserir" on public.expenses;
drop policy if exists "Despesas publicas para remover" on public.expenses;

create policy "Galeria publica para leitura"
  on public.gallery_items for select
  using (true);

create policy "Galeria publica para inserir"
  on public.gallery_items for insert
  with check (true);

create policy "Galeria publica para remover"
  on public.gallery_items for delete
  using (true);

create policy "Cotas publicas para leitura"
  on public.quotas for select
  using (true);

create policy "Cotas publicas para inserir"
  on public.quotas for insert
  with check (true);

create policy "Cotas publicas para atualizar"
  on public.quotas for update
  using (true)
  with check (true);

create policy "Cotas publicas para remover"
  on public.quotas for delete
  using (true);

create policy "Despesas publicas para leitura"
  on public.expenses for select
  using (true);

create policy "Despesas publicas para inserir"
  on public.expenses for insert
  with check (true);

create policy "Despesas publicas para remover"
  on public.expenses for delete
  using (true);
