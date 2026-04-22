/**
 * useFilters.ts — Filter state management hook (FR-10–FR-14).
 *
 * Keeps all filter state in one place and exposes a clean API to components.
 * The hook is decoupled from both the storage layer and the UI — it only
 * knows about the ExpenseFilters shape (Single Responsibility Principle).
 *
 * Design decision: undefined fields mean "no filter applied" rather than
 * empty strings. This avoids false positives where an empty string accidentally
 * matches the filter logic in getFilteredExpenses.
 */

import { useState, useCallback } from 'react';
import type { ExpenseFilters } from '../types';

export function useFilters() {
  const [filters, setFilters] = useState<ExpenseFilters>({});

  /**
   * Whether any filter criterion is currently active.
   * Used to conditionally show the "Clear" button and the result-count summary.
   */
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ''
  );

  /**
   * Merge partial updates into the current filter state.
   * Empty string values are coerced to undefined so inactive fields are truly absent.
   * This keeps getFilteredExpenses logic simple — it only checks for truthy values.
   */
  const setFilter = useCallback((updates: Partial<ExpenseFilters>) => {
    setFilters((prev) => {
      const merged = { ...prev, ...updates };

      // Strip any key whose value is empty/undefined — keeps the object clean
      const cleaned: ExpenseFilters = {};
      for (const [key, value] of Object.entries(merged)) {
        if (value !== undefined && value !== '') {
          (cleaned as Record<string, unknown>)[key] = value;
        }
      }
      return cleaned;
    });
  }, []);

  /**
   * Reset all filters in a single action (FR-14).
   * The empty object causes getFilteredExpenses to return the full expense list.
   */
  const clearFilters = useCallback(() => setFilters({}), []);

  return {
    /** The current set of active filter criteria. */
    filters,
    /** True when at least one filter criterion has a value. */
    hasActiveFilters,
    /** Apply partial filter updates — empty/undefined values are stripped automatically. */
    setFilter,
    /** Remove all active filters at once (FR-14). */
    clearFilters,
  };
}
