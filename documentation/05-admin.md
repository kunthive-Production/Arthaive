# 05 — Admin workflow

The admin console at `/admin` is where humans keep the data clean. Without humans, the pipeline would auto-approve confident extractions but everything ambiguous would pile up in `review_queue` forever. The whole "Phase 5 human verification" principle (P5) lives here.

## Who is an admin

Anyone whose email is in the `ADMIN_EMAILS` environment variable (comma-separated). Middleware checks Supabase auth and gates `/admin/*` routes accordingly. There is no admin-self-signup; you add an email to the env file or env var and redeploy.

## The pages

```
/admin                  Dashboard — counts, recent activity, links to sub-pages
/admin/review           Review queue — extracted records awaiting decisions
/admin/review/[id]      Single review item — full details, approve/reject/merge buttons
/admin/entities         Entity manager — canonical names and aliases for startups and investors
/admin/sources          Source registry — which publishers we crawl, their reliability tiers
/admin/pipeline         Pipeline logs — every run, counts, errors, status
/admin/import           Bulk import — upload CSVs of historical or hand-curated deals
/admin/export           Data export — pull the verified dataset as CSV / JSON
```

## The core loop — review queue

This is the workflow that runs daily. The pipeline writes ambiguous extractions to `review_queue`; the admin works through them.

### 1. The list view (`/admin/review`)

Shows all rows with `status='pending'` ordered by `created_at desc`. Each row is one extraction. Visible at a glance:

- Suggested company (from the entity resolver)
- Amount, stage, deal date, investors
- Match confidence (entity-resolution score)
- Source publisher and reliability tier
- A "duplicate of" hint if `notes` contains one

### 2. The detail view (`/admin/review/[id]`)

Opens a single record. Shows:

- The full extracted JSON (`raw_extracted_data`) — every field Claude returned, including its own self-rated confidence
- The source article — title, URL, publisher, the first 5000 chars we snapshotted
- The resolver's suggested company match
- If a duplicate was flagged, a link to the existing deal

The admin then takes one of four actions.

### 3. Admin actions

| Action | What happens to the DB |
|---|---|
| **Approve** | Insert a new row into `deals` (`record_status='verified'`); mark `review_queue.status='approved'`, set `reviewed_by` and `reviewed_at`. If the extracted name differed from the canonical resolver match, also insert into `startup_aliases` so future articles auto-resolve. (This last step is the Phase 5.4 auto-alias work — not yet wired; see [09-roadmap.md](09-roadmap.md).) |
| **Reject** | Mark `review_queue.status='rejected'` with `notes` explaining why. The record stays in the queue for audit but never enters `deals`. |
| **Merge** | Mark `review_queue.status='merged'`. Used when the record is a duplicate of an existing deal — optionally append the new source URL to the existing deal's source list. |
| **Needs more info** | Mark `review_queue.status='needs_more_info'`. Used when the article is unclear, the amount is "undisclosed", or the admin wants to come back to it. |

Every action writes to `reviewed_by` and `reviewed_at` for the audit trail.

## Entity manager (`/admin/entities`)

Manages the alias tables (`startup_aliases`, `investor_aliases`). Used when:

- A startup rebrands (e.g. Fashnear Technologies → Meesho) — add a former-name alias so future articles map correctly.
- A spelling variant shows up consistently (e.g. "Phone Pe" vs. "PhonePe") — add an alternate-spelling alias.
- An investor is referenced by short name in news (e.g. "Sequoia" instead of "Sequoia Capital India") — add a short-name alias.

The page shows canonical names with all their aliases, lets the admin add, edit, or delete entries.

**Why this matters:** every alias added here makes the entity resolver smarter for the next pipeline run. The seed data in `supabase/seed_aliases.sql` covers ~30 common cases at day one; the admin adds the rest as articles surface them.

## Sources (`/admin/sources`)

Manages the `sources` registry — which publishers we crawl, what their reliability tier is, what their sitemap URL is.

Today only Entrackr is configured (`pipeline/config.py:SOURCES`). Adding a new source is currently a code change, but this page is where the runtime registry lives once Phase 3.5 lifts source config from code into the DB.

| Tier | Examples | Meaning |
|---|---|---|
| `tier_1` | Entrackr, Inc42 | Direct verified reporting; high signal |
| `tier_2` | YourStory, business press | Reliable but sometimes rehashed |
| `tier_3` | Aggregators, social posts | Treat as discovery hints, not source of truth |

The pipeline's confidence scoring (future Phase 4 work) will weight source tier; today it just stores it.

## Pipeline (`/admin/pipeline`)

Reads `pipeline_jobs` and shows:

- The most recent run per source feed (status, when, counts)
- A timeline of past runs — green for success, amber for partial, red for failed
- Click into a run to see the error log

This is the "is the crawler healthy" dashboard. Set up an alert (e.g. PagerDuty) on `run_status='failed'` once we hit production cron.

## Bulk import (`/admin/import`)

Upload a CSV of deals (e.g. historical data from a research firm, a hand-curated batch). Same shape as `deals`. Goes through the same entity resolution and dedup pipeline as automated extractions, but with `extraction_method='manual'` on the resulting `sources` rows.

Used for:
- Backfilling historical deals from CSV exports
- Bulk-loading deals from a partner data feed
- Recovering from a pipeline outage

## Data export (`/admin/export`)

Downloads the verified dataset as CSV or JSON. Filters available — date range, sector, stage, etc.

Powered by `app/api/admin/export/route.ts`. Streams rows so large exports do not OOM the function.

## The audit principle

Every admin action is recorded. `reviewed_by` and `reviewed_at` on `review_queue`, `created_at` and `updated_at` on `deals`. We do not have an explicit audit log table yet — when we need full who-did-what-to-which-row history, we will add one (`PROJECT_REFERENCE.md §10.3`).

## What a typical admin day looks like

1. Open `/admin/pipeline` — confirm last night's run was green.
2. Open `/admin/review` — see N pending items.
3. For each: check the source article (it is one click), confirm the company name and amount, check for duplicates, approve / reject / merge.
4. While approving, notice "Sequoia India" was the raw name and "Peak XV Partners" was the suggested. Confirm — once Phase 5.4 ships, this also writes the alias automatically. Today, you alias it manually in `/admin/entities`.
5. Once a week, glance at `/admin/sources` to confirm tier ratings are still right; the press's reliability shifts.
6. Once a month, export the dataset from `/admin/export` and spot-check 20 random rows against the original articles.

A diligent admin can clear ~50 pending review items in 30 minutes once entity resolution starts pre-suggesting correctly. The first week is slower while the alias table is being built up.
