/**
 * App.tsx — Root component and application shell.
 *
 * Responsibilities:
 *   - Top-level layout: sticky header with tab navigation, main content area
 *   - Tab state: "Dashboard" vs "Expenses" views
 *   - UI state: add/edit modal, delete confirmation dialog
 *   - Bridge user actions to useExpenses and useFilters hooks
 *
 * The dashboard always receives the full expense list (not the filtered list)
 * because totals and charts should reflect all-time data regardless of active filters.
 */

import { useState } from 'react';
import type { Expense, CreateExpenseInput } from './types';
import { useExpenses, useFilters } from './hooks';
import { Button, Modal, ConfirmDialog } from './components/common';
import { ExpenseList, ExpenseForm } from './components/expenses';
import { FilterPanel } from './components/filters';
import { Dashboard } from './components/dashboard';
import { exportExpensesToCSV } from './utils';

import { seedTestData, clearAllData, clearDemoData, DEMO_ACTIVE_KEY } from './utils/seedData';

/** The two top-level views in the application. */
type ActiveView = 'dashboard' | 'expenses';

function App() {
  const { expenses, addExpense, editExpense, removeExpense, getFilteredExpenses } =
    useExpenses();
  const { filters, hasActiveFilters, setFilter, clearFilters } = useFilters();

  // Which tab is currently shown
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  // Which expense is being edited (null = add mode)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showForm, setShowForm]             = useState(false);

  // Expense staged for deletion — drives the confirmation dialog (FR-03)
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  // Show the demo banner while the auto-seeded data is still active
  const [showDemoBanner, setShowDemoBanner] = useState(
    () => localStorage.getItem(DEMO_ACTIVE_KEY) === '1'
  );

  /** Apply filters only when at least one is active — avoids an unnecessary array pass. */
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

      {/* ── Sticky header with branding + tab nav + primary action ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Top row: logo + Add button */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              {/* Wallet icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Expense Tracker
              </span>
            </div>

            <Button variant="primary" onClick={handleAddClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Expense
            </Button>
          </div>

          {/* Tab navigation row */}
          <nav className="flex gap-1 -mb-px" aria-label="Main navigation">
            {(
              [
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'expenses',  label: 'Expenses'  },
              ] as { id: ActiveView; label: string }[]
            ).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                aria-current={activeView === id ? 'page' : undefined}
                className={[
                  'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none',
                  activeView === id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Demo data banner — visible until user clears or dismisses ── */}
      {showDemoBanner && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
            <p className="text-sm text-amber-800">
              You're viewing <strong>demo data</strong> — explore freely, then start fresh when you're ready.
            </p>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <button
                onClick={clearDemoData}
                className="text-xs font-medium px-3 py-1 bg-amber-500 text-white rounded
                  hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                Clear &amp; Start Fresh
              </button>
              <button
                onClick={() => setShowDemoBanner(false)}
                aria-label="Dismiss demo banner"
                className="text-amber-500 hover:text-amber-700 transition-colors text-lg leading-none
                  focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content area ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Dashboard tab (FR-15–FR-19) */}
        {activeView === 'dashboard' && (
          <Dashboard expenses={expenses} />
        )}

        {/* Expenses tab */}
        {activeView === 'expenses' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Expenses</h1>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  {expenses.length} {expenses.length === 1 ? 'record' : 'records'} total
                </span>

                {/* CSV export — always exports the full list, not just filtered results (FR-20) */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => exportExpensesToCSV(expenses)}
                  aria-label="Export all expenses to a CSV file"
                  disabled={expenses.length === 0}
                >
                  {/* Download icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Filters (FR-10–FR-14) */}
            <FilterPanel
              filters={filters}
              onChange={setFilter}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
              resultCount={displayedExpenses.length}
              totalCount={expenses.length}
            />

            {/* Expense list */}
            <ExpenseList
              expenses={displayedExpenses}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </>
        )}
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

      {/* ── Delete confirmation (FR-03) ── */}
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

      {/*
        ── Dev toolbar — only rendered in development builds (import.meta.env.DEV).
        Vite replaces this condition with `false` during `npm run build` so the
        toolbar and seedData module are completely excluded from the production bundle.
      */}
      {import.meta.env.DEV && (
        <div
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2
            bg-amber-50 border border-amber-300 rounded-lg px-3 py-2 shadow-lg"
          role="region"
          aria-label="Developer testing toolbar"
        >
          {/* Label — makes the toolbar's purpose unambiguous to any tester */}
          <span className="text-xs font-semibold text-amber-700 mr-1">DEV</span>

          <button
            onClick={seedTestData}
            className="px-3 py-1.5 text-xs font-medium bg-amber-500 text-white
              rounded hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
            title="Populate localStorage with 30 test expenses covering all RTM scenarios, then reload"
          >
            Load Test Data
          </button>

          <button
            onClick={clearAllData}
            className="px-3 py-1.5 text-xs font-medium bg-white text-amber-700
              border border-amber-300 rounded hover:bg-amber-100 transition-colors
              focus:outline-none focus:ring-2 focus:ring-amber-400"
            title="Wipe all expense data from localStorage and reload to a blank state"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
