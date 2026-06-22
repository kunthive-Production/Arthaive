"""Period-correct USD→INR rates, keyed by deal year.

The pipeline historically crossed INR↔USD with a single flat rate (₹83.5, the
late-2025 spot rate). That is fine for the 2015→present dataset but badly
distorts the 2005–2014 historical backfill, when the rupee traded around
₹40–61/USD. This module supplies an annual-average rate per year so cross-
currency figures are period-correct.

Design contract (must stay in sync with config/currency.js `rateForYear`):
  * 2005–2014 → that year's annual-average USD→INR rate.
  * 2015 and later → the flat DEFAULT_RATE (83.5), exactly preserving the
    existing dataset's displayed values. (Truer period rates for 2015+ are a
    separate, optional future improvement — intentionally not done here.)

The 2005–2014 values are RBI/market annual averages rounded to the rupee; the
backfill's amounts carry far more uncertainty than sub-rupee FX precision, so
annual granularity is the right altitude.
"""
from __future__ import annotations

# Flat rate used for 2015+ — keep equal to config/currency.js USD_TO_INR and
# pipeline.write_csv._USD_TO_INR.
DEFAULT_RATE = 83.5

# Annual-average USD→INR for the historical window (rounded to the rupee).
_USD_TO_INR_BY_YEAR: dict[int, float] = {
    2005: 44.0,
    2006: 45.0,
    2007: 41.0,
    2008: 43.0,
    2009: 48.0,
    2010: 46.0,
    2011: 47.0,
    2012: 53.0,
    2013: 58.0,
    2014: 61.0,
}


def usd_to_inr(year: int | None) -> float:
    """USD→INR rate for a deal year. Falls back to DEFAULT_RATE for 2015+,
    unknown, or None years so existing behaviour is preserved."""
    if year is None:
        return DEFAULT_RATE
    return _USD_TO_INR_BY_YEAR.get(int(year), DEFAULT_RATE)


def year_of(deal_date: str | None) -> int | None:
    """Extract the year from a 'YYYY-MM-DD' (or 'YYYY...') string; None if absent."""
    if not deal_date:
        return None
    try:
        return int(str(deal_date)[:4])
    except (ValueError, TypeError):
        return None
