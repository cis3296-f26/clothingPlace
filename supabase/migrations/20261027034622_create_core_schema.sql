-- Core schema: identity + catalog.
-- Money is stored as integer cents (2499 = $24.99).
-- *_path columns hold a file path in Supabase Storage, not a URL.

-- Identity 

-- One row per user, created automatically by the trigger at the bottom.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_path text,
  role text not null default 'shopper' check (role in ('shopper', 'vendor')),
  style_quiz_completed boolean not null default false
);

-- A brand/shop owned by a vendor user.
create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  slug text not null unique,
  bio text,
  neighborhood text,
  logo_path text,
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180)
);

-- Shared taxonomy 

-- Tree of categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.categories (id) on delete set null
);

-- Style labels used by the style quiz and recommendations.
create table public.style_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

-- Catalog 

create table public.products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  description text
);

-- One size + color of a product, with its own price and stock.
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null,
  color text not null,
  sku text,
  price_cents integer not null check (price_cents >= 0),
  stock_qty integer not null default 0 check (stock_qty >= 0),
  unique (product_id, size, color)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  position integer not null default 0
);

-- Style tag join tables 

create table public.product_style_tags (
  product_id uuid not null references public.products (id) on delete cascade,
  style_tag_id uuid not null references public.style_tags (id) on delete cascade,
  primary key (product_id, style_tag_id)
);

-- Tags a shopper picked in the style quiz.
create table public.profile_style_tags (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  style_tag_id uuid not null references public.style_tags (id) on delete cascade,
  weight integer not null default 1,
  primary key (profile_id, style_tag_id)
);

-- Indexes for foreign keys quicker queries

create index on public.vendors (owner_id);
create index on public.products (vendor_id);
create index on public.products (category_id);
create index on public.product_variants (product_id);
create index on public.product_images (product_id);
create index on public.product_style_tags (style_tag_id);
create index on public.profile_style_tags (style_tag_id);

-- Create a profile automatically when someone signs up 

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'display_name',
    case when new.raw_user_meta_data ->> 'role' = 'vendor' then 'vendor' else 'shopper' end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
