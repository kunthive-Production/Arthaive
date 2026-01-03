-- Row Level Security policies

alter table deals enable row level security;
alter table investors enable row level security;
alter table sectors enable row level security;
alter table submissions enable row level security;

-- Deals: public read
create policy "deals_public_read" on deals
  for select using (true);

-- Investors: public read
create policy "investors_public_read" on investors
  for select using (true);

-- Sectors: public read
create policy "sectors_public_read" on sectors
  for select using (true);

-- Submissions: anyone can insert, only service role can read/update
create policy "submissions_public_insert" on submissions
  for insert with check (true);

create policy "submissions_service_read" on submissions
  for select using (auth.role() = 'service_role');

create policy "submissions_service_update" on submissions
  for update using (auth.role() = 'service_role');
