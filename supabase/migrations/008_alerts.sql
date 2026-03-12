-- Deal alerts: notify when new deals match criteria
create table if not exists public.alerts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  sector text,
  stage text,
  min_amount numeric,
  active boolean default true not null,
  created_at timestamptz default now() not null
);

alter table public.alerts enable row level security;
create policy "Users manage own alerts" on public.alerts
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index on public.alerts(user_id) where active = true;
