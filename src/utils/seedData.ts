/**
 * seedData.ts — Demo data, first-visit seeding, and dev testing utilities.
 *
 * Provides a realistic 6-month expense history used in two ways:
 *   1. Production — auto-seeded on first visit so new users see a fully
 *      populated dashboard instead of an empty state (see autoSeedIfFirstVisit).
 *   2. Development — the DEV toolbar in App.tsx exposes manual seed/clear
 *      buttons for RTM verification without needing to manually enter data.
 *
 * Coverage by requirement group:
 *   FR-01–07  All field types: required fields, optional description, decimal amounts
 *   FR-08–09  All 6 categories represented
 *   FR-10–14  Expenses spread across 6 months — date range and category filters have
 *             meaningful results; description search has matching and non-matching rows
 *   FR-15–19  Enough data for all dashboard totals and chart bars to render
 *   FR-20–22  Non-empty list enables CSV export with a dated filename
 *   FR-23–29  Four recurring templates:
 *               - Monthly rent          (nextOccurrence in future)
 *               - Monthly gym           (nextOccurrence in future)
 *               - Annual car insurance  (nextOccurrence in future)
 *               - Weekly coffee shop    (nextOccurrence in the PAST → tests FR-25
 *                 auto-generation on first app load after seeding)
 */

import { v4 as uuidv4 } from 'uuid';
import type { Expense } from '../types';
import { Category, Frequency } from '../types';
import type { IStorageService } from '../services';
import { storageService } from '../services';

/**
 * Permanent flag — set once after the first auto-seed so the app never
 * re-seeds even if the user later deletes all their own expenses.
 */
export const DEMO_SEEDED_KEY = 'expense_tracker_seeded';

/**
 * Session flag — set alongside DEMO_SEEDED_KEY and cleared when the user
 * clicks "Clear & Start Fresh". Drives the demo banner visibility.
 */
export const DEMO_ACTIVE_KEY = 'expense_tracker_demo_active';

/**
 * Build a complete Expense object from the minimum required fields.
 * Timestamps use the expense date at midnight UTC for realism.
 */
function makeExpense(
  fields: Pick<Expense, 'date' | 'amount' | 'category'> &
    Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>
): Expense {
  const ts = `${fields.date}T00:00:00.000Z`;
  return {
    id:            uuidv4(),
    isRecurring:   false,
    createdAt:     ts,
    updatedAt:     ts,
    ...fields,
  };
}

/**
 * The full test dataset — 26 regular expenses across 6 months + 4 recurring templates.
 * Amounts are realistic consumer spending figures (USD).
 */
