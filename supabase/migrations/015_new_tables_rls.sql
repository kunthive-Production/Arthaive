-- Row Level Security for the new pipeline tables
-- Public can read sources and pipeline logs (transparency)
-- Only service_role can write to any of them

-- sources
alter table sources enable row level security;

create policy "sources_public_read"   on sources for select using (true);
create policy "sources_service_insert" on sources for insert with check (auth.role() = 'service_role');
create policy "sources_service_update" on sources for update using (auth.role() = 'service_role');

-- review_queue (admin-only, not public)
alter table review_queue enable row level security;

create policy "review_queue_service_all" on review_queue
  using (auth.role() = 'service_role');

-- pipeline_jobs (public read for transparency, service write)
alter table pipeline_jobs enable row level security;

create policy "pipeline_jobs_public_read"    on pipeline_jobs for select using (true);
create policy "pipeline_jobs_service_insert" on pipeline_jobs for insert
  with check (auth.role() = 'service_role');

-- startup_aliases (public read, service write)
alter table startup_aliases enable row level security;

create policy "startup_aliases_public_read"    on startup_aliases for select using (true);
create policy "startup_aliases_service_insert" on startup_aliases for insert
  with check (auth.role() = 'service_role');
create policy "startup_aliases_service_update" on startup_aliases for update
  using (auth.role() = 'service_role');

-- investor_aliases (public read, service write)
alter table investor_aliases enable row level security;

create policy "investor_aliases_public_read"    on investor_aliases for select using (true);
create policy "investor_aliases_service_insert" on investor_aliases for insert
  with check (auth.role() = 'service_role');
create policy "investor_aliases_service_update" on investor_aliases for update
  using (auth.role() = 'service_role');
