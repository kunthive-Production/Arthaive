"""Supabase write helpers: sources, review_queue, pipeline_jobs."""
from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any

from supabase import Client, create_client


@dataclass
class JobStats:
    source_feed: str
    articles_fetched: int = 0
    articles_filtered: int = 0
    records_extracted: int = 0
    records_auto_approved: int = 0
    records_flagged: int = 0
    run_status: str = "success"  # 'success' | 'partial' | 'failed'
    error_log: str | None = None


_client: Client | None = None


def get_client() -> Client:
    global _client
    if _client is not None:
        return _client
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError(
            "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
        )
    _client = create_client(url, key)
    return _client


def insert_source(
    *,
    url: str,
    title: str | None,
    publication_date: str | None,
    publisher: str,
    reliability_tier: str,
    extraction_method: str,
    raw_text_snapshot: str | None,
) -> str | None:
    """Insert into `sources` (idempotent on url). Returns source id."""
    client = get_client()
    payload = {
        "source_type": "news_article",
        "title": title,
        "url": url,
        "publication_date": publication_date,
        "publisher": publisher,
        "reliability_tier": reliability_tier,
        "extraction_method": extraction_method,
        "raw_text_snapshot": raw_text_snapshot,
    }
    res = (
        client.table("sources")
        .upsert(payload, on_conflict="url")
        .execute()
    )
    if not res.data:
        return None
    return res.data[0]["id"]


def insert_review_item(
    *,
    source_id: str | None,
    extracted: dict[str, Any],
) -> str | None:
    client = get_client()
    suggested_company = extracted.get("company")
    confidence = extracted.get("confidence")
    payload = {
        "source_id": source_id,
        "raw_extracted_data": extracted,
        "suggested_company": suggested_company,
        "match_confidence": float(confidence) if isinstance(confidence, (int, float)) else None,
        "status": "pending",
    }
    res = client.table("review_queue").insert(payload).execute()
    if not res.data:
        return None
    return res.data[0]["id"]


def log_job_run(stats: JobStats) -> None:
    client = get_client()
    payload = {
        "source_feed": stats.source_feed,
        "articles_fetched": stats.articles_fetched,
        "articles_filtered": stats.articles_filtered,
        "records_extracted": stats.records_extracted,
        "records_auto_approved": stats.records_auto_approved,
        "records_flagged": stats.records_flagged,
        "run_status": stats.run_status,
        "error_log": stats.error_log,
    }
    client.table("pipeline_jobs").insert(payload).execute()
