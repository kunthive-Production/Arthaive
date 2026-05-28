-- Phase 8 — Public API v1: API key registry.
-- Raw keys are never stored; we keep a SHA-256 hex hash and compare on each request.

create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  key_hash text not null unique,           -- sha256 hex of the raw key
  key_prefix text not null,                -- first 8 chars, for UI display
  label text,                              -- user-supplied app name
  email text not null,
  requests_today int not null default 0,
  last_reset date not null default current_date,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_api_keys_email on api_keys(email);
create index if not exists idx_api_keys_revoked on api_keys(revoked_at) where revoked_at is null;

alter table api_keys enable row level security;

-- Only the service-role key can read/write this table. No RLS policies = locked down
-- for anon/authenticated roles. The /api/api-keys route uses supabaseAdmin.