export const SEED_EXPENSES: Expense[] = [

  // ── November 2025 ────────────────────────────────────────────────────────────
  makeExpense({ date: '2025-11-05', amount: 45.50,  category: Category.Food,          description: 'Weekly grocery run' }),
  makeExpense({ date: '2025-11-12', amount: 25.00,  category: Category.Transportation, description: 'Uber to airport' }),
  makeExpense({ date: '2025-11-20', amount: 89.99,  category: Category.Shopping,       description: 'Winter jacket' }),
  makeExpense({ date: '2025-11-28', amount: 35.00,  category: Category.Entertainment,  description: 'Cinema tickets' }),

  // ── December 2025 ────────────────────────────────────────────────────────────
  makeExpense({ date: '2025-12-03', amount: 62.30,  category: Category.Food,          description: 'Christmas groceries' }),
  makeExpense({ date: '2025-12-10', amount: 75.00,  category: Category.Transportation, description: 'Monthly train pass' }),
  makeExpense({ date: '2025-12-15', amount: 250.00, category: Category.Shopping,       description: 'Christmas gifts' }),
  makeExpense({ date: '2025-12-22', amount: 85.00,  category: Category.Bills,          description: 'Electricity bill' }),
  makeExpense({ date: '2025-12-28', amount: 45.00,  category: Category.Entertainment,  description: 'New Year dinner' }),

  // ── January 2026 ─────────────────────────────────────────────────────────────
  makeExpense({ date: '2026-01-07', amount: 55.80,  category: Category.Food,          description: 'Weekly groceries' }),
  makeExpense({ date: '2026-01-14', amount: 45.00,  category: Category.Transportation, description: 'Monthly bus pass' }),
  makeExpense({ date: '2026-01-20', amount: 12.99,  category: Category.Entertainment,  description: 'Music streaming' }),
  // No description — verifies FR-07 (description is optional)
  makeExpense({ date: '2026-01-25', amount: 30.00,  category: Category.Other }),

  // ── February 2026 ────────────────────────────────────────────────────────────
  makeExpense({ date: '2026-02-10', amount: 120.00, category: Category.Entertainment,  description: 'Concert tickets' }),
  makeExpense({ date: '2026-02-14', amount: 65.00,  category: Category.Shopping,       description: "Valentine's flowers and dinner" }),
  makeExpense({ date: '2026-02-20', amount: 58.40,  category: Category.Food,          description: 'Grocery shopping' }),
  makeExpense({ date: '2026-02-25', amount: 95.00,  category: Category.Bills,          description: 'Phone bill' }),

  // ── March 2026 ───────────────────────────────────────────────────────────────
  makeExpense({ date: '2026-03-05', amount: 48.60,  category: Category.Food,          description: 'Weekly groceries' }),
  makeExpense({ date: '2026-03-12', amount: 18.50,  category: Category.Transportation, description: 'Taxi ride' }),
  makeExpense({ date: '2026-03-18', amount: 199.99, category: Category.Shopping,       description: 'Running shoes' }),
  makeExpense({ date: '2026-03-22', amount: 75.00,  category: Category.Bills,          description: 'Internet bill' }),

  // ── April 2026 (current month) ───────────────────────────────────────────────
  makeExpense({ date: '2026-04-03', amount: 52.75,  category: Category.Food,          description: 'Weekly grocery run' }),
  makeExpense({ date: '2026-04-08', amount: 14.99,  category: Category.Entertainment,  description: 'Streaming service' }),
  makeExpense({ date: '2026-04-15', amount: 45.00,  category: Category.Shopping,       description: 'Book collection' }),
  makeExpense({ date: '2026-04-18', amount: 120.00, category: Category.Bills,          description: 'Internet bill' }),
  makeExpense({ date: '2026-04-20', amount: 28.50,  category: Category.Food,          description: 'Lunch out' }),

  // ── Recurring templates ──────────────────────────────────────────────────────

  // Monthly rent — nextOccurrence is in the future so it does NOT auto-generate on load.
  // Tests FR-23 (recurring flag), FR-24 (frequency), FR-26 (appears in list), FR-27 (badge).
  makeExpense({
    date:           '2025-11-01',
    amount:         1200.00,
    category:       Category.Bills,
    description:    'Monthly rent',
    isRecurring:    true,
    frequency:      Frequency.Monthly,
    nextOccurrence: '2026-05-01',
  }),

  // Monthly gym membership — future nextOccurrence. Tests FR-28 (cancel without deleting).
  makeExpense({
    date:           '2026-01-15',
    amount:         49.99,
    category:       Category.Bills,
    description:    'Gym membership',
    isRecurring:    true,
    frequency:      Frequency.Monthly,
    nextOccurrence: '2026-05-15',
  }),

  // Annual car insurance — tests Frequency.Annual and FR-24.
  makeExpense({
    date:           '2026-01-15',
    amount:         850.00,
    category:       Category.Bills,
    description:    'Annual car insurance',
    isRecurring:    true,
    frequency:      Frequency.Annual,
    nextOccurrence: '2027-01-15',
  }),

  /*
   * Weekly coffee shop — nextOccurrence is deliberately set to a PAST date (2026-04-08).
   * On the first app load after seeding, processRecurringExpenses will auto-generate
   * instances for every missed weekly period up to today, demonstrating FR-25.
   * With today = 2026-04-22 and frequency = Weekly, expect instances on:
   *   2026-04-08, 2026-04-15, 2026-04-22  (3 auto-generated records)
   * The template's nextOccurrence will be advanced to 2026-04-29.
   */
  makeExpense({
    date:           '2026-04-01',
    amount:         5.50,
    category:       Category.Food,
    description:    'Weekly coffee shop',
    isRecurring:    true,
    frequency:      Frequency.Weekly,
    nextOccurrence: '2026-04-08', // PAST — triggers FR-25 auto-generation on load
  }),
];

/**
 * Seed demo data on the very first visit.
 * DEMO_SEEDED_KEY is set permanently so this never runs twice — even if the
 * user deletes all their expenses, they will not be re-seeded on the next load.
 * Returns true when seeding happened so the caller can show a welcome banner.
 */
export function autoSeedIfFirstVisit(storage: IStorageService): boolean {
  if (localStorage.getItem(DEMO_SEEDED_KEY)) return false;
  // Don't overwrite data that existed before this feature was introduced
  if (storage.getAll().length > 0) {
    localStorage.setItem(DEMO_SEEDED_KEY, '1');
    return false;
  }
  storage.saveAll(SEED_EXPENSES);
  localStorage.setItem(DEMO_SEEDED_KEY, '1');
  localStorage.setItem(DEMO_ACTIVE_KEY, '1');
  return true;
}

/**
 * Clear all expense data and the demo-active flag, then reload.
 * DEMO_SEEDED_KEY is intentionally preserved so auto-seeding never runs again.
 */
export function clearDemoData(): void {
  storageService.saveAll([]);
  localStorage.removeItem(DEMO_ACTIVE_KEY);
  window.location.reload();
}

/**
 * Write the full test dataset to localStorage and reload the page.
 * The reload triggers processRecurringExpenses, which auto-generates the
 * overdue coffee shop instances — demonstrating FR-25 in a single action.
 *
 * Any existing data is replaced — this is intentional for a clean test baseline.
 */
export function seedTestData(): void {
  storageService.saveAll(SEED_EXPENSES);
  window.location.reload();
}

/**
 * Wipe all expense data from localStorage and reload to a blank state.
 * Useful for resetting between test runs.
 */
export function clearAllData(): void {
  storageService.saveAll([]);
  window.location.reload();
}
