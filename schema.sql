create extension if not exists pgcrypto;
create table if not exists public.customers (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 industry text not null default '',
 region text not null default '',
 details text not null default '',
 created_at timestamptz not null default now()
);
create table if not exists public.posts (
 id uuid primary key default gen_random_uuid(),
 customer_id uuid not null references public.customers(id) on delete cascade,
 keyword text not null,
 tone text not null default '',
 content text not null,
 created_at timestamptz not null default now()
);
create index if not exists posts_created_at_idx on public.posts(created_at desc);
alter table public.customers enable row level security;
alter table public.posts enable row level security;
-- No public RLS policies: only the server-side service role may access data.
