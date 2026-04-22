/**
 * csvUtils.ts — CSV export utility (FR-20, FR-21, FR-22).
 *
 * All CSV logic is isolated here so the export format can be changed or extended
 * without touching any component (Single Responsibility Principle).
 *
 * The exported file includes every expense record (FR-20) with four columns:
 * date, amount, category, and description (FR-21). The filename contains
 * the export date for traceability (FR-22).
 */

import type { Expense } from '../types';
import { todayISO } from './dateUtils';

/**
 * Wrap a cell value in double quotes and escape any internal double quotes
 * by doubling them — the standard RFC 4180 CSV escaping rule.
 * This prevents values containing commas or quotes from breaking the file structure.
 */
function escapeCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Trigger a CSV download in the user's browser containing all provided expenses.
 *
 * Rows are sorted by date ascending so the file reads chronologically
 * from oldest to newest — the most natural order for a financial record.
 *
 * Does nothing if the expense list is empty.
 */
export function exportExpensesToCSV(expenses: Expense[]): void {
  if (expenses.length === 0) return;

  // Column headers — must match FR-21: date, amount, category, description
  const HEADERS = ['Date', 'Amount', 'Category', 'Description'];

  // Sort chronologically before writing — display order (newest first) is a UI concern
  const sorted = [...expenses].sort((a, b) => a.date.localeCompare(b.date));

  // Build each data row, safely escaping every cell
  const dataRows = sorted.map((expense) => [
    escapeCell(expense.date),
    escapeCell(expense.amount.toFixed(2)),  // always two decimal places in the file
    escapeCell(expense.category),
    escapeCell(expense.description ?? ''),  // empty string for optional field (FR-07)
  ]);

  // Combine header + data rows into a single CSV string
  const csvContent = [
    HEADERS.map(escapeCell).join(','),
    ...dataRows.map((row) => row.join(',')),
  ].join('\r\n'); // RFC 4180 mandates CRLF line endings

  // Filename includes today's date for traceability (FR-22)
  const filename = `expenses-${todayISO()}.csv`;

  // Trigger download via a temporary anchor element — avoids any popup blockers
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  // Clean up the temporary DOM element and object URL immediately
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
