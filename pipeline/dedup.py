"""Dedup helpers — URL-level and deal-level."""
from __future__ import annotations

from datetime import date, timedelta

from pipeline.queue import get_client


def is_url_seen(url: str) -> bool:
    client = get_client()
    res = (
        client.table("sources")
        .select("id", count="exact")
        .eq("url", url)
        .limit(1)
        .execute()
    )
    return bool(res.data)


def find_duplicate_deal(
    *,
    company: str,
    amount_inr: float,
    deal_date: str | None,
    window_days: int = 30,
    amount_tolerance: float = 0.10,
) -> str | None:
    """Find an existing deal that likely represents the same funding event.

    Match rules: identical company name (already entity-resolved) AND deal_date within
    ±window_days AND amount within ±amount_tolerance. Returns the existing deal id, or None.
    """
    if not company or not deal_date:
        return None

    try:
        target = date.fromisoformat(deal_date)
    except (TypeError, ValueError):
        return None

    lo = (target - timedelta(days=window_days)).isoformat()
    hi = (target + timedelta(days=window_days)).isoformat()

    client = get_client()
    q = (
        client.table("deals")
        .select("id, amount_inr, deal_date")
        .eq("company", company)
        .gte("deal_date", lo)
        .lte("deal_date", hi)
        .limit(20)
        .execute()
    )

    if not q.data:
        return None

    if amount_inr <= 0:
        return q.data[0]["id"]

    low = amount_inr * (1 - amount_tolerance)
    high = amount_inr * (1 + amount_tolerance)
    for row in q.data:
        existing = float(row.get("amount_inr") or 0)
        if existing <= 0:
            continue
        if low <= existing <= high:
            return row["id"]
    return None
