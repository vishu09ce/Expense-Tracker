# Testing Strategy
## Expense-Tracker PoC — Claude Code Development for Regulated Workflows Utilizing Risk-Based Validation

**Version:** 1.0
**Status:** Approved
**Author:** Claude Code (claude-sonnet-4-6)
**Approved By:** Vashishth Purohit (Product Owner)
**Date:** 2026-04-22
**Linked RTM:** [RTM.md](../RTM.md)

---

## 1. Purpose

This document defines the testing strategy for the Expense-Tracker PoC. It establishes the risk classification model, test type definitions, coverage requirements, execution approach, and quality gates that govern all verification activity.

The strategy is designed to support a **Risk-Based Validation (RBV)** model within an AI-assisted development pipeline — ensuring that test effort is proportional to risk, and that compliance standards are maintained without sacrificing development velocity.

---

## 2. Scope

This strategy covers all functional requirements (FR-01–FR-29), non-functional requirements (NFR-01–NFR-15), and deployment verification requirements (DEP-01–DEP-10) for the Expense-Tracker PoC.

| Requirement Group | IDs | Count |
|-------------------|-----|-------|
| Expense Management | FR-01–FR-07 | 7 |
| Categories | FR-08–FR-09 | 2 |
| Filtering & Search | FR-10–FR-14 | 5 |
| Dashboard & Analytics | FR-15–FR-19 | 5 |
| Export | FR-20–FR-22 | 3 |
| Recurring Expenses | FR-23–FR-29 | 7 |
| Performance | NFR-01–NFR-03 | 3 |
| Responsiveness | NFR-04–NFR-07 | 4 |
| Accessibility | NFR-08–NFR-11 | 4 |
| Browser Compatibility | NFR-12–NFR-13 | 2 |
| Theme & Display | NFR-14–NFR-15 | 2 |
| Deployment Infrastructure | DEP-01–DEP-03 | 3 |
| Demo Data & First Visit | DEP-04–DEP-06 | 3 |
| Demo Banner | DEP-07–DEP-09 | 3 |
| Page Identity | DEP-10 | 1 |
| **Total** | | **54** |

*NFR-13 is explicitly out of scope (IE not supported per requirements document).*

---

## 3. Risk Classification Model

All requirements are classified as either **HPR** or **NHPR** at the point of requirement definition. Risk level drives test type selection and the quality gate applied to each result.

### 3.1 High Process Risk (HPR)

A requirement is classified HPR when a failure would result in any of the following:

| Trigger | Example |
|---------|---------|
| Silent data loss | An expense is deleted without the user confirming or being informed |
| Data corruption | A saved amount is stored with incorrect precision or overwritten unintentionally |
| Incorrect financial calculation | An all-time total or monthly sum does not reflect the actual stored values |
| Undetected system failure | A write to localStorage silently fails and the UI shows stale data |

**Consequence:** Any HPR requirement with a **Fail** result is a hard blocker. The build cannot be approved and no deployment may proceed until the failure is resolved and re-verified.

### 3.2 Not High Process Risk (NHPR)

A requirement is classified NHPR when a failure produces a recoverable or cosmetic impact:

| Trigger | Example |
|---------|---------|
| Visual/cosmetic defect | A badge colour is incorrect but the information is still conveyed |
| Recoverable inconvenience | A filter does not clear on the first click but works on the second |
| Non-critical functional gap | A chart does not render but all data is still accessible in the list view |

**Consequence:** NHPR failures are logged as defects and must be resolved before final approval, but do not block intermediate build verification.

---

## 4. Test Types

Each requirement is assigned one or more test types based on its risk level and the nature of the acceptance criterion.

| Test Type | Definition | Typical Use |
|-----------|-----------|-------------|
| **Unit** | Verifies a single function, utility, or isolated logic path | Amount validation, category enumeration, date formatting |
| **Integration** | Verifies that two or more layers interact correctly end-to-end | Form submission → hook → storage service → localStorage |
| **E2E** | Verifies a complete user-facing flow in a running browser environment | First visit auto-seed, recurring auto-generation, CSV download |
| **Exploratory** | Structured manual inspection of a feature against its acceptance criteria | Responsive layout, filter behaviour, keyboard navigation |
| **Smoke** | Minimal check that the system is up and core paths are functional | Live URL resolves, assets load, React mounts, page title correct |

