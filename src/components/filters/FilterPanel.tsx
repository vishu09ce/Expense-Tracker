/**
 * FilterPanel.tsx — Combined filter and search controls (FR-10–FR-14).
 *
 * Renders all four filter dimensions in a single panel:
 *   - Start date and end date for date range filtering (FR-10)
 *   - Category dropdown (FR-11)
 *   - Description text search (FR-12)
 *
 * All controls are active simultaneously — the parent combines them with AND logic
 * via getFilteredExpenses (FR-13). A single "Clear" button resets everything (FR-14).
 *
 * The panel is always visible so users can see what filters are available
 * without needing to open a drawer or modal.
 */

import type { ExpenseFilters } from '../../types';
import type { Category } from '../../types';
import { ALL_CATEGORIES, getCategoryMeta } from '../../utils';

interface FilterPanelProps {
  /** Current active filter values. */
  filters: ExpenseFilters;
  /** Called with partial updates when any filter control changes. */
  onChange: (updates: Partial<ExpenseFilters>) => void;
  /** Resets all filters to their empty state (FR-14). */
  onClear: () => void;
  /** Whether at least one filter is currently active — drives Clear button visibility. */
  hasActiveFilters: boolean;
  /** Number of expenses shown after applying current filters. */
  resultCount: number;
  /** Total number of expenses before any filtering. */
  totalCount: number;
}

export function FilterPanel({
  filters,
  onChange,
  onClear,
  hasActiveFilters,
  resultCount,
  totalCount,
}: FilterPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">

      {/* Filter controls row — wraps to multiple lines on small screens */}
      <div className="flex flex-wrap gap-3 items-end">

        {/* ── Start date (FR-10) ── */}
        <div className="flex flex-col gap-1 min-w-0">
          <label
            htmlFor="filter-start-date"
            className="text-xs font-medium text-gray-500 uppercase tracking-wide"
          >
            From
          </label>
          <input
            id="filter-start-date"
            type="date"
            value={filters.startDate ?? ''}
            max={filters.endDate}         // prevent start > end at the browser level
            onChange={(e) => onChange({ startDate: e.target.value || undefined })}
            aria-label="Filter from date"
            className="px-3 py-2 text-sm border border-gray-200 rounded-md text-gray-900
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* ── End date (FR-10) ── */}
        <div className="flex flex-col gap-1 min-w-0">
          <label
            htmlFor="filter-end-date"
            className="text-xs font-medium text-gray-500 uppercase tracking-wide"
          >
            To
          </label>
          <input
            id="filter-end-date"
            type="date"
            value={filters.endDate ?? ''}
            min={filters.startDate}       // prevent end < start at the browser level
            onChange={(e) => onChange({ endDate: e.target.value || undefined })}
            aria-label="Filter to date"
            className="px-3 py-2 text-sm border border-gray-200 rounded-md text-gray-900
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* ── Category dropdown (FR-11) ── */}
        <div className="flex flex-col gap-1 min-w-0">
          <label
            htmlFor="filter-category"
            className="text-xs font-medium text-gray-500 uppercase tracking-wide"
          >
            Category
          </label>
          <select
            id="filter-category"
            value={filters.category ?? ''}
            onChange={(e) =>
              onChange({ category: (e.target.value as Category) || undefined })
            }
            aria-label="Filter by category"
            className="px-3 py-2 text-sm border border-gray-200 rounded-md text-gray-900
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {getCategoryMeta(cat).label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Description search (FR-12) ── */}
        <div className="flex flex-col gap-1 flex-1 min-w-40">
          <label
            htmlFor="filter-search"
            className="text-xs font-medium text-gray-500 uppercase tracking-wide"
          >
            Search
          </label>
          <div className="relative">
            {/* Magnifying glass icon — decorative, so aria-hidden */}
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="filter-search"
              type="search"
              placeholder="Search descriptions…"
              value={filters.searchText ?? ''}
              onChange={(e) => onChange({ searchText: e.target.value || undefined })}
              aria-label="Search expense descriptions"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md text-gray-900
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* ── Clear all button — only shown when at least one filter is active (FR-14) ── */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            aria-label="Clear all active filters"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium
              text-gray-500 hover:text-gray-700 hover:bg-gray-100
              rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400
              self-end"
          >
            {/* X icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear filters
          </button>
        )}
      </div>

      {/* ── Result summary — shown when filters are active so the user knows data is filtered ── */}
      {hasActiveFilters && (
        <p className="text-xs text-gray-400 mt-3" role="status" aria-live="polite">
          {/* Text (not just colour) communicates that a filter is active (NFR-10) */}
          Showing <span className="font-semibold text-gray-600">{resultCount}</span> of{' '}
          <span className="font-semibold text-gray-600">{totalCount}</span>{' '}
          {totalCount === 1 ? 'expense' : 'expenses'}
        </p>
      )}
    </div>
  );
}
