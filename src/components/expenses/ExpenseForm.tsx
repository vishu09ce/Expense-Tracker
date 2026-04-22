/**
 * ExpenseForm.tsx — Add and edit form for expense records (FR-01, FR-02).
 *
 * Operates in two modes controlled by the `expense` prop:
 *   - Create mode (expense is undefined): all fields start empty except date (FR-06)
 *   - Edit mode (expense is provided): all fields are pre-filled from the record
 *
 * Validation rules:
 *   - date, amount, category are required (FR-07)
 *   - amount must be a positive number with at most 2 decimal places (FR-05)
 *   - frequency is required when isRecurring is true (FR-24)
 *   - description is optional (FR-07)
 */

import { useState } from 'react';
import type { Expense, CreateExpenseInput, Category, Frequency } from '../../types';
import { Frequency as FrequencyValues } from '../../types';
import { Button } from '../common';
import { todayISO, calculateNextOccurrence } from '../../utils';
import { ALL_CATEGORIES, getCategoryMeta } from '../../utils';

interface ExpenseFormProps {
  /** When provided, the form operates in edit mode and pre-fills all fields. */
  expense?: Expense;
  /** Called with the validated form data when the user submits. */
  onSave: (data: CreateExpenseInput) => void;
  /** Called when the user cancels without saving. */
  onCancel: () => void;
}

/** Internal form state — amount is kept as a string while the user types. */
interface FormState {
  date: string;
  amount: string;
  category: Category | '';
  description: string;
  isRecurring: boolean;
  frequency: Frequency | '';
}

interface FormErrors {
  date?: string;
  amount?: string;
  category?: string;
  frequency?: string;
}

/** Build the initial state from an existing expense (edit) or defaults (create). */
function buildInitialState(expense?: Expense): FormState {
  if (expense) {
    return {
      date:        expense.date,
      amount:      String(expense.amount),
      category:    expense.category,
      description: expense.description ?? '',
      isRecurring: expense.isRecurring,
      frequency:   expense.frequency ?? '',
    };
  }
  return {
    date:        todayISO(), // default to today (FR-06)
    amount:      '',
    category:    '',
    description: '',
    isRecurring: false,
    frequency:   '',
  };
}

/** Validate the current form state and return any errors. */
function validate(state: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!state.date) {
    errors.date = 'Date is required.';
  }

  if (!state.amount) {
    errors.amount = 'Amount is required.';
  } else {
    const parsed = parseFloat(state.amount);
    if (isNaN(parsed) || parsed <= 0) {
      errors.amount = 'Enter a valid positive amount.';
    } else if (!/^\d+(\.\d{0,2})?$/.test(state.amount)) {
      // Reject more than 2 decimal places (FR-05)
      errors.amount = 'Amount can have at most 2 decimal places.';
    }
  }

  if (!state.category) {
    errors.category = 'Category is required.';
  }

  if (state.isRecurring && !state.frequency) {
    errors.frequency = 'Frequency is required for recurring expenses.';
  }

  return errors;
}

export function ExpenseForm({ expense, onSave, onCancel }: ExpenseFormProps) {
  const [form, setForm]     = useState<FormState>(() => buildInitialState(expense));
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditMode = Boolean(expense);

  /** Update a single field and clear its error as the user types. */
  function handleChange<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  /** When the user unchecks isRecurring, clear the frequency so it doesn't linger. */
  function handleRecurringToggle(checked: boolean) {
    setForm((prev) => ({
      ...prev,
      isRecurring: checked,
      frequency:   checked ? prev.frequency : '',
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Parse and round the amount to exactly 2 decimal places before saving (FR-05)
    const amount = Math.round(parseFloat(form.amount) * 100) / 100;

    const data: CreateExpenseInput = {
      date:     form.date,
      amount,
      category: form.category as Category,
      // Store undefined for empty description so the field is truly absent (FR-07)
      description: form.description.trim() || undefined,
      isRecurring: form.isRecurring,
      frequency:       form.isRecurring ? (form.frequency as Frequency) : undefined,
      // Calculate and store the next occurrence date when creating a recurring expense
      nextOccurrence:  form.isRecurring
        ? calculateNextOccurrence(form.date, form.frequency as Frequency)
        : undefined,
    };

    onSave(data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">

        {/* Date field (FR-01, FR-06) */}
        <div>
          <label htmlFor="expense-date" className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="expense-date"
            type="date"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
            aria-required="true"
            aria-describedby={errors.date ? 'date-error' : undefined}
            className={`w-full px-3 py-2 border rounded-md text-sm text-gray-900
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              ${errors.date ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {errors.date && (
            <p id="date-error" className="mt-1 text-xs text-red-500" role="alert">
              {errors.date}
            </p>
          )}
        </div>

        {/* Amount field (FR-01, FR-05) */}
        <div>
          <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (USD) <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true">$</span>
            <input
              id="expense-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              required
              aria-required="true"
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              className={`w-full pl-7 pr-3 py-2 border rounded-md text-sm text-gray-900
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                ${errors.amount ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
          </div>
          {errors.amount && (
            <p id="amount-error" className="mt-1 text-xs text-red-500" role="alert">
              {errors.amount}
            </p>
          )}
        </div>

        {/* Category field (FR-01, FR-08, FR-09) */}
        <div>
          <label htmlFor="expense-category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="expense-category"
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value as Category | '')}
            required
            aria-required="true"
            aria-describedby={errors.category ? 'category-error' : undefined}
            className={`w-full px-3 py-2 border rounded-md text-sm text-gray-900
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              ${errors.category ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          >
            <option value="">Select a category…</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {getCategoryMeta(cat).label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p id="category-error" className="mt-1 text-xs text-red-500" role="alert">
              {errors.category}
            </p>
          )}
        </div>

        {/* Description field — optional (FR-07) */}
        <div>
          <label htmlFor="expense-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="expense-description"
            rows={2}
            placeholder="What was this expense for?"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Recurring toggle (FR-23) */}
        <div className="flex items-center gap-3 py-1">
          <input
            id="expense-recurring"
            type="checkbox"
            checked={form.isRecurring}
            onChange={(e) => handleRecurringToggle(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <label htmlFor="expense-recurring" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
            This is a recurring expense
          </label>
        </div>

        {/* Frequency field — only shown when recurring is checked (FR-24) */}
        {form.isRecurring && (
          <div>
            <label htmlFor="expense-frequency" className="block text-sm font-medium text-gray-700 mb-1">
              Frequency <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <select
              id="expense-frequency"
              value={form.frequency}
              onChange={(e) => handleChange('frequency', e.target.value as Frequency | '')}
              required
              aria-required="true"
              aria-describedby={errors.frequency ? 'frequency-error' : undefined}
              className={`w-full px-3 py-2 border rounded-md text-sm text-gray-900
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                ${errors.frequency ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            >
              <option value="">Select frequency…</option>
              {Object.values(FrequencyValues).map((freq) => (
                <option key={freq} value={freq}>
                  {freq}
                </option>
              ))}
            </select>
            {errors.frequency && (
              <p id="frequency-error" className="mt-1 text-xs text-red-500" role="alert">
                {errors.frequency}
              </p>
            )}
          </div>
        )}

      </div>

      {/* Form action buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {isEditMode ? 'Save Changes' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
}
