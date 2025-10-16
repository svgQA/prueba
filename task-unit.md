<p align="center">
  <img src="./public/image/image.svg" width="220" alt="Tryvoo logo" />
</p>
<h1 align="center">Tryvoo Dashboard &mdash; Unit Testing Blueprint</h1>
<p align="center">
  Comprehensive overview of the component-level test suites that protect the Tryvoo Dashboard
  and the roadmap for closing the remaining coverage gaps.
</p>
<p align="center">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://preactjs.com/"><img src="https://img.shields.io/badge/Preact-673AB8?style=for-the-badge&logo=preact&logoColor=white" alt="Preact" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://vitest.dev/"><img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" /></a>
  <a href="https://testing-library.com/"><img src="https://img.shields.io/badge/Testing_Library-E33332?style=for-the-badge&logo=testing-library&logoColor=white" alt="Testing Library" /></a>
</p>

## Table of Contents
- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Coverage Snapshot](#coverage-snapshot)
- [Completed Component Suites](#completed-component-suites)
- [Prioritized Backlog](#prioritized-backlog)
  - [High Priority](#high-priority)
  - [Medium Priority](#medium-priority)
  - [Foundational Enhancements](#foundational-enhancements)
- [Next Test Focus](#next-test-focus)
- [How to Run the Suites](#how-to-run-the-suites)

## Overview
The Tryvoo Dashboard relies on a dense catalog of UI primitives and composite experiences. The current
Vitest suites cover the most interactive selectors, form controls, and feedback widgets. This document
consolidates what is already covered and highlights the remaining areas that need deterministic unit
tests to keep regression risk low as new iterations ship.

## Testing Stack
- **Unit runner:** Vitest with jsdom environment.
- **Assertions & DOM queries:** @testing-library/preact for accessibility-centric selectors.
- **Mocking utilities:** Built-in Vitest mocks plus bespoke helpers under `tests/unit/utils`.
- **Signals & stores:** `@preact/signals` and Zustand stores are isolated through targeted mocks when
  component logic requires state orchestration.

## Coverage Snapshot
| Area | Status | Notes |
| --- | --- | --- |
| UI Inputs & Selectors | ✅ Stable | All reusable inputs, selectors, and chips have green suites verifying translation hooks, keyboard support, and validation states. |
| Feedback & Overlay Widgets | ✅ Stable | Alerts, modals, loading indicators, badges, tooltips, and progress visuals are protected with behavioral tests. |
| Navigation Shell | ⚠️ Pending | Navbar and sidebar lack unit coverage despite orchestrating routing, signals, and permission checks. |
| Data Presentation | ⚠️ Pending | Complex table and scheduling/timeline modules are untested; they encode business rules worth locking down. |
| Page Containers | ✅ Stable | Authentication and dashboard shell pages have smoke coverage validating routing and layout variants. |

## Completed Component Suites
The following suites already run in CI; they are grouped by functional domain for faster discovery.

| Status | Suite | Focus | Key Assertions | Location |
| --- | --- | --- | --- | --- |
| ✅ | Inputs & Selectors | `Input`, `TextArea`, `Checkbox`, `Radio`, `Slider`, `MultipleInput`, `Search`, `Select`, `SelectCheck`, `SearchableSelect`, `SmartSelector`, `CustomSelector`, `CustomSwitcher`, `LanguageSwitcher`, `UserSelector`, `Schedule Search` | Controlled state propagation, accessibility attributes, translation keys, and keyboard flows. | `tests/unit/components/common/*.spec.tsx` |
| ✅ | Feedback & Overlays | `Alert`, `ShowAlert`, `Badge`, `Card`, `Tooltip`, `Modal`, `ProgressBar`, `Loading`, `Dropdown`, `Button`, `Avatar`, `TextEllipsis` | Visibility toggles, slot rendering, status flags, iconography, async fallbacks. | `tests/unit/components/common/*.spec.tsx` |
| ✅ | Compose Utilities & Pages | `FormButton`, `ThemeButton`, `Toast`, authentication pages, dashboard shell | Routing initialization, provider wiring, smoke coverage for layout and theme toggles. | `tests/unit/components` & `tests/unit/pages` |

These suites continue to pass and act as guardrails for future regressions.

## Prioritized Backlog
The remaining work is ordered by impact. Each item includes the scenarios we expect to automate and why
that coverage is valuable.

### High Priority
| Status | Component | Objective | Why It Matters | Key Scenarios |
| --- | --- | --- | --- | --- |
| [ ] | **Responsive Navbar shell**<br/>`src/components/common/navbar/navbar.tsx` | Validate mobile menu toggling, service modal integration, translated labels, and CTA links for sign-in actions. | Controls tenant navigation, uses reactive signals for hamburger state, and conditionally renders `ModalServices` or `Link` targets; regressions block access to core routes.【F:src/components/common/navbar/navbar.tsx†L1-L86】 | Toggle hamburger updates `isOpen` classes; action buttons invoke `onActionHandler` and close menu; non-service entries render `Link` with correct `to` props while service entry mounts `ModalServices`. |
| [ ] | **Sidebar navigation with permissions**<br/>`src/components/common/sidebar/sidebar.tsx` | Assert default routing, highlight state, permission gating via `validateModuleState`, and click callbacks when navigation is disabled. | Sidebar start-up logic auto-selects routes and respects signal-based redirects; missing coverage risks silent navigation failures when permission signals change.【F:src/components/common/sidebar/sidebar.tsx†L1-L91】 | Initial effect selects first menu and honors `getRedirectSettingModal`; menu clicks fire `onHandlerClick` and update highlight; settings button visibility tracks `validateModuleState('setting')`. |
| [ ] | **Data table drag-and-drop grid**<br/>`src/components/common/table/table.tsx` & children | Snapshot column layout, verify draggable headers/cells, bulk actions menu toggling, and empty-state messaging. | The table powers reporting modules and coordinates drag interactions plus virtualization hints; regressions cascade across analytics features.【F:src/components/common/table/table.tsx†L1-L200】 | Default vs. customized column order persists across drag events; action menus respect disabled states; empty datasets render placeholders instead of stale rows. |

### Medium Priority
| Status | Component | Objective | Why It Matters |
| --- | --- | --- | --- |
| [ ] | **Schedule Selector**<br/>`src/components/common/schedule-selector/schedule-selector.tsx` | Cover search filtering, checkbox persistence, and translation-driven validation banners. | Keeps scheduling workflows predictable and guards translation regressions.【F:src/components/common/schedule-selector/schedule-selector.tsx†L1-L119】 |
| [ ] | **Timeline module**<br/>`src/components/common/timeline` | Validate chronological ordering, status coloring, and icon rendering. | Incident timelines communicate SLA commitments and must remain accurate. |
| [ ] | **Ranking widget**<br/>`src/components/common/ranking` | Ensure scoring badges and progress bars react to input arrays and empty datasets. | Drives leaderboard experiences that influence operational incentives. |
| [ ] | **Signature pad & File utilities**<br/>`src/components/common/signature`, `src/components/common/file` | Confirm canvas reset/export events and file upload validation. | Both feed legal audit trails and require strict data integrity. |

### Foundational Enhancements
| Status | Initiative | Objective | Why It Matters |
| --- | --- | --- | --- |
| [ ] | Store-driven selectors | Mock signals/Zustand stores to assert fallback behavior across panic utilities and notifications. | Prevents regressions in stateful widgets that rely on shared stores. |
| [ ] | Accessibility snapshots | Add axe/role assertions to existing suites. | Maintains the dashboard's accessibility posture during rapid UI iterations. |
| [ ] | Cross-browser quirks | Mock `MapLibre` wrappers and barcode/QR components. | Ensures build pipelines catch rendering differences before release. |

## Next Test Focus
**Target Suite:** `Navbar` responsive behavior

- *Description:* Mount the navbar with a mock menu set containing links, a service entry, and button actions. Simulate toggling the hamburger icon, ensure classes switch between `hidden` and flex states, click button entries to confirm callbacks fire and the menu closes, and assert that the `Link` rendered for non-service menus receives the correct `to` prop.
- *Rationale:* This delivers immediate coverage for the highest-risk navigation component, reduces reliance on E2E smoke tests for the same flows, and shortens feedback loops when editing routing or translation keys.

## How to Run the Suites
```bash
# Run the full unit suite
bun run test:unit

# Focus on a specific spec while developing
bun run test:unit -- --run tests/unit/components/common/navbar.spec.tsx

# Generate coverage when adding new suites
bun run test:cov
```

Maintaining and expanding these suites keeps regressions from creeping into Tryvoo's most-used workflows while enabling rapid iteration on UX refinements.
