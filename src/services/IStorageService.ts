/**
 * IStorageService.ts — Storage abstraction interface (Dependency Inversion Principle).
 *
 * All components and hooks depend on this interface, never on a concrete class.
 * The contract below is the only thing the UI layer needs to know about storage.
 *
 * To swap localStorage for an API backend in a future release:
 *   1. Create a new class that implements IStorageService
 *   2. Update storageService.ts to return the new class
 *   3. Zero changes required anywhere in the UI layer
 */

import type { Expense, CreateExpenseInput, UpdateExpenseInput } from '../types';

export interface IStorageService {
  /** Retrieve all stored expense records, ordered by insertion. */
  getAll(): Expense[];

  /** Find and return a single expense by its unique ID. Returns undefined if not found. */
  getById(id: string): Expense | undefined;

  /**
   * Persist a new expense record.
   * Auto-generates id, createdAt, and updatedAt — callers provide only the expense data.
   */
  create(input: CreateExpenseInput): Expense;

  /**
   * Apply partial updates to an existing expense by ID.
   * Unmodified fields are preserved. updatedAt is refreshed automatically.
   * Returns the updated record, or undefined if the ID does not exist.
   */
  update(id: string, input: UpdateExpenseInput): Expense | undefined;

  /**
   * Permanently remove an expense by ID.
   * Returns true if the record was found and deleted, false if the ID did not exist.
   */
  delete(id: string): boolean;

  /**
   * Replace the entire stored dataset in one operation.
   * Used by the recurring expense engine to write multiple new records
   * without triggering repeated read/write cycles.
   */
  saveAll(expenses: Expense[]): void;
}
