"""Source registry and tunables for the ingestion pipeline."""
from __future__ import annotations

# Slug fragments that suggest a URL might be a funding announcement.
# Coarse pre-filter only — the AI extractor is the real gate.
FUNDING_SLUG_HINTS = (
    "raise", "raises", "raised",
    "funding", "funds",
    "series", "seed", "pre-seed",
    "round",
    "mn-", "-mn", "million",
    "crore", "-cr-", "cr-",
    "secures", "secured",
    "picks-up", "picks",
    "investment", "invests", "invested",
    "snippets",
    "acquires", "acquisition", "acquired",
    "valuation",
)

# URL fragments to exclude even if they match a hint (earnings, regulatory news).
FUNDING_SLUG_EXCLUDE = (
    "/fintrackr/",  # quarterly/annual earnings
    "/podcasts/",
    "/videos/",
    "-revenue-",
    "-profit-",
    "-loss-",
    "-q1-", "-q2-", "-q3-", "-q4-",
    "-fy2", "-fy-",
)

SOURCES: dict[str, dict] = {
    "entrackr": {
        "name": "Entrackr",
        "sitemap_index_url": "https://entrackr.com/sitemap.xml",
        "base_url": "https://entrackr.com",
        "publisher": "Entrackr",
        "reliability_tier": "tier_1",
        # Entrackr publishes one dated sitemap per day: sitemap_YYYY-MM-DD.xml
        "sitemap_mode": "daily",
        "daily_sitemap_pattern": r"sitemap_(\d{4}-\d{2}-\d{2})\.xml$",
        # CSS selectors tried in order to extract article body
        "article_body_selectors": [
            "article",
            "[itemprop='articleBody']",
            ".article-content",
            ".post-content",
            "main",
        ],
    },
    "inc42": {
        "name": "Inc42",
        "sitemap_index_url": "https://inc42.com/sitemap_index.xml",
        "base_url": "https://inc42.com",
        "publisher": "Inc42",
        "reliability_tier": "tier_1",
        # Inc42 is WordPress/Yoast: the index lists paginated post sitemaps
        # (post-sitemap.xml, post-sitemap2.xml ... post-sitemap55.xml) that
        # collectively reach back to 2015. Each sub-sitemap's <lastmod> marks
        # its newest article, so we can pick only the ones overlapping a window.
        "sitemap_mode": "paginated",
        "paginated_sitemap_pattern": r"post-sitemap\d*\.xml$",
        "article_body_selectors": [
            "article",
            "[itemprop='articleBody']",
            ".single-article-content",
            ".entry-content",
            ".post-content",
            "main",
        ],
    },
}

# Anthropic model for extraction. Haiku is cheap and accurate enough for this shape.
EXTRACTION_MODEL = "claude-haiku-4-5-20251001"

# Cap article body sent to the model and stored in sources.raw_text_snapshot
MAX_BODY_CHARS = 5000

# httpx defaults
HTTP_TIMEOUT_SECONDS = 20
HTTP_USER_AGENT = "IndStartupFundingBot/0.1 (+pipeline POC; contact: admin)"

# Wayback CDX
WAYBACK_AVAILABILITY_URL = "https://archive.org/wayback/available"
WAYBACK_TIMEOUT_SECONDS = 15

# Local SQLite cache for extractor responses (safe re-runs without re-paying for AI)
EXTRACTOR_CACHE_PATH = "pipeline/.extractor_cache.sqlite"
