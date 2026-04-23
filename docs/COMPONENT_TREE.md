# Component Tree

Full React component hierarchy for the Expense Tracker app.

---

## Tree

```
App.tsx  (root — shell, tab nav, modal state, demo banner)
│
├── <header>  (sticky — branding, tab nav, Add Expense button)
│   └── Button  [variant=primary]  → opens add form
│
├── Demo Banner  (conditional — shown while DEMO_ACTIVE_KEY is set)
│   └── Button  [variant=secondary]  → clearDemoData()
│
├── Dashboard  (activeView === 'dashboard')
│   ├── SummaryCard  × 3
│   │     • All-time total
│   │     • Current month total
│   │     • Total expense count
│   ├── SpendingChart
│   │     • Recharts ResponsiveContainer > BarChart
│   │     • X-axis: month labels  |  Y-axis: $ amount
│   └── CategoryBreakdown
│         • Category label + formatted total + percentage bar
│         • Sorted by total descending
│
├── Expenses View  (activeView === 'expenses')
│   ├── Button  [variant=secondary]  → exportExpensesToCSV()
│   ├── FilterPanel
│   │     • Date range inputs (startDate, endDate)
│   │     • Category select
│   │     • Description search input
│   │     • Clear filters button (visible when hasActiveFilters)
│   │     • Result count badge
│   └── ExpenseList
│         └── ExpenseRow  × n
│               ├── RecurringBadge  (conditional — isRecurring === true)
│               ├── Button  [icon=edit]   → opens edit form
│               └── Button  [icon=delete] → opens confirm dialog
│
├── Modal  (isOpen={showForm})
│   └── ExpenseForm
│         • Date, Amount, Category (required)
│         • Description (optional)
│         • Frequency select (visible when isRecurring)
│         ├── Button  [variant=primary]   → handleFormSave()
│         └── Button  [variant=secondary] → handleFormClose()
│
└── ConfirmDialog  (isOpen={Boolean(deletingExpense)})
      ├── Button  [variant=danger]     → handleDeleteConfirm()
      └── Button  [variant=secondary]  → setDeletingExpense(null)
```

---

## Mermaid Diagram

```mermaid
graph TD
    classDef shell   fill:#e0e7ff,stroke:#6366f1,color:#312e81
    classDef dash    fill:#d1fae5,stroke:#10b981,color:#064e3b
    classDef exp     fill:#fce7f3,stroke:#db2777,color:#831843
    classDef common  fill:#f3f4f6,stroke:#6b7280,color:#111827
    classDef overlay fill:#fef3c7,stroke:#d97706,color:#78350f

    App["App.tsx"]:::shell

    subgraph Header["header (sticky)"]
        Btn1["Button\nAdd Expense"]:::common
    end

    Banner["Demo Banner (conditional)"]:::shell
    BtnClear["Button\nClear & Start Fresh"]:::common

    subgraph DashView["Dashboard view"]
        Dashboard:::dash
        SC["SummaryCard ×3\nAll-time · Month · Count"]:::dash
        Chart["SpendingChart\nRecharts BarChart"]:::dash
        Cat["CategoryBreakdown\nLabel · Total · % bar"]:::dash
    end

    subgraph ExpView["Expenses view"]
        BtnExport["Button\nExport CSV"]:::common
        FP["FilterPanel\nDate · Category · Search · Clear"]:::exp
        EL["ExpenseList"]:::exp
        ER["ExpenseRow ×n"]:::exp
        RB["RecurringBadge\n(conditional)"]:::exp
        BtnEdit["Button edit"]:::common
        BtnDel["Button delete"]:::common
    end

    subgraph Overlays["Overlays (portals)"]
        Modal:::overlay
        EF["ExpenseForm\nDate · Amount · Category\nDescription · Frequency"]:::overlay
        CD["ConfirmDialog"]:::overlay
    end

    App --> Header & Banner & DashView & ExpView & Overlays
    Banner --> BtnClear
    Header --> Btn1
    Dashboard --> SC & Chart & Cat
    ExpView --> BtnExport & FP & EL
    EL --> ER
    ER --> RB & BtnEdit & BtnDel
    Modal --> EF
    ConfirmDialog --> CD
```

---

## Hook Usage by Component

| Component | Hook | What it reads / calls |
|-----------|------|-----------------------|
| `App.tsx` | `useExpenses` | `expenses`, `addExpense`, `editExpense`, `removeExpense`, `getFilteredExpenses` |
| `App.tsx` | `useFilters` | `filters`, `hasActiveFilters`, `setFilter`, `clearFilters` |
| `Dashboard` | `useDashboard(expenses)` | `allTimeTotal`, `currentMonthTotal`, `monthlyTotals`, `categoryTotals` |

All other components receive data exclusively via props — no hook calls outside the three above.
