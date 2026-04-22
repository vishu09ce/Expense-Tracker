/**
 * App.tsx — Root component and application shell.
 *
 * Responsibilities:
 *   - Compose the top-level layout: header, filters, expense list
 *   - Own UI state for the add/edit modal and delete confirmation dialog
 *   - Bridge user actions to useExpenses and useFilters hooks
 *
 * This component is intentionally thin — all data and filter logic live in
 * hooks; all rendering is delegated to feature components (Single Responsibility).
 * The dashboard will be added in Phase 5 without restructuring this file.
 */

import { useState } from 'react';
import type { Expense, CreateExpenseInput } from './types';
import { useExpenses, useFilters } from './hooks';
import { Button, Modal, ConfirmDialog } from './components/common';
import { ExpenseList, ExpenseForm } from './components/expenses';
import { FilterPanel } from './components/filters';

function App() {
  const { expenses, addExpense, editExpense, removeExpense, getFilteredExpenses } = useExpenses();
  const { filters, hasActiveFilters, setFilter, clearFilters } = useFilters();

  // Which expense is currently being edited (null = add mode)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Controls visibility of the add/edit form modal
  const [showForm, setShowForm] = useState(false);

  // The expense staged for deletion — drives the confirmation dialog (FR-03)
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  /**
   * The list that drives the ExpenseList component.
   * When no filters are active we skip the filtering pass entirely for efficiency.
   */
  const displayedExpenses = hasActiveFilters
    ? getFilteredExpenses(filters)
    : expenses;

  // ── Event handlers ──────────────────────────────────────────────────────────

  function handleAddClick() {
    setEditingExpense(null);
    setShowForm(true);
  }

  function handleEditClick(expense: Expense) {
    setEditingExpense(expense);
    setShowForm(true);
  }

  function handleDeleteClick(expense: Expense) {
    setDeletingExpense(expense);
  }

  function handleFormSave(data: CreateExpenseInput) {
    if (editingExpense) {
      editExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
    handleFormClose();
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingExpense(null);
  }

  function handleDeleteConfirm() {
    if (deletingExpense) {
      removeExpense(deletingExpense.id);
      setDeletingExpense(null);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navigation bar ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Wallet icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Expense Tracker
            </span>
          </div>

          <Button variant="primary" onClick={handleAddClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Expense
          </Button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Expenses</h1>
          <span className="text-sm text-gray-400">
            {expenses.length} {expenses.length === 1 ? 'record' : 'records'} total
          </span>
        </div>

        {/* Filter panel — always visible so controls are discoverable (FR-10–FR-14) */}
        <FilterPanel
          filters={filters}
          onChange={setFilter}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
          resultCount={displayedExpenses.length}
          totalCount={expenses.length}
        />

        {/* Expense list — shows filtered or full list depending on filter state */}
        <ExpenseList
          expenses={displayedExpenses}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </main>

      {/* ── Add / Edit modal ── */}
      <Modal
        isOpen={showForm}
        onClose={handleFormClose}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          expense={editingExpense ?? undefined}
          onSave={handleFormSave}
          onCancel={handleFormClose}
        />
      </Modal>

      {/* ── Delete confirmation dialog (FR-03) ── */}
      <ConfirmDialog
        isOpen={Boolean(deletingExpense)}
        title="Delete Expense"
        message={
          deletingExpense
            ? `Delete the ${deletingExpense.category} expense of $${deletingExpense.amount.toFixed(2)} on ${deletingExpense.date}? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingExpense(null)}
      />
    </div>
  );
}

export default App;
