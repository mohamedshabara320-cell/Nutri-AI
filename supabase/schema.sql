-- ============================================================
-- NUTRI-AI DATABASE SCHEMA (Supabase / Postgres)
-- ============================================================
create extension if not exists "uuid-ossp";

-- ---------- PROFILES ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  height_cm numeric not null,
  weight_kg numeric not null,
  age int not null,
  gender text not null check (gender in ('male','female')),
  activity_level text not null check (activity_level in
    ('sedentary','light','moderate','active','very_active')),
  goal text not null default 'weight_gain' check (goal in
    ('weight_gain','weight_loss','maintenance')),
  goal_weight_kg numeric,
  bmr numeric,
  tdee numeric,
  calorie_target numeric,
  protein_target_g numeric,
  carb_target_g numeric,
  fat_target_g numeric,
  water_target_ml numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- WEIGHT LOGS ----------
create table public.weight_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric not null,
  logged_at date not null default current_date,
  note text,
  created_at timestamptz default now(),
  unique (user_id, logged_at)
);

-- ---------- MEAL LOGS ----------
create table public.meal_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  raw_input text,
  input_type text not null default 'text' check (input_type in ('text','image')),
  image_url text,
  meal_name text,
  calories numeric not null default 0,
  protein_g numeric not null default 0,
  carbs_g numeric not null default 0,
  fat_g numeric not null default 0,
  items jsonb default '[]'::jsonb,        -- [{name, quantity, unit, calories, protein, carbs, fat}]
  logged_at date not null default current_date,
  meal_time timestamptz not null default now(),
  created_at timestamptz default now()
);

-- ---------- AI RECOMMENDATIONS ----------
create table public.meal_recommendations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  context jsonb,            -- remaining macros at time of generation
  suggestions jsonb,        -- AI-generated meal ideas
  created_at timestamptz default now()
);

-- ---------- DAILY SUMMARY VIEW ----------
create or replace view public.daily_summary as
select
  user_id,
  logged_at,
  sum(calories) as total_calories,
  sum(protein_g) as total_protein,
  sum(carbs_g) as total_carbs,
  sum(fat_g) as total_fat
from public.meal_logs
group by user_id, logged_at;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.weight_logs enable row level security;
alter table public.meal_logs enable row level security;
alter table public.meal_recommendations enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "weight_logs_all_own" on public.weight_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "meal_logs_all_own" on public.meal_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "meal_recs_all_own" on public.meal_recommendations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- STORAGE BUCKET for food images ----------
insert into storage.buckets (id, name, public)
values ('food-images', 'food-images', true)
on conflict (id) do nothing;

create policy "food_images_owner_rw"
on storage.objects for all
using (bucket_id = 'food-images' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'food-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
