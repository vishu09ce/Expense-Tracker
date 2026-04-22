/**
 * dashboardUtils.ts — Pure calculation functions for dashboard metrics.
 *
 * All computations are pure functions (no side effects, no React) so they are
 * easy to reason about and straightforward to unit-test in isolation.
 * The hook layer (useDashboard) wraps these with useMemo for memoisation.
 */

import type { Expense, Category } from '../types';
import { ALL_CATEGORIES } from './categoryUtils';

/** Spending total and percentage share for a single category (FR-17). */
export interface CategoryTotal {
  category: Category;
  /** Sum of all expense amounts in this category. */
  total: number;
  /** Percentage of all-time spending this category represents. */
  percentage: number;
}

/** Aggregated spending for one calendar month — used as a chart data point (FR-18). */
export interface MonthlyTotal {
  /** ISO month key: "YYYY-MM". Used for sorting and as the chart data key. */
  month: string;
  /** Human-readable label shown on the chart x-axis: "Jan 2026". */
  label: string;
  /** Total spending in this month, rounded to 2 decimal places. */
  total: number;
}

/** All metrics computed from the expense list for the dashboard view. */
export interface DashboardMetrics {
  /** Sum of all expense amounts across all time (FR-15). */
  allTimeTotal: number;
  /** Sum of expense amounts whose date falls in the current calendar month (FR-16). */
  currentMonthTotal: number;
  /** Per-category totals, sorted by amount descending, categories with £0 excluded (FR-17). */
  categoryTotals: CategoryTotal[];
  /** Monthly aggregates sorted chronologically for the spending chart (FR-18). */
  monthlyTotals: MonthlyTotal[];
}

/**
 * Derive all dashboard metrics from the full expense list.
 * Called inside useMemo so it only reruns when the expenses array reference changes.
 */
export function computeDashboardMetrics(expenses: Expense[]): DashboardMetrics {
  // ── All-time total (FR-15) ──────────────────────────────────────────────────
  const allTimeTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  // ── Current month total (FR-16) ─────────────────────────────────────────────
  const now = new Date();
  // Build "YYYY-MM" prefix for the current month to match against expense dates
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthTotal = expenses
    .filter((e) => e.date.startsWith(currentMonthPrefix))
    .reduce((sum, e) => sum + e.amount, 0);

  // ── By-category breakdown (FR-17) ───────────────────────────────────────────
  const catMap = new Map<Category, number>();
  for (const e of expenses) {
    catMap.set(e.category, (catMap.get(e.category) ?? 0) + e.amount);
  }
  const categoryTotals: CategoryTotal[] = ALL_CATEGORIES
    .map((cat) => {
      const total = catMap.get(cat) ?? 0;
      return {
        category: cat,
        total: Math.round(total * 100) / 100,
        // Avoid division by zero when there are no expenses
        percentage: allTimeTotal > 0 ? (total / allTimeTotal) * 100 : 0,
      };
    })
    .filter((c) => c.total > 0)         // hide categories with no spending
    .sort((a, b) => b.total - a.total); // highest spend first

  // ── Monthly totals for the chart (FR-18) ────────────────────────────────────
  const monthMap = new Map<string, number>();
  for (const e of expenses) {
    const month = e.date.substring(0, 7); // extract "YYYY-MM" from ISO date
    monthMap.set(month, (monthMap.get(month) ?? 0) + e.amount);
  }
  const monthlyTotals: MonthlyTotal[] = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b)) // chronological order
    .map(([month, total]) => ({
      month,
      label: formatMonthLabel(month),
      total: Math.round(total * 100) / 100,
    }));

  return { allTimeTotal, currentMonthTotal, categoryTotals, monthlyTotals };
}

/**
 * Convert an ISO month key ("2026-04") into a short readable label ("Apr 2026").
 * Constructed in local time to stay consistent with how dates are stored.
 */
function formatMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
