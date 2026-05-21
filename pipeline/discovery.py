"""Sitemap walker: yields candidate article URLs in a date window."""
from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import date, datetime
from typing import Iterator

import httpx
from lxml import etree

from pipeline.config import (
    FUNDING_SLUG_EXCLUDE,
    FUNDING_SLUG_HINTS,
    HTTP_TIMEOUT_SECONDS,
    HTTP_USER_AGENT,
    SOURCES,
)

SITEMAP_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


@dataclass
class Candidate:
    url: str
    lastmod: str | None


def _client() -> httpx.Client:
    return httpx.Client(
        headers={"User-Agent": HTTP_USER_AGENT},
        timeout=HTTP_TIMEOUT_SECONDS,
        follow_redirects=True,
    )


def _parse_xml(content: bytes) -> etree._Element:
    return etree.fromstring(content)


def _fetch_xml(client: httpx.Client, url: str) -> etree._Element | None:
    try:
        r = client.get(url)
        if r.status_code != 200:
            return None
        return _parse_xml(r.content)
    except (httpx.HTTPError, etree.XMLSyntaxError):
        return None


def _slug_matches(url: str) -> bool:
    lower = url.lower()
    if any(bad in lower for bad in FUNDING_SLUG_EXCLUDE):
        return False
    return any(hint in lower for hint in FUNDING_SLUG_HINTS)


def _daily_sitemaps(client: httpx.Client, source_key: str, since: date) -> list[str]:
    cfg = SOURCES[source_key]
    root = _fetch_xml(client, cfg["sitemap_index_url"])
    if root is None:
        return []
    pat = re.compile(cfg["daily_sitemap_pattern"])
    out: list[tuple[date, str]] = []
    for loc in root.findall(".//sm:sitemap/sm:loc", SITEMAP_NS):
        href = (loc.text or "").strip()
        m = pat.search(href)
        if not m:
            continue
        try:
            d = datetime.strptime(m.group(1), "%Y-%m-%d").date()
        except ValueError:
            continue
        if d >= since:
            out.append((d, href))
    out.sort(key=lambda x: x[0], reverse=True)  # newest first
    return [h for _, h in out]


def discover_urls(source_key: str, since: date, limit: int | None = None) -> Iterator[Candidate]:
    """Yield Candidate(url, lastmod) for articles published on/after `since`."""
    if source_key not in SOURCES:
        raise KeyError(f"unknown source: {source_key}")

    yielded = 0
    with _client() as client:
        for sitemap_url in _daily_sitemaps(client, source_key, since):
            root = _fetch_xml(client, sitemap_url)
            if root is None:
                continue
            for url_el in root.findall(".//sm:url", SITEMAP_NS):
                loc_el = url_el.find("sm:loc", SITEMAP_NS)
                if loc_el is None or not (loc_el.text or "").strip():
                    continue
                url = loc_el.text.strip()
                if not _slug_matches(url):
                    continue
                lastmod_el = url_el.find("sm:lastmod", SITEMAP_NS)
                lastmod = lastmod_el.text.strip() if lastmod_el is not None and lastmod_el.text else None
                yield Candidate(url=url, lastmod=lastmod)
                yielded += 1
                if limit is not None and yielded >= limit:
                    return
