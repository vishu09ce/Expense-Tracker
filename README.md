# Expense Tracker

A personal expense tracking SPA built with React, TypeScript, and Tailwind CSS. Add and manage expenses, visualise spending trends, automate recurring costs, and export to CSV.

**Live demo:** https://vishu09ce.github.io/Expense-Tracker/

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + Vite 8 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Storage | localStorage (browser-native) |
| Deployment | GitHub Pages |

---

## Features

- Add, edit, and delete expenses with date, amount, category, and description
- Six categories: Food, Transportation, Entertainment, Shopping, Bills, Other
- Filter and search by date range, category, and keyword — all criteria combined with AND logic
- Dashboard with all-time total, current month total, spending-over-time bar chart, and category breakdown
- Recurring expenses with Weekly / Monthly / Annual frequencies — overdue instances auto-generated on every page load
- CSV export of the full expense history with a date-stamped filename
- Demo data auto-seeded on first visit so new users land on a populated dashboard

---

## Architecture

The app is structured in three layers following SOLID principles. The key design decision is **Dependency Inversion at the storage boundary** — the hook layer depends on an interface (`IStorageService`), not on `LocalStorageService` directly. Swapping localStorage for a REST API requires only a new implementation class; no hooks or components change.

```mermaid
graph TB
    classDef ui      fill:#e0e7ff,stroke:#6366f1,color:#312e81
    classDef hook    fill:#fce7f3,stroke:#db2777,color:#831843
    classDef service fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef storage fill:#fef3c7,stroke:#d97706,color:#78350f

    subgraph UI["① UI Layer — React Components"]
        App["App.tsx\nShell · tabs · modals · demo banner"]
        Dash["Dashboard\nSummaryCards · SpendingChart · CategoryBreakdown"]
        Exp["Expenses\nExpenseList · ExpenseForm · ExpenseRow"]
        Fil["FilterPanel"]
        Com["Common\nButton · Modal · ConfirmDialog"]
    end

    subgraph HL["② Hook Layer — Business Logic"]
        UE["useExpenses\nexpenses[ ] state · CRUD · filtering"]
        UF["useFilters\nfilter state · clear"]
        UD["useDashboard\ncompute metrics · memoised"]
    end

    subgraph SL["③ Service Layer — Storage Abstraction"]
        INT["«interface» IStorageService\ngetAll · create · update · delete · saveAll"]
        LSS["LocalStorageService\nsole class that reads / writes localStorage"]
    end

    LS[("localStorage")]

    App --> Dash & Exp & Fil & Com
    Exp --> Com
    App -->|useExpenses| UE
    App -->|useFilters| UF
    Dash -->|useDashboard| UD
    UD -->|reads| UE
    UE -->|"DIP — depends on interface"| INT
    INT -.->|implements| LSS
    LSS --> LS

    class App,Dash,Exp,Fil,Com ui
    class UE,UF,UD hook
    class INT,LSS service
    class LS storage
```

---

## Data Flow

### Initialization — on every page load

```mermaid
graph LR
    classDef step fill:#dbeafe,stroke:#3b82f6,color:#1e3a8a
    classDef store fill:#fef3c7,stroke:#d97706,color:#78350f

    A(["App mounts"]):::step
    B["autoSeedIfFirstVisit\nseeds 30 demo expenses\nfirst visit only"]:::step
    C["processRecurringExpenses\ngenerates any overdue\nrecurring instances"]:::step
    D["storageService.getAll()"]:::step
    E(["expenses[ ] initialised\nReact state ready"]):::step
    LS[("localStorage")]:::store

    A --> B --> C --> D --> E
    B -->|"saveAll on\nfirst visit"| LS
    C -->|"read + write"| LS
    D -->|"read"| LS
```

### Read path — rendering

```mermaid
graph LR
    classDef step fill:#d1fae5,stroke:#10b981,color:#064e3b

    S(["expenses[ ] state\nin useExpenses"]):::step
    D["Dashboard\nreceives full list\nunaffected by filters"]:::step
    F["getFilteredExpenses\napplies active filter criteria\nAND logic"]:::step
    L["ExpenseList\nreceives filtered list"]:::step

    S --> D
    S --> F --> L
```

### Write path — mutations

```mermaid
graph LR
    classDef step fill:#fce7f3,stroke:#ec4899,color:#831843
    classDef store fill:#fef3c7,stroke:#d97706,color:#78350f

    A(["User action\nadd · edit · delete"]):::step
    B["useExpenses\nmutation function"]:::step
    C["LocalStorageService\npersist change"]:::step
    D["refresh → getAll\nre-read storage"]:::step
    E(["setExpenses\nall consumers re-render"]):::step
    LS[("localStorage")]:::store

    A --> B --> C --> D --> E
    C -->|"write"| LS
    D -->|"read"| LS
```

---

## Local Development

```bash
npm install
npm run dev       # start dev server at http://localhost:5173
npm run build     # production build
npm run preview   # preview production build locally
```

The dev toolbar (bottom-right corner) provides **Load Test Data** and **Clear All** buttons for testing. It is stripped from the production bundle at build time.

---

## Deployment

```bash
npm run deploy
```

Runs `npm run build` then publishes `dist/` to the `gh-pages` branch via the `gh-pages` package. GitHub Pages serves from that branch at https://vishu09ce.github.io/Expense-Tracker/.

---

## Project Docs

| Document | Description |
|----------|-------------|
| [RTM.md](RTM.md) | Requirements Traceability Matrix — all 53 requirements with test results |
| [docs/COMPONENT_TREE.md](docs/COMPONENT_TREE.md) | Full React component tree with props and responsibilities |
