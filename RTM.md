# Expense Tracker
## Requirements Traceability Matrix (RTM)

**Version:** 1.0
**Status:** In Progress
**Source Requirements Doc:** v1.0 (Approved)
**Source Testing Strategy:** v1.0 (Approved)
**Last Updated:** 2026-04-22

---

## How to Read This Document

| Column | Description |
|--------|-------------|
| **Req ID** | Unique requirement identifier from the Requirements Document |
| **Intended Use** | One sentence describing what the feature does for the user |
| **Risk** | HPR = High Process Risk · NHPR = Not High Process Risk |
| **Test Type** | Unit · Integration · E2E · Exploratory · Smoke |
| **Test Case** | The specific scenario tested |
| **Acceptance Criterion** | The exact condition that must be true for the test to pass |
| **Result** | Pass · Fail · — (not yet tested) |

---

## Risk Classification Summary

**HPR triggers:** Silent data loss · Data corruption · Incorrect financial calculation · Undetected system failure
**NHPR triggers:** Visual/cosmetic defect · Recoverable inconvenience · Non-critical functional gap

---

## 3.1 Expense Management

| Req ID | Intended Use | Risk | Test Type | Test Case | Acceptance Criterion | Result |
|--------|-------------|------|-----------|-----------|----------------------|--------|
| FR-01 | Allows the user to record a new expense with all required fields | HPR | Unit + Integration | Fill the add-expense form with valid date, amount, category, and description; submit | Expense appears in the list with correct field values and is persisted in localStorage | — |
| FR-02 | Allows the user to correct or update any field of an existing expense | HPR | Unit + Integration | Open an existing expense in edit mode; change each field; save | All edited fields are updated in localStorage and reflected in the UI immediately without page reload | — |
| FR-03 | Allows the user to permanently remove an expense after confirming intent | HPR | Unit + Integration | Click delete on an expense; verify confirmation prompt appears; confirm deletion; also cancel deletion on a second expense | Confirmed expense is removed from localStorage and list; cancelled expense remains intact | — |
| FR-04 | Ensures expense records survive page refreshes and browser restarts | HPR | Integration | Add multiple expenses; perform a full page reload | All expense records are present and unchanged after reload | — |
| FR-05 | Ensures financial accuracy when recording expense amounts | HPR | Unit | Enter amounts with 0, 1, and 2 decimal places; attempt to enter 3+ decimal places | Amounts up to 2 decimal places are accepted and stored accurately; inputs exceeding 2 decimal places are rejected or truncated | — |
| FR-06 | Reduces data entry friction by pre-filling the most common date value | NHPR | Exploratory | Open the add-expense form and observe the date field | The date field is pre-filled with today's date when the form is opened for a new expense | — |
| FR-07 | Allows users to save expenses without a description while enforcing all other required fields | HPR | Unit | Submit form with no description (expect success); submit form missing amount, then date, then category (expect failure each time) | Form submits successfully with an empty description; form rejects submission when amount, date, or category is missing | — |

---

## 3.2 Categories

| Req ID | Intended Use | Risk | Test Type | Test Case | Acceptance Criterion | Result |
|--------|-------------|------|-----------|-----------|----------------------|--------|
| FR-08 | Organizes expenses into predefined categories for filtering and analytics | HPR | Unit | Open the category selector in the add/edit form and inspect all available options | Exactly six categories are present — Food, Transportation, Entertainment, Shopping, Bills, Other — and no others | — |
| FR-09 | Ensures every expense is categorized for accurate analytics and filtering | HPR | Unit + Integration | Attempt to submit the add-expense form without selecting a category | Form rejects submission; every successfully saved expense has exactly one non-null category value in localStorage | — |

---

## 3.3 Filtering and Search

| Req ID | Intended Use | Risk | Test Type | Test Case | Acceptance Criterion | Result |
|--------|-------------|------|-----------|-----------|----------------------|--------|
| FR-10 | Allows the user to view expenses within a specific time period | NHPR | Exploratory | Set a start date and end date spanning a subset of existing expenses; observe the list | Only expenses whose date falls within the selected range (inclusive of both endpoints) are displayed | — |
| FR-11 | Allows the user to view expenses for a specific spending category | NHPR | Exploratory | Select a single category from the filter; observe the list | Only expenses matching the selected category are displayed | — |
| FR-12 | Allows the user to find specific expenses by keyword in the description | NHPR | Exploratory | Enter a keyword present in some expense descriptions; observe the list | Only expenses whose description contains the search text are displayed (case-insensitive match) | — |
| FR-13 | Allows precise multi-criteria expense lookups | NHPR | Exploratory | Apply a date range, a category filter, and a description search simultaneously | Displayed expenses satisfy all three active filter conditions at once | — |
| FR-14 | Quickly resets the view to show all expenses | NHPR | Exploratory | Apply multiple filters; click the single clear action | All filter fields are reset to empty and the full expense list is displayed | — |

---

## 3.4 Dashboard and Analytics

