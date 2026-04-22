/**
 * useDashboard.ts — Memoised hook for all dashboard metrics (FR-15–FR-19).
 *
 * Wraps computeDashboardMetrics in useMemo so the potentially expensive
 * aggregation over up to 1,000 records (NFR-03) only reruns when the
 * expenses array reference actually changes — not on every render.
 *
 * FR-19 (real-time updates) is satisfied automatically: useExpenses keeps
 * expenses in React state, so any CRUD mutation updates the reference,
 * triggers a recompute here, and re-renders the dashboard in the same cycle.
 */

import { useMemo } from 'react';
import type { Expense } from '../types';
import { computeDashboardMetrics } from '../utils/dashboardUtils';
import type { DashboardMetrics } from '../utils/dashboardUtils';

export function useDashboard(expenses: Expense[]): DashboardMetrics {
  // expenses is the dependency — changes to it invalidate the memo
  return useMemo(() => computeDashboardMetrics(expenses), [expenses]);
}
