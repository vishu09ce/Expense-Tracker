/**
 * dateUtils.ts — Date formatting, parsing, and arithmetic helpers.
 *
 * All date values in the app are ISO 8601 strings (YYYY-MM-DD or full ISO timestamp).
 * These utilities keep date logic in one place so components stay clean.
 *
 * Important: dates are always parsed as LOCAL time (not UTC) to prevent the
 * "date shifts by one day" bug that occurs when JavaScript treats "2026-04-22"
 * as UTC midnight and the local timezone is behind UTC.
 */

import type { Frequency } from '../types';
import { Frequency as FrequencyValues } from '../types';

/**
 * Return today's date as a YYYY-MM-DD string in local time.
 * Used to pre-fill the date field when creating a new expense (FR-06).
 */
export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Format an ISO date string into a human-readable label for display in the UI.
 * "2026-04-22" → "Apr 22, 2026"
 */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  // Construct in local time to avoid the UTC-shift issue
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a numeric amount as a USD currency string.
 * 1234.5 → "$1,234.50"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate the next occurrence date for a recurring expense (FR-25).
 * Returns the ISO date string of the next instance after the given date.
 *
 * Month-end edge cases are handled: Jan 31 + Monthly = Feb 28 (or 29 in a leap year).
 * Feb 29 + Annual = Feb 28 in non-leap years.
 */
export function calculateNextOccurrence(isoDate: string, frequency: Frequency): string {
  const [y, m, d] = isoDate.split('-').map(Number);

  switch (frequency) {
    case FrequencyValues.Weekly: {
      // Add 7 days — JavaScript Date handles month/year rollovers automatically
      const next = new Date(y, m - 1, d + 7);
      return toISODateString(next);
    }
    case FrequencyValues.Monthly: {
      // Advance the month by one, capping the day at the last day of the target month
      const nextMonth = m === 12 ? 1 : m + 1;
      const nextYear  = m === 12 ? y + 1 : y;
      // Day 0 of a month is the last day of the previous month, giving us the cap
      const lastDayOfNextMonth = new Date(nextYear, nextMonth, 0).getDate();
      const nextDay = Math.min(d, lastDayOfNextMonth);
      return `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`;
    }
    case FrequencyValues.Annual: {
      // Advance the year by one; cap Feb 29 → Feb 28 in non-leap years
      const nextYear = y + 1;
      const lastDayOfMonth = new Date(nextYear, m, 0).getDate();
      const nextDay = Math.min(d, lastDayOfMonth);
      return `${nextYear}-${String(m).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`;
    }
  }
}

/** Convert a Date object to a YYYY-MM-DD ISO string in local time. */
function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