| Req ID | Intended Use | Risk | Test Type | Test Case | Acceptance Criterion | Result |
|--------|-------------|------|-----------|-----------|----------------------|--------|
| FR-15 | Gives the user an at-a-glance view of their cumulative spending across all time | HPR | Unit + Integration | Add expenses with known amounts totalling a predictable sum; view the all-time total on the dashboard | All-time total equals the exact arithmetic sum of all expense amounts in localStorage | — |
| FR-16 | Gives the user a snapshot of this month's spending | HPR | Unit + Integration | Add expenses in the current month and in prior months with known amounts; view the current month total | Current month total equals the exact sum of expenses whose date falls in the current calendar month only | — |
| FR-17 | Shows the user where their money is going, broken down by category | HPR | Unit + Integration | Add expenses across multiple categories with known amounts per category; view the by-category breakdown | Each category total equals the exact sum of expenses assigned to that category | — |
| FR-18 | Visualizes spending trends to help the user identify patterns over time | NHPR | Exploratory | Add expenses across multiple different dates; view the dashboard chart | A chart is rendered showing data points that correspond to the expense data grouped over time; the chart updates when expenses change | — |
| FR-19 | Ensures dashboard totals are always current without requiring a page refresh | HPR | Integration | Add an expense, then edit an expense, then delete an expense — observe dashboard totals after each action | All dashboard summary values update immediately after each create, edit, and delete action without a page reload | — |

---

## 3.5 Export

| Req ID | Intended Use | Risk | Test Type | Test Case | Acceptance Criterion | Result |
|--------|-------------|------|-----------|-----------|----------------------|--------|
| FR-20 | Allows the user to download their full expense history for external use | HPR | Integration | Add a known number of expenses; trigger the CSV export | A CSV file is downloaded and contains one data row per expense with no records missing | — |
| FR-21 | Ensures the exported file is complete and usable outside the app | HPR | Integration | Open the exported CSV file and inspect its columns and values | The file contains columns for date, amount, category, and description; every row has the correct corresponding values | — |
| FR-22 | Makes exported files identifiable by when they were generated | NHPR | Exploratory | Trigger a CSV export and inspect the downloaded filename | The filename contains the current date in a readable, unambiguous format (e.g., expenses-2026-04-22.csv) | — |

---

## 3.6 Recurring Expenses

| Req ID | Intended Use | Risk | Test Type | Test Case | Acceptance Criterion | Result |
|--------|-------------|------|-----------|-----------|----------------------|--------|
| FR-23 | Allows the user to flag expenses that repeat on a defined schedule | HPR | Unit + Integration | Create a new expense with recurring enabled; separately edit an existing expense to enable recurring | The isRecurring flag is correctly saved as true in localStorage for both the create and edit flows | — |
| FR-24 | Defines how often a recurring expense auto-generates its next instance | HPR | Unit | Open the frequency selector on a recurring expense; select each option (Weekly, Monthly, Annual) and save | Exactly three frequency options are available; the selected frequency is stored correctly with the expense | — |
| FR-25 | Removes manual re-entry burden for predictable recurring costs by auto-generating the next instance | HPR | Unit + Integration + E2E | Create a recurring expense with a nextOccurrence date set to today or in the past; reload the app | A new expense is generated with the correct amount, category, and description; the original recurring expense's nextOccurrence is advanced by one frequency interval | — |
| FR-26 | Keeps the expense list as a single unified view regardless of expense type | NHPR | Exploratory | Add a recurring expense and view the main expense list | The recurring expense appears in the main list and is sorted consistently with non-recurring expenses | — |
| FR-27 | Lets the user quickly identify which expenses repeat on a schedule | NHPR | Exploratory | Add a recurring expense and view the list | A visible recurring indicator (icon, badge, or label) is present on the recurring expense row | — |
| FR-28 | Lets the user stop a recurring expense from generating future records while preserving history | HPR | Unit + Integration | Cancel a recurring expense; verify past generated entries are intact; advance the date past the next due date and verify no new entry is generated | Cancellation sets isRecurring to false and nextOccurrence to null; all previously generated expense records remain in localStorage and in the list | — |
| FR-29 | Ensures recurring expenses are fully integrated with all existing app features | HPR | Integration | Apply date and category filters with recurring expenses present; check dashboard totals; export CSV | Recurring expenses appear in filtered results, are included in all dashboard totals, and appear in the exported CSV | — |

---

## 4.1 Performance

| Req ID | Intended Use | Risk | Test Type | Test Case | Acceptance Criterion | Result |
|--------|-------------|------|-----------|-----------|----------------------|--------|
| NFR-01 | Ensures the app is accessible quickly on a standard connection | NHPR | Exploratory | Open the app in a browser and measure time from navigation to interactive | App is fully interactive within 3 seconds on a standard broadband connection | — |
| NFR-02 | Ensures the UI feels responsive and snappy for all interactions | NHPR | Exploratory | Click buttons, submit forms, and apply filters while observing response time | All UI interactions produce visible feedback within 200ms | — |
| NFR-03 | Ensures the app remains usable as the expense list grows | NHPR | Exploratory | Load 1,000 expense records into localStorage; apply filters and view dashboard | App remains fully functional and responsive with 1,000 records | — |

---

