/**
 * filters.ts — Types for the filtering and search system (FR-10–FR-14).
 *
 * All filter criteria are optional so they can be combined freely.
 * An undefined field means "no filter applied for this dimension".
 * All active criteria are combined with AND logic (FR-13).
 */

import { Category } from './expense';

export interface ExpenseFilters {
  /** ISO 8601 date — include only expenses on or after this date (FR-10). */
  startDate?: string;

  /** ISO 8601 date — include only expenses on or before this date (FR-10). */
  endDate?: string;

  /** Include only expenses of this category (FR-11). */
  category?: Category;

  /** Case-insensitive substring match against the expense description (FR-12). */
  searchText?: string;
}
