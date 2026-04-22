/**
 * expense.ts — Core domain types for the Expense Tracker.
 *
 * All type definitions live here so any module can import them without
 * creating circular dependencies. Adding a new category or frequency in the
 * future is a single-line change in this file (Open/Closed Principle).
 */

/**
 * The six supported spending categories (FR-08).
 * Defined as a const object rather than an enum — `erasableSyntaxOnly: true` in tsconfig
 * disallows enums because they emit runtime JS. This pattern gives identical usage
 * (Category.Food, Category.Transportation, etc.) with no runtime overhead.
 */
export const Category = {
  Food:           'Food',
  Transportation: 'Transportation',
  Entertainment:  'Entertainment',
  Shopping:       'Shopping',
  Bills:          'Bills',
  Other:          'Other',
} as const;

/** Union type of all valid category string values — used for type-safe field assignments. */
export type Category = typeof Category[keyof typeof Category];

/**
 * Recurrence intervals for recurring expenses (FR-24).
 * Same const-object pattern as Category — avoids enum emission while preserving type safety.
 */
export const Frequency = {
  Weekly:  'Weekly',
  Monthly: 'Monthly',
  Annual:  'Annual',
} as const;

/** Union type of all valid frequency string values. */
export type Frequency = typeof Frequency[keyof typeof Frequency];

/**
 * Canonical shape of an expense record as stored and retrieved.
 * Every field maps directly to the data model in the requirements document (Section 5.1).
 */
export interface Expense {
  /** UUID — auto-generated on creation, never changes. */
  id: string;

  /** ISO 8601 date string for when the expense occurred (e.g. "2026-04-22"). */
  date: string;

  /** USD amount stored as a number; must not exceed two decimal places (FR-05). */
  amount: number;

  /** Must be one of the six fixed categories — enforced at the form layer (FR-09). */
  category: Category;

  /** Optional free-text description; all other fields are required (FR-07). */
  description?: string;

  /** Whether this expense auto-generates future occurrences on a schedule (FR-23). */
  isRecurring: boolean;

  /** Required when isRecurring is true; drives next-occurrence calculation (FR-24). */
  frequency?: Frequency;

  /** ISO 8601 date of the next auto-generated instance; null when recurring is cancelled. */
  nextOccurrence?: string;

  /** ISO 8601 timestamp set once at record creation — immutable thereafter. */
  createdAt: string;

  /** ISO 8601 timestamp updated on every edit to track the most recent change. */
  updatedAt: string;
}

/**
 * Input shape for creating a new expense.
 * Omits auto-generated fields so callers cannot accidentally supply them —
 * the service layer owns id, createdAt, and updatedAt.
 */
export type CreateExpenseInput = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Input shape for editing an existing expense.
 * All editable fields are optional so callers pass only what changed.
 * The service layer stamps updatedAt automatically on every update.
 */
export type UpdateExpenseInput = Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>;
