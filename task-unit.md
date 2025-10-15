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

### Inputs & Selectors
- [x] `Input`, `TextArea`, `Checkbox`, `Radio`, `Slider`, `MultipleInput`, `Search`, `Select`, `SelectCheck`, `SearchableSelect`, `SmartSelector`, `CustomSelector`, `CustomSwitcher`, `LanguageSwitcher`, `UserSelector`, `Schedule Search` (search field inside `ScheduleSelector`) — focus on controlled states, accessibility attributes, translation keys, and keyboard flows. Tests live under `tests/unit/components/common/*.spec.tsx`.

### Feedback & Overlays
- [x] `Alert`, `ShowAlert`, `Badge`, `Card`, `Tooltip`, `Modal`, `ProgressBar`, `Loading`, `Dropdown`, `Button`, `Avatar`, `TextEllipsis` — covering visibility toggles, slots, status flags, iconography, and async fallbacks.

### Compose Utilities & Pages
- [x] `FormButton`, `ThemeButton`, `Toast` compose suites plus authentication and dashboard page smoke tests ensure routing and providers initialize correctly.

These suites continue to pass and act as guardrails for future regressions.

## Prioritized Backlog
The remaining work is ordered by impact. Each item includes the scenarios we expect to automate and why
that coverage is valuable.

### High Priority
1. **Responsive Navbar shell** (`src/components/common/navbar/navbar.tsx`)
   - *Goal:* Validate mobile menu toggling, service modal integration, translated labels, and CTA links for sign-in actions.
   - *Why it matters:* The navbar controls tenant navigation, uses reactive signals for hamburger state, and conditionally renders `ModalServices` or `Link` targets; regressions here block users from core routes.【F:src/components/common/navbar/navbar.tsx†L1-L86】
   - *Key scenarios to automate:*
     - Toggling the hamburger button updates `isOpen` state classes and collapses after selecting a menu item.
     - Buttons that call `onActionHandler` close the menu and propagate the identifier.
     - "Services" menu renders `ModalServices` while other entries render `Link` components with correct routes.

2. **Sidebar navigation with permissions** (`src/components/common/sidebar/sidebar.tsx`)
   - *Goal:* Assert default routing, highlight state, permission gating via `validateModuleState`, and click callbacks when navigation is disabled.【F:src/components/common/sidebar/sidebar.tsx†L1-L91】
   - *Why it matters:* Sidebar start-up logic auto-selects routes and respects signal-based redirects; missing coverage risks silent navigation failures when permission signals change.
   - *Key scenarios to automate:*
     - Initial effect selecting the first menu and honoring `getRedirectSettingModal` redirects when allowed.
     - Menu item clicks fire `onHandlerClick` when `isNavigation` is false and update the selected highlight.
     - Settings button visibility responds to `validateModuleState('setting')`.

3. **Data table drag-and-drop grid** (`src/components/common/table/table.tsx` & subcomponents)
   - *Goal:* Snapshot render for column layout, verify draggable headers/cells, bulk actions menu toggling, and empty-state messaging.【F:src/components/common/table/table.tsx†L1-L200】
   - *Why it matters:* The table underpins reporting modules and coordinates drag interactions plus virtualization hints; a regression would cascade across analytics features.
   - *Key scenarios to automate:*
     - Rendering with default columns vs. customized column order persists across drag events.
     - Action menu callbacks fire (export, selection) and respect disabled states.
     - Empty datasets display placeholders instead of stale data rows.

### Medium Priority
1. **Schedule Selector** (`src/components/common/schedule-selector/schedule-selector.tsx`)
   - Cover search filtering, checkbox selection persistence, and translation-driven validation banners so scheduling workflows remain predictable.【F:src/components/common/schedule-selector/schedule-selector.tsx†L1-L119】
2. **Timeline module** (`src/components/common/timeline`)
   - Validate chronological ordering, status coloring, and icon rendering because incident timelines communicate SLA commitments.
3. **Ranking widget** (`src/components/common/ranking`)
   - Ensure scoring badges and progress bars react to input arrays and gracefully handle empty datasets.
4. **Signature pad** (`src/components/common/signature`) & **File utilities** (`src/components/common/file`)
   - Confirm canvas reset/export events and file upload validation since both feed legal audit trails.

### Foundational Enhancements
- **Store-driven selectors:** Add explicit coverage for components reading from signals/Zustand (e.g., panic utilities, notifications) by mocking the stores to assert fallback behavior.
- **Accessibility snapshots:** Extend existing suites with axe/role assertions to maintain the accessibility posture.
- **Cross-browser quirks:** Incorporate tests around `MapLibre` wrappers and barcode/QR components using mocking to prevent regressions in build pipelines.

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
