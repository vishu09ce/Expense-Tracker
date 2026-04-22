/**
 * useExpenses.ts — Primary hook for all expense CRUD operations and filtering.
 *
 * This hook is the single point of contact between the React component tree
 * and the storage layer. Components call this hook and receive data + actions —
 * they never import storageService directly (Dependency Inversion at the React layer).
 *
 * State is initialised from storage on first render and kept in sync via
 * a refresh() call after every mutation. This avoids stale UI without needing
 * a global store or context for the data layer.
 */

import { useState, useCallback } from 'react';
import type { Expense, CreateExpenseInput, UpdateExpenseInput, ExpenseFilters } from '../types';
import { storageService } from '../services';

export function useExpenses() {
  /**
   * Load all expenses from storage once on mount.
   * The lazy initialiser function runs only on the first render, so subsequent
   * re-renders do not read from localStorage unnecessarily.
   */
  const [expenses, setExpenses] = useState<Expense[]>(() => storageService.getAll());

  /**
   * Re-read from storage and push the latest data into React state.
   * Called after every mutation so the UI stays consistent with persisted data.
   */
  const refresh = useCallback(() => {
    setExpenses(storageService.getAll());
  }, []);

  /** Persist a new expense and sync local state. */
  const addExpense = useCallback(
    (input: CreateExpenseInput): Expense => {
      const created = storageService.create(input);
      refresh();
      return created;
    },
    [refresh]
  );

  /** Apply partial updates to an existing expense and sync local state. */
  const editExpense = useCallback(
    (id: string, input: UpdateExpenseInput): Expense | undefined => {
      const updated = storageService.update(id, input);
      if (updated) refresh();
      return updated;
    },
    [refresh]
  );

  /** Delete an expense and sync local state. */
  const removeExpense = useCallback(
    (id: string): boolean => {
      const deleted = storageService.delete(id);
      if (deleted) refresh();
      return deleted;
    },
    [refresh]
  );

  /**
   * Filter the in-memory expense list against a set of criteria.
   * All active criteria are combined with AND logic — an expense must satisfy
   * every non-undefined filter to be included in the result (FR-13).
   *
   * Filtering runs client-side because all data is already in memory.
   * For 1,000 records (NFR-03) this is well within the 200ms interaction budget (NFR-02).
   */
  const getFilteredExpenses = useCallback(
    (filters: ExpenseFilters): Expense[] => {
      return expenses.filter((expense) => {
        // Date range — inclusive of both endpoints (FR-10)
        if (filters.startDate && expense.date < filters.startDate) return false;
        if (filters.endDate   && expense.date > filters.endDate)   return false;

        // Category match (FR-11)
        if (filters.category && expense.category !== filters.category) return false;

        // Description substring — case-insensitive (FR-12)
        if (filters.searchText) {
          const needle  = filters.searchText.toLowerCase();
          const haystack = (expense.description ?? '').toLowerCase();
          if (!haystack.includes(needle)) return false;
        }

        return true;
      });
    },
    [expenses]
  );

  return {
    /** The full, unfiltered list of all stored expenses. */
    expenses,

    /** Add a new expense. Returns the created record (with generated id + timestamps). */
    addExpense,

    /** Edit an existing expense. Returns the updated record, or undefined if not found. */
    editExpense,

    /** Delete an expense by ID. Returns true if deleted, false if not found. */
    removeExpense,

    /** Return a filtered subset of expenses based on the provided criteria (FR-10–FR-13). */
    getFilteredExpenses,

    /** Force a re-sync from storage — useful after bulk operations (e.g. recurring generation). */
    refresh,
  };
}
