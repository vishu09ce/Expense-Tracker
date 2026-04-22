/**
 * ExpenseRow.tsx — A single row in the expense list (FR-26, FR-27).
 *
 * Displays all fields of an expense in a compact, scannable layout.
 * Recurring expenses are visually distinguished via RecurringBadge (FR-27).
 * Edit and Delete actions are scoped to the row so each row is self-contained (SRP).
 */

import type { Expense } from '../../types';
import { Button } from '../common';
import { RecurringBadge } from './RecurringBadge';
import { formatDate, formatCurrency, getCategoryMeta } from '../../utils';

interface ExpenseRowProps {
  expense: Expense;
  /** Called when the user clicks the edit button for this row. */
  onEdit: (expense: Expense) => void;
  /** Called when the user clicks the delete button for this row. */
  onDelete: (expense: Expense) => void;
}

export function ExpenseRow({ expense, onEdit, onDelete }: ExpenseRowProps) {
  const categoryMeta = getCategoryMeta(expense.category);

  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors group">

      {/* Date column */}
      <div className="w-28 shrink-0">
        <span className="text-sm text-gray-600">{formatDate(expense.date)}</span>
      </div>

      {/* Amount column — right-aligned for numeric readability */}
      <div className="w-24 shrink-0 text-right">
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(expense.amount)}
        </span>
      </div>

      {/* Category badge */}
      <div className="w-36 shrink-0">
        <span
          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            color:           categoryMeta.color,
            backgroundColor: categoryMeta.bgColor,
          }}
        >
          {categoryMeta.label}
        </span>
      </div>

      {/* Description and recurring badge — takes remaining space */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {expense.description && (
          <span className="text-sm text-gray-600 truncate" title={expense.description}>
            {expense.description}
          </span>
        )}
        {/* Recurring indicator shown alongside description (FR-27) */}
        {expense.isRecurring && expense.frequency && (
          <RecurringBadge frequency={expense.frequency} />
        )}
      </div>

      {/* Action buttons — only fully visible on row hover to reduce visual clutter */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(expense)}
          aria-label={`Edit expense: ${expense.description ?? expense.category} on ${expense.date}`}
        >
          {/* Pencil icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(expense)}
          aria-label={`Delete expense: ${expense.description ?? expense.category} on ${expense.date}`}
          className="text-red-400 hover:text-red-600 hover:bg-red-50"
        >
          {/* Trash icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
          Delete
        </Button>
      </div>
    </div>
  );
}
