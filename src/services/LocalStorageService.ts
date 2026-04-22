/**
 * LocalStorageService.ts — localStorage implementation of IStorageService.
 *
 * This class is the ONLY place in the codebase that reads from or writes to
 * localStorage directly. Keeping all storage I/O in one place makes it easy
 * to audit data integrity, handle errors, and replace this class entirely
 * when a real backend is introduced (Single Responsibility + DIP).
 */

import { v4 as uuidv4 } from 'uuid';
import type { Expense, CreateExpenseInput, UpdateExpenseInput } from '../types';
import type { IStorageService } from './IStorageService';

/** The key under which all expense records are stored in localStorage. */
const STORAGE_KEY = 'expense_tracker_expenses';

export class LocalStorageService implements IStorageService {
  /**
   * Read and deserialise all expense records from localStorage.
   * Returns an empty array if no data exists or if the stored JSON is corrupted —
   * a corrupted store should never crash the app or leave the user stuck.
   */
  getAll(): Expense[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Expense[];
    } catch {
      console.error('[LocalStorageService] Failed to parse stored expenses — returning empty list.');
      return [];
    }
  }

  /** Find and return a single expense by ID, or undefined if it does not exist. */
  getById(id: string): Expense | undefined {
    return this.getAll().find((expense) => expense.id === id);
  }

  /**
   * Create a new expense record.
   * Generates a UUID and ISO timestamps automatically so callers stay clean of infrastructure concerns.
   */
  create(input: CreateExpenseInput): Expense {
    const now = new Date().toISOString();

    const newExpense: Expense = {
      ...input,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    const all = this.getAll();
    this._persist([...all, newExpense]);
    return newExpense;
  }

  /**
   * Merge partial updates into an existing expense record.
   * id and createdAt are immutable — the spread order below ensures they
   * cannot be overwritten even if a caller accidentally includes them in input.
   */
  update(id: string, input: UpdateExpenseInput): Expense | undefined {
    const all = this.getAll();
    const index = all.findIndex((expense) => expense.id === id);

    if (index === -1) return undefined;

    const updated: Expense = {
      ...all[index],   // existing values
      ...input,        // caller overrides
      id,              // id is immutable — always restored
      createdAt: all[index].createdAt,      // createdAt is immutable
      updatedAt: new Date().toISOString(),  // always stamp the edit time
    };

    all[index] = updated;
    this._persist(all);
    return updated;
  }

  /**
   * Delete an expense by ID.
   * Filters out the target record and re-persists the remaining list.
   * Returns false (without throwing) if the ID was not found.
   */
  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter((expense) => expense.id !== id);

    // If lengths are equal, no record matched — nothing to delete.
    if (filtered.length === all.length) return false;

    this._persist(filtered);
    return true;
  }

  /**
   * Overwrite the entire dataset in one write.
   * More efficient than calling create() in a loop when adding multiple records
   * (e.g. recurring expense generation on app load).
   */
  saveAll(expenses: Expense[]): void {
    this._persist(expenses);
  }

  /** Serialise and write the expense array to localStorage. */
  private _persist(expenses: Expense[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }
}
