-- =============================================================
-- Frankos Balkan Food — Datenbank-Schema
-- Im Supabase SQL Editor ausführen (einmalig).
-- =============================================================

create extension if not exists pgcrypto;

-- ---------- Produkte ----------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  handle      text not null unique,
  title       text not null,
  description text not null default '',
  category    text not null default 'Sonstiges',
  price_cents integer not null check (price_cents > 0),
  currency    text not null default 'EUR',
  unit        text,
  image_url   text,
  badge       text,
  stock       integer not null default 0 check (stock >= 0),
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists products_active_idx on public.products (active);

-- ---------- Bestellungen ----------
-- Fortlaufende, lesbare Bestellnummern: FRK-2026-00001
create sequence if not exists public.order_number_seq;

create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  order_number          text not null unique
                        default 'FRK-' || to_char(now(), 'YYYY') || '-' ||
                                lpad(nextval('public.order_number_seq')::text, 5, '0'),
  stripe_session_id     text not null unique,
  stripe_payment_intent text,
  customer_name         text not null default '',
  email                 text not null default '',
  phone                 text,
  shipping_address      jsonb,
  amount_total_cents    integer not null default 0,
  currency              text not null default 'EUR',
  payment_status        text not null default 'unpaid',
  shipping_status       text not null default 'offen'
                        check (shipping_status in ('offen','in_bearbeitung','versendet','zugestellt')),
  created_at            timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_shipping_status_idx on public.orders (shipping_status);

-- ---------- Bestellpositionen ----------
create table if not exists public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders (id) on delete cascade,
  product_id       uuid references public.products (id) on delete set null,
  title            text not null,
  unit             text,
  quantity         integer not null check (quantity > 0),
  unit_price_cents integer not null default 0,
  total_cents      integer not null default 0
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ---------- Atomare Lagerreduktion (vom Stripe-Webhook aufgerufen) ----------
create or replace function public.decrement_stock(p_product_id uuid, p_quantity integer)
returns void
language sql
security definer
set search_path = public
as $$
  update public.products
  set stock = greatest(stock - p_quantity, 0),
      updated_at = now()
  where id = p_product_id;
$$;

-- ---------- Row Level Security ----------
-- Sämtliche Zugriffe laufen über die API-Routen mit dem Service-Role-Key
-- (der RLS umgeht). Für alle anderen Rollen bleibt alles gesperrt.
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
