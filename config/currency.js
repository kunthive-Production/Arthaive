// Currency Conversion Configuration
// Update this rate as USD to INR exchange rate changes
// Last updated: 2025-11-30

// Period-correct USD→INR annual averages for the 2005–2014 historical backfill.
// The rupee traded far stronger then (~₹40–61/USD), so converting old deals at
// today's flat rate would badly distort cross-currency figures. 2015+ uses the
// flat USD_TO_INR below, exactly preserving the existing dataset's values.
// MUST stay in sync with pipeline/fx_rates.py.
const USD_TO_INR_BY_YEAR = {
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
};

module.exports = {
  // Current USD to INR conversion rate (default for 2015+ and unknown years)
  // Check current rate at: https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=INR
  USD_TO_INR: 83.50,

  // Period-correct annual averages for 2005–2014.
  USD_TO_INR_BY_YEAR,

  // USD→INR rate for a given deal year: period rate for 2005–2014, flat 83.5 otherwise.
  // Accepts a year number, a Date, or a 'YYYY-MM-DD' string.
  rateForYear(year) {
    if (year instanceof Date) year = year.getFullYear();
    else if (typeof year === 'string') year = parseInt(year.slice(0, 4), 10);
    if (!Number.isFinite(year)) return 83.50;
    return USD_TO_INR_BY_YEAR[year] || 83.50;
  },

  // Last update date (for reference)
  LAST_UPDATED: '2025-11-30',

  // Instructions to update:
  // 1. Check current USD to INR rate
  // 2. Update USD_TO_INR value above
  // 3. Update LAST_UPDATED date
  // 4. Run: npm run generate-data
  // 5. Restart dev server if running
};
