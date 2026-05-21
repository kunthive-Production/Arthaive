"""Wayback Machine availability API client for dead-link recovery."""
from __future__ import annotations

from dataclasses import dataclass

import httpx

from pipeline.config import (
    HTTP_USER_AGENT,
    WAYBACK_AVAILABILITY_URL,
    WAYBACK_TIMEOUT_SECONDS,
)


@dataclass
class Snapshot:
    archive_url: str
    timestamp: str  # e.g. "20210315120000"


def find_snapshot(url: str) -> Snapshot | None:
    try:
        r = httpx.get(
            WAYBACK_AVAILABILITY_URL,
            params={"url": url},
            headers={"User-Agent": HTTP_USER_AGENT},
            timeout=WAYBACK_TIMEOUT_SECONDS,
            follow_redirects=True,
        )
    except httpx.HTTPError:
        return None
    if r.status_code != 200:
        return None
    data = r.json()
    closest = (data.get("archived_snapshots") or {}).get("closest") or {}
    if not closest.get("available"):
        return None
    return Snapshot(
        archive_url=closest["url"],
        timestamp=closest.get("timestamp", ""),
    )