### 4.1 Test Type Assignment Rules

| Risk Level | Primary Test Type | Secondary Test Type |
|------------|------------------|---------------------|
| HPR | Unit + Integration | E2E where user flow is involved |
| NHPR | Exploratory | Smoke for deployment requirements |
| Deployment | Smoke | E2E for behavioural features (seed, banner) |

---

## 5. Test Execution Approach

### 5.1 Primary Method — Code-Path Tracing

For all functional and non-functional requirements, the primary verification method is **static code-path tracing**: each acceptance criterion is traced through the source implementation to confirm the logic satisfies the criterion without requiring a running application.

This approach is used because:
- The storage layer (`LocalStorageService`) is synchronous — there is no asynchronous behaviour to observe
- TypeScript's type system enforces interface contracts at compile time
- The AI-assisted development model produces fully traceable, auditable code paths

### 5.2 Dynamic Verification — Dev Server

All requirements involving user interaction, layout, or visual output are additionally verified against a running dev server (`http://localhost:5173`) using exploratory testing.

### 5.3 Deployment Verification — Live URL

All deployment requirements (DEP-01–DEP-10) are verified against the live GitHub Pages deployment (`https://vishu09ce.github.io/Expense-Tracker/`) including asset path inspection of the production `dist/index.html`.

---

## 6. Test Environment

| Environment | URL / Command | Used For |
|-------------|--------------|----------|
| Local dev server | `npm run dev` → `http://localhost:5173` | Functional and NFR verification |
| Local production build | `npm run build && npm run preview` | Pre-deployment build verification |
| GitHub Pages (production) | `https://vishu09ce.github.io/Expense-Tracker/` | Deployment requirement verification |

**Browser under test:** Chrome (latest) as primary. NFR-12 asserts compatibility with Chrome, Firefox, Safari, and Edge — verified by confirming only standard Web APIs are used.

---

## 7. Coverage Requirements

| Requirement Type | Minimum Pass Rate | HPR Failures Permitted |
|-----------------|-------------------|----------------------|
| Functional (FR) | 100% | 0 |
| Non-Functional (NFR) | 100% of testable requirements | 0 |
| Deployment (DEP) | 100% | 0 |

All 53 testable requirements must have a recorded Result in the RTM before the Quality Gate can be signed off.

---

## 8. Quality Gate

The following conditions must all be true before the build is approved and the Product Owner sign-off is recorded in the RTM:

- [x] All 53 testable requirements have a recorded Result (Pass or Fail)
- [x] Zero HPR requirements have a Fail result
- [x] All identified defects (Critical, Major, Minor) are resolved and re-verified
- [x] All deployment requirements verified against the live GitHub Pages URL
- [x] RTM reviewed and countersigned by the Product Owner

---

## 9. Defect Management

Defects are recorded in the RTM Defect Log with the following severity classification:

| Severity | Definition | Resolution Requirement |
|----------|-----------|----------------------|
| **Critical** | HPR requirement fails | Must be resolved before any further testing proceeds |
| **Major** | NHPR requirement fails and blocks another requirement | Must be resolved before Quality Gate sign-off |
| **Minor** | NHPR requirement fails with no downstream impact | Must be resolved before Quality Gate sign-off |
| **Observation** | Issue noted but within acceptable tolerance | Logged; resolution at Product Owner discretion |

*No defects were found during v1.0 or v1.1 testing. All 53 requirements passed on first verification.*

---

## 10. Roles and Responsibilities

| Role | Responsibility |
|------|---------------|
| **Claude Code** (claude-sonnet-4-6) | Test execution, code-path tracing, RTM population, defect identification |
| **Product Owner** (Vashishth Purohit) | Requirement approval, Quality Gate sign-off, final RTM approval |

---

*Strategy v1.0 approved 2026-04-22. Covers functional, NFR, and deployment testing for the Expense-Tracker PoC.*
