/**
 * Dashboard.tsx — Composes all dashboard sections (FR-15–FR-19).
 *
 * This component owns no state — it receives the expense list, derives metrics
 * via useDashboard, and delegates rendering to focused sub-components.
 * FR-19 (real-time updates) is satisfied because expenses is React state from
 * the parent; any mutation causes a re-render, which recomputes metrics here.
 */

import type { Expense } from '../../types';
import { useDashboard } from '../../hooks/useDashboard';
import { formatCurrency } from '../../utils';
import { SummaryCard } from './SummaryCard';
import { SpendingChart } from './SpendingChart';
import { CategoryBreakdown } from './CategoryBreakdown';

interface DashboardProps {
  /** The full unfiltered expense list — dashboard always reflects all data. */
  expenses: Expense[];
}

export function Dashboard({ expenses }: DashboardProps) {
  const { allTimeTotal, currentMonthTotal, categoryTotals, monthlyTotals } =
    useDashboard(expenses);

  // Empty state — shown when there are no expenses to analyse yet
  if (expenses.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-4 opacity-40"
          aria-hidden="true"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <p className="text-sm font-medium">No data yet</p>
        <p className="text-xs mt-1">Add your first expense to see your dashboard.</p>
      </div>
    );
  }

  // Derive a subtitle for the current month card
  const now = new Date();
  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-5">

      {/* ── Summary cards row (FR-15, FR-16, FR-17) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* All-time total (FR-15) */}
        <SummaryCard
          title="All-Time Spending"
          value={formatCurrency(allTimeTotal)}
          subtitle={`Across ${expenses.length} ${expenses.length === 1 ? 'expense' : 'expenses'}`}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />

        {/* This month (FR-16) */}
        <SummaryCard
          title="This Month"
          value={formatCurrency(currentMonthTotal)}
          subtitle={monthName}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />

        {/* Top category (FR-17) — shows the highest-spend category as a headline */}
        <SummaryCard
          title="Top Category"
          value={categoryTotals[0] ? categoryTotals[0].category : '—'}
          subtitle={
            categoryTotals[0]
              ? `${formatCurrency(categoryTotals[0].total)} (${categoryTotals[0].percentage.toFixed(0)}% of total)`
              : 'No expenses yet'
          }
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />
      </div>

      {/* ── Spending over time chart (FR-18) ── */}
      <SpendingChart data={monthlyTotals} />

      {/* ── Category breakdown (FR-17) ── */}
      <CategoryBreakdown totals={categoryTotals} />
    </div>
  );
}
