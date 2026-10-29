# Seeding the database

This is a handoff doc for whoever fills in `supabase/seed.sql`. It covers what to
install, which commands to run, and the non-obvious rules about this schema.

You only need to edit **`supabase/seed.sql`**. Everything here runs against your
local Docker database — no cloud project, no API keys, no `.env`.

## 1. Get the code

```bash
git clone https://github.com/cis3296-f26/clothingPlace.git
cd clothingPlace
git switch supabase
```

Use the `supabase` branch. The schema and `config.toml` live there; `main` does
not have them yet, and `README.md` still mentions `skeleton` — ignore that part.

## 2. Install prerequisites

| Requirement | Notes |
| --- | --- |
| Git | to clone |
| Docker Desktop | must be **running** before any `supabase` command |
| Supabase CLI | `brew install supabase/tap/supabase` (or use `npx supabase@latest <cmd>` everywhere below) |

Roughly 7 GB of free disk for the first start. No Node/`npm install` needed for
this task.

Sanity check before continuing:

```bash
docker info    # must print server info, not "permission denied"
supabase --version
```

## 3. Start the local stack

From the repo root (the directory containing `supabase/`):

```bash
supabase start     # first run pulls images, ~5 minutes
supabase status    # shows Studio URL, API URL, DB URL, anon key
```

Local services you get:

- Studio (table browser/SQL editor): <http://127.0.0.1:54323>
- API: <http://127.0.0.1:54321>
- Postgres: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

## 4. The loop you'll actually live in

`config.toml` already wires the seed file up, so no extra flags are needed:

```toml
[db.seed]
enabled = true
sql_paths = ["./seed.sql"]
```

Reset wipes the database, replays every migration in
`supabase/migrations/`, then runs `seed.sql`:

```bash
supabase db reset
```

This is your primary feedback loop — it prints the failing line number when the
seed errors out. To run *only* the seed without dropping the database (faster
while iterating):

```bash
docker exec -i supabase_db_clothingPlace psql -U postgres -d postgres \
  < supabase/seed.sql
```

Then inspect the result in Studio at <http://127.0.0.1:54323>.

When you're done for the day:

```bash
supabase stop --no-backup
```

## 5. The schema

Read `supabase/migrations/20261027034622_create_core_schema.sql` fully — it's
126 lines and is the source of truth. Summary of insert order (foreign keys
force this sequence):

1. `auth.users` → trigger creates `public.profiles`
2. `auth.identities` (only needed if seeded users should log in)
3. `public.categories`, `public.style_tags` (no dependencies)
4. `public.vendors` → needs a `profiles` row with `role = 'vendor'`
5. `public.products` → needs a vendor, may reference a category
6. `public.product_variants`, `public.product_images`, `public.product_style_tags`
7. `public.profile_style_tags`

### Gotcha 1: never insert into `public.profiles`

`profiles.id` is a foreign key to `auth.users`, and a trigger creates the
profile row for you on every `auth.users` insert:

```sql
create function public.handle_new_user()
...
insert into public.profiles (id, display_name, role)
values (
  new.id,
  new.raw_user_meta_data ->> 'display_name',
  case when new.raw_user_meta_data ->> 'role' = 'vendor' then 'vendor' else 'shopper' end
);
```

So seed users by inserting into `auth.users` and passing the profile fields
through `raw_user_meta_data`. Inserting into `profiles` first is an FK
violation; inserting into both is a duplicate-key violation.

### Gotcha 2: money is integer cents

`price_cents = 2499` renders as $24.99. There are no decimal money columns.

### Gotcha 3: `*_path` columns are storage paths, not URLs

`avatar_path`, `logo_path`, `storage_path` hold keys inside a Supabase Storage
bucket. No bucket is created by the migrations yet, so either seed
`storage.buckets` + `storage.objects` rows yourself or leave the columns `null`
and let the app fall back to a placeholder image.

### Gotcha 4: variants are unique per size + color

`product_variants` has `unique (product_id, size, color)` — one row per
size/color combination, each with its own `price_cents` and `stock_qty`.

## 6. Starting skeleton

Copy this into `supabase/seed.sql` and build on it. Fixed UUIDs make the rest of
the file readable.

```sql
-- supabase/seed.sql
-- Runs after all migrations on `supabase db reset`.
-- Schema: supabase/migrations/20261027034622_create_core_schema.sql

-- 1. Auth users. The on_auth_user_created trigger creates public.profiles
--    from raw_user_meta_data. Do NOT insert into public.profiles directly.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'authenticated', 'authenticated', 'maya@example.com',
   extensions.crypt('password123', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"display_name":"Maya"}',
   now(), now()),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222',
   'authenticated', 'authenticated', 'priya@example.com',
   extensions.crypt('password123', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"display_name":"Priya","role":"vendor"}', now(), now());

-- 2. Identities — only needed so these users can actually sign in from the app.
insert into auth.identities (provider_id, user_id, identity_data, provider,
                             last_sign_in_at, created_at, updated_at)
select u.id::text, u.id,
       jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
       'email', now(), now(), now()
from auth.users u;

-- 3. Vendors (owner_id must be a profile with role = 'vendor').
insert into public.vendors (id, owner_id, name, slug, bio, neighborhood, logo_path, lat, lng)
values ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222',
        'Priya Basics', 'priya-basics', 'Everyday basics and workwear.',
        'South Philadelphia', null, 39.9330, -75.1670);

-- 4. categories, style_tags, products, product_variants,
--    product_images, product_style_tags, profile_style_tags ...
```

`Personas.md` in the repo root is the intended content source: the vendors and
products should plausibly serve Maya, Jordan, Marcus, Priya, Denise, and Andre.
Use real Philadelphia neighborhoods plus `lat`/`lng` inside the city.

## 7. Target content

- 2–3 vendor accounts, ~2 shopper accounts
- ~8–12 categories (some nested via `parent_id`) and ~10 style tags
- ~5 vendors with neighborhood + coordinates
- ~15–20 products, 2–4 variants each, tagged with style tags
- A couple of shoppers with `profile_style_tags` so recommendations have data

## 8. Definition of done

```bash
supabase db reset     # exits 0 with no ERROR lines
```

Row-count check:

```bash
docker exec -i supabase_db_clothingPlace psql -U postgres -d postgres -c \
  "select 'profiles'  as t, count(*) from public.profiles
   union all select 'vendors',  count(*) from public.vendors
   union all select 'products', count(*) from public.products
   union all select 'variants', count(*) from public.product_variants;"
```

`profiles` should be non-zero even though the seed never inserts into it — that
proves the trigger fired.

Then branch, commit, and open a PR into `supabase`:

```bash
git switch -c seed-data
git add supabase/seed.sql supabase/SEEDING.md
git commit -m "feat: seed vendors, products, and demo users"
git push -u origin seed-data
```

## Note on RLS (not your task)

There are no row-level-security policies in `supabase/migrations/` yet. Seeding
works because it runs as `postgres`, but until policies land the app's anon key
can read and write every table. Don't "fix" this inside `seed.sql` — it belongs
in its own migration.
