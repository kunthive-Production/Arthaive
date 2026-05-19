-- Extend the deals table with pipeline-quality metadata columns
-- These support the review workflow and future confidence tracking

alter table deals add column if not exists record_status text not null default 'verified'
  check (record_status in ('verified','needs_review','rejected','merged'));

alter table deals add column if not exists date_confidence text default 'exact'
  check (date_confidence in ('exact','month_only','quarter_only','estimated'));

alter table deals add column if not exists stage_confidence text default 'confirmed'
  check (stage_confidence in ('confirmed','inferred','uncertain'));

-- Link each deal back to its original source article
alter table deals add column if not exists source_id uuid references sources (id) on delete set null;

comment on column deals.record_status    is 'Verification state — only verified records show in public views';
comment on column deals.date_confidence  is 'How precisely the deal date is known';
comment on column deals.stage_confidence is 'How confident we are in the round type classification';
comment on column deals.source_id        is 'FK to the sources table — the article this deal was extracted from';

create index if not exists deals_record_status_idx on deals (record_status);
create index if not exists deals_source_id_idx     on deals (source_id);

-- Composite: verified deals by date (most common analytics query)
create index if not exists deals_verified_date_idx on deals (deal_date desc)
  where record_status = 'verified';
