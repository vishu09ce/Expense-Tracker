/**
 * recurringUtils.ts — Recurring expense auto-generation logic (FR-25).
 *
 * On every app load this function inspects all recurring expenses and generates
 * new instance records for any that have come due. Multiple missed occurrences
 * are handled — the while-loop keeps advancing until nextOccurrence is in the future.
 *
 * Design decisions:
 *   - Generated instances are regular (non-recurring) expense records. The original
 *     "template" expense retains isRecurring: true and gets an updated nextOccurrence.
 *     This means the template stays in the list with the recurring badge (FR-27),
 *     while generated instances look like normal expenses.
 *   - All writes go through a single saveAll() call to avoid repeated localStorage
 *     read/write cycles when several recurring expenses are due simultaneously.
 *   - Cancelling recurring (FR-28) is handled by the edit flow setting
 *     isRecurring: false — this function then ignores that expense on subsequent loads.
 */

import { v4 as uuidv4 } from 'uuid';
import type { Expense } from '../types';
import type { IStorageService } from '../services/IStorageService';
import { todayISO, calculateNextOccurrence } from './dateUtils';

/**
 * Check all recurring expenses and generate instances for any that are due.
 *
 * @returns The number of new expense instances created — used by the caller to
 *          decide whether to refresh React state.
 */
export function processRecurringExpenses(storageService: IStorageService): number {
  const today = todayISO();
  const all   = storageService.getAll();

  // Only process expenses that are recurring, have a due date, and are overdue
  const dueTemplates = all.filter(
    (e) => e.isRecurring && e.nextOccurrence && e.frequency && e.nextOccurrence <= today
  );

  if (dueTemplates.length === 0) return 0; // nothing to do — skip the write

  const now = new Date().toISOString();
  const newInstances: Expense[]         = [];
  // Maps template id → the new nextOccurrence after all instances are generated
  const nextOccurrenceMap = new Map<string, string>();

  for (const template of dueTemplates) {
    // Guards already confirmed these are truthy — but TypeScript needs reassurance
    if (!template.nextOccurrence || !template.frequency) continue;

    let nextDate = template.nextOccurrence;

    // Generate one instance per missed period until we reach a future date
    while (nextDate <= today) {
      newInstances.push({
        id:          uuidv4(),
        date:        nextDate,
        amount:      template.amount,
        category:    template.category,
        description: template.description,
        isRecurring: false,   // instances are standalone records, not further recurring
        createdAt:   now,
        updatedAt:   now,
      });

      nextDate = calculateNextOccurrence(nextDate, template.frequency);
    }

    // Record the new nextOccurrence so we can update the template in one pass below
    nextOccurrenceMap.set(template.id, nextDate);
  }

  // Rebuild the full dataset: update templates + append new instances
  const updatedAll = all.map((expense) => {
    const newNext = nextOccurrenceMap.get(expense.id);
    return newNext
      ? { ...expense, nextOccurrence: newNext, updatedAt: now }
      : expense;
  });

  // One write operation for the entire batch (FR-25 efficiency)
  storageService.saveAll([...updatedAll, ...newInstances]);

  return newInstances.length;
}
