/**
 * ExpenseList.tsx — Renders the full list of expense rows (FR-26).
 *
 * Responsibilities:
 *   - Sort expenses by date descending (most recent first) for display
 *   - Render an empty state when there are no expenses to show
 *   - Delegate individual row rendering to ExpenseRow (SRP)
 *
 * Sorting happens here rather than in the hook because it is a display concern,
 * not a data concern — the storage layer returns records in insertion order.
 */

import type { Expense } from '../../types';
import { ExpenseRow } from './ExpenseRow';

interface ExpenseListProps {
  /** The expenses to display — already filtered if filters are active. */
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        {/* Receipt icon */}
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <p className="text-sm font-medium">No expenses yet</p>
        <p className="text-xs mt-1">Click "Add Expense" to record your first one.</p>
      </div>
    );
  }

  // Sort by date descending so the most recent expense always appears at the top
  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Column headers */}
      <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="w-28 shrink-0">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</span>
        </div>
        <div className="w-24 shrink-0 text-right">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</span>
        </div>
        <div className="w-36 shrink-0">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</span>
        </div>
        <div className="flex-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</span>
        </div>
        {/* Empty header for the actions column — actions are revealed on hover */}
        <div className="w-32 shrink-0" aria-hidden="true" />
      </div>

      {/* Expense rows — divided by subtle separators */}
      <div className="divide-y divide-gray-100">
        {sorted.map((expense) => (
          <ExpenseRow
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Footer showing record count */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-right">
        <span className="text-xs text-gray-400">
          {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
        </span>
      </div>
    </div>
  );
}