## 4.2 Responsiveness

| Req ID | Intended Use | Risk | Test Type | Test Case | Acceptance Criterion | Result |
|--------|-------------|------|-----------|-----------|----------------------|--------|
| NFR-04 | Ensures the app is fully usable on desktop screens | NHPR | Exploratory | Open the app at 1280px and above; exercise all features | All features are fully functional with no layout breakage | — |
| NFR-05 | Ensures the app is fully usable on tablet screens | NHPR | Exploratory | Open the app at 768px–1279px; exercise all features | All features are fully functional with no layout breakage | — |
| NFR-06 | Ensures the app is fully usable on mobile screens | NHPR | Exploratory | Open the app at 375px–767px; exercise all features | All features are fully functional with no layout breakage | — |
| NFR-07 | Prevents horizontal overflow at any supported screen size | NHPR | Exploratory | Check all three breakpoints for horizontal scroll | No horizontal scrollbar appears at desktop, tablet, or mobile widths | — |

---

## 4.3 Accessibility

| Req ID | Intended Use | Risk | Test Type | Test Case | Acceptance Criterion | Result |
|--------|-------------|------|-----------|-----------|----------------------|--------|
| NFR-08 | Ensures the app is usable without a mouse | NHPR | Exploratory | Navigate all interactive elements using Tab, Shift+Tab, Enter, and Space keys only | Every button, input, and control is reachable and operable by keyboard alone | — |
| NFR-09 | Ensures screen readers can describe all visual elements | NHPR | Exploratory | Inspect all images and icons for alt text or aria-label attributes | Every image and icon has a descriptive alt text or aria-label | — |
| NFR-10 | Ensures information is accessible to users with color vision deficiencies | NHPR | Exploratory | Review all UI elements that convey meaning; check for non-color redundancy (text, icon, pattern) | No information is communicated by color alone; a secondary indicator is always present | — |
| NFR-11 | Ensures the app meets international accessibility standards | NHPR | Exploratory | Run an automated accessibility audit (e.g., axe DevTools) and perform manual review of flagged items | No WCAG 2.1 Level AA violations remain after audit and manual review | — |

---

## 4.4 Browser Compatibility

| Req ID | Intended Use | Risk | Test Type | Test Case | Acceptance Criterion | Result |
|--------|-------------|------|-----------|-----------|----------------------|--------|
| NFR-12 | Ensures the app works for users on any major modern browser | NHPR | Exploratory | Open and exercise the full app in the latest versions of Chrome, Firefox, Safari, and Edge | All features function correctly in all four browsers with no browser-specific defects | — |
| NFR-13 | Confirms IE is explicitly out of scope and need not be tested | N/A | N/A | N/A | N/A | N/A |

---

## 4.5 Theme and Display

| Req ID | Intended Use | Risk | Test Type | Test Case | Acceptance Criterion | Result |
|--------|-------------|------|-----------|-----------|----------------------|--------|
| NFR-14 | Defines the visual theme for v1 | NHPR | Exploratory | View the app and confirm no dark mode toggle or dark theme is present | App renders in light mode only with no dark theme applied | — |
| NFR-15 | Ensures a future dark mode can be added with minimal refactoring | NHPR | Exploratory | Inspect the Tailwind config and CSS; verify CSS variables are used for all theme-sensitive values (colors, backgrounds) | All theme-sensitive values use CSS variables; Tailwind config includes a structured dark mode extension point | — |

---

## RTM Completion Status

| Category | Total | Tested | Passed | Failed | Remaining |
|----------|-------|--------|--------|--------|-----------|
| Expense Management (FR-01–07) | 7 | 0 | 0 | 0 | 7 |
| Categories (FR-08–09) | 2 | 0 | 0 | 0 | 2 |
| Filtering & Search (FR-10–14) | 5 | 0 | 0 | 0 | 5 |
| Dashboard & Analytics (FR-15–19) | 5 | 0 | 0 | 0 | 5 |
| Export (FR-20–22) | 3 | 0 | 0 | 0 | 3 |
| Recurring Expenses (FR-23–29) | 7 | 0 | 0 | 0 | 7 |
| Performance (NFR-01–03) | 3 | 0 | 0 | 0 | 3 |
| Responsiveness (NFR-04–07) | 4 | 0 | 0 | 0 | 4 |
| Accessibility (NFR-08–11) | 4 | 0 | 0 | 0 | 4 |
| Browser Compatibility (NFR-12–13) | 2 | 0 | 0 | 0 | 1* |
| Theme & Display (NFR-14–15) | 2 | 0 | 0 | 0 | 2 |
| **TOTAL** | **44** | **0** | **0** | **0** | **43** |

*NFR-13 is N/A (IE explicitly out of scope)

---

## Quality Gate Checklist

- [ ] All 43 testable requirements have a recorded Result
- [ ] No HPR requirement has a Fail result
- [ ] All Critical and Major defects resolved and re-verified
- [ ] All Minor defects resolved and re-verified
- [ ] RTM reviewed and signed off by Product Owner (Vashishth)

---

*This RTM is updated after each phase of implementation is complete and tested.*
