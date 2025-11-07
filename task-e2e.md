<p align="center">
  <img src="./public/image/image.svg" width="220" alt="Tryvoo logo" />
</p>
<h1 align="center">End-to-End Quality Playbook</h1>
<p align="center">
  Regression guardrails for the Tryvoo Dashboard to keep mission-critical operations healthy and predictable.
</p>
<p align="center">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://playwright.dev/"><img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://preactjs.com/"><img src="https://img.shields.io/badge/Preact-673AB8?style=for-the-badge&logo=preact&logoColor=white" alt="Preact" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://aws.amazon.com/amplify/"><img src="https://img.shields.io/badge/AWS%20Amplify-FF9900?style=for-the-badge&logo=awsamplify&logoColor=white" alt="AWS Amplify" /></a>
</p>

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Execution Guide](#execution-guide)
- [Current Coverage](#current-coverage)
  - [Authentication & Shell](#authentication--shell)
  - [Operational Modules](#operational-modules)
  - [Platform & Marketing Experience](#platform--marketing-experience)
  - [Shared Tooling](#shared-tooling)
- [Upcoming Enhancements](#upcoming-enhancements)
- [Test Objective & Rationale](#test-objective--rationale)

## Overview
The Playwright end-to-end suite exercises the same surface that operations teams touch every day. Each
scenario logs in with production-like credentials, traverses the dashboard shell, validates analytics
widgets, and confirms that search, filters, and view toggles remain functional after UI or API changes.
This document tracks what is already automated, highlights the remaining gaps, and explains why those
journeys protect the business.

## Technology Stack
- **Playwright Test** – Browser automation and cross-browser assertions with first-class TypeScript
  support.
- **TypeScript** – Strong typing across specs and helpers for safer selector reuse and environment
  utilities.
- **Preact + Tailwind CSS** – The application under test; understanding component structure helps when
  selecting resilient locators.
- **AWS Amplify & Cognito** – Authentication and tenant context used during the login flow.
- **Grafana Faro & WebSockets** – Real-time telemetry surfaces and socket-driven widgets that require
  deterministic waits inside E2E flows.

## Execution Guide
### Prerequisites
- Node.js 20+ (or Bun 1.0+) with the project dependencies installed.
- Environment variables `E2E_EMAIL` and `E2E_PASSWORD` configured with a valid dashboard user.
- Optional `BASE_URL` to point tests to a non-default environment (defaults to `https://dev.tryvoo.com`).

### Commands
```bash
bun run test:e2e           # execute the headless Playwright suite
bun run test:e2e:report    # open the most recent HTML report with traces and screenshots
```
> Replace `bun` with `pnpm`, `npm run`, or `yarn` to match your local tooling.

## Current Coverage
### Authentication & Shell
| Status | Spec | Scenario | Key Assertions |
| --- | --- | --- | --- |
| ✅ | `login.spec.ts` | Valid credentials surface the dashboard experience. | Confirms the shell loads (sidebar, language switcher, user menu) and memos summary widget appears after authentication. |
| ✅ | `sidebar.spec.ts` | Navigation across every sidebar route. | Verifies active-route highlighting, summary metrics, and table headers for memos, shifts, forms, access, correspondence, users, and notifications modules. |
| ✅ | `settings.spec.ts` | Settings modal accessibility. | Opens the modal from the sidebar and asserts profile details, language selector, and close control render correctly. |

### Operational Modules
| Status | Spec | Scenario | Key Assertions |
| --- | --- | --- | --- |
| ✅ | `memos.spec.ts` | Control center for daily memos. | Checks summary cards, panic/table view toggles, global search, and column layout in the default dashboard. |
| ✅ | `shifts.spec.ts` | Shift management oversight. | Validates shift analytics, critical columns (service, contract, timing), global search, and the presence of the "create shift" action. |
| ✅ | `forms.spec.ts` | Form repository governance. | Asserts metrics, response table headers, search availability, and that disabled views remain locked. |
| ✅ | `access.spec.ts` | Visitor access tracking. | Ensures KPI cards and resident/vehicle columns render, and search affordances are available. |
| ✅ | `correspondence.spec.ts` | Package and mail logging. | Checks delivery metrics, primary table columns, and quick filtering via the global search. |
| ✅ | `notifications.spec.ts` | Notification history analytics. | Covers engagement KPIs, history table structure, and search controls. |
| ✅ | `users.spec.ts` | Workforce administration. | Confirms total/active/inactive user counters, organizational columns, and global search readiness. |
| ✅ | `devices.spec.ts` | Device registry placeholder. | Guards against regressions that prevent the module from rendering its placeholder state post-login. |

### Platform & Marketing Experience
| Status | Spec | Scenario | Key Assertions |
| --- | --- | --- | --- |
| ✅ | `home.spec.ts` | Marketing site validation. | Verifies headline content, CTA buttons, and critical sections in both Spanish and English via the language switcher. |

### Shared Tooling
- `tests/e2e/utils.ts` centralizes resilient selectors, translation-aware assertions, login helpers, and
  dashboard readiness checks so every spec benefits from consistent waits and localized expectations.

## Upcoming Enhancements

### Shell & Cross-cutting Experience
| Status | Initiative | Objective |
| --- | --- | --- |
| [ ] | **Cover tenant, company, and place switching.** | Ensure `useUserStore` selectors and local-storage hydration drive the correct WebSocket reconnections and persist the active context across reloads. |
| [ ] | **Guard tenant-scoped settings modals.** | Switch companies and reopen settings-related modals (profile, language, response settings) to ensure cached data is invalidated per tenant selection. |
| [ ] | **Verify locale switching across modules.** | Toggle the `LanguageSwitcher` within `DashboardLayout` and assert strings update for memos, shifts, forms, and the marketing home page in both English and Spanish sessions. |
| [ ] | **Persist theme preferences across reloads.** | Flip the `ThemeButton` control, reload the app, and confirm the stored preference re-applies class names and card themes inside every dashboard module. |
| [ ] | **Exercise the header notification center.** | Interact with `Notifications`, toast triggers, and the `ToastContainer` to confirm toasts, banners, and badge counters stay in sync after navigation. |
| [ ] | **Validate the global panic shortcut.** | Fire the floating `Panic` quick action and ensure `PanicModal` renders, routes alerts correctly, and closes without leaving dangling signals. |
| [ ] | **Validate user dropdown actions.** | Open the avatar dropdown, launch the settings modal, and execute the sign-out path to ensure `toggleSettingModal` and `cleanUserStore` interactions are preserved. |
| [ ] | **Cover tenant creation tooling for privileged admins.** | As the whitelisted super user, complete tenant and instance forms within the management modal and verify success toasts plus refreshed lists from `TenantService`. |

### Memos & Panic Operations
| Status | Initiative | Objective |
| --- | --- | --- |
| [ ] | **Validate the panic workflow end-to-end.** | Simulate alerts through `PanicService`, confirm timeline/status transitions, and guarantee both the table and real-time widget react to updates. |
| [ ] | **Validate memo chat live messaging.** | Use the `ChatView` WebSocket listener to send/receive messages, covering AI assistant defaults, reply threads, and pagination resets. |
| [ ] | **Cover memo attachments & predefined replies.** | Attach files through the presigned upload flow and send predefined responses to confirm `PredefinedService` actions populate the composer. |
| [ ] | **Test memo resolution details.** | Expand memo expandable-panel coverage so panic vs. novelty timelines render with accurate translations and metadata. |
| [ ] | **Surface new memo banner alerts.** | Trigger `SOCKET_MESSAGE_EVENTS.CREATE` and assert the `NotificationBanner` animation runs, highlighting the new row until acknowledged. |
| [ ] | **Highlight panic items from notifications.** | Dispatch the `go-to-panic-table` event and verify the panic table view opens with the matching row scrolled into view and styled with the highlight class. |
| [ ] | **Verify service and user breakdown tabs.** | Exercise the grouped analytics fetched via `MemoService.get_all_by_service` and `get_all_by_user` to keep the expandable summaries accurate after filters. |
| [ ] | **Validate memo map replay.** | Switch to the map view, assert `MapPath` renders the full `RoutePoint` list, and confirm location updates follow sockets without race conditions. |
| [ ] | **Assert memo date-range filtering.** | Apply `onRangeChange` filters on the memo table to verify summaries and card metrics recompute through `MemoService.getMemosSummary`. |
| [ ] | **Protect memo exports and reporting hooks.** | Use the table export controls tied to `modulesReport.Memo` to confirm CSV/Excel payloads respect the active filters and column visibility. |

### Shifts & Workforce Orchestration
| Status | Initiative | Objective |
| --- | --- | --- |
| [ ] | **Cover shift creation and editing.** | Run the `ShiftForm` modal through create/update flows, ensuring table refreshes and permission guards align with `ROW_ACTIONS`. |
| [ ] | **Validate shift scheduler view toggles.** | Jump between table, calendar, scheduler, supervisor, map, and planner tabs to confirm datasets hydrate correctly and cached state resets per view. |
| [ ] | **Exercise Gantt timeline interactions.** | Load the scheduler view, fetch data from `GanttService.get_gantt`, and drag/resize tasks to ensure updates persist after refresh. |
| [ ] | **Test WebSocket-driven shift updates.** | Simulate `SOCKET_MESSAGE_EVENTS.UPDATE`/`UPDATE_CHECK` to ensure the shifts list mutates in place without duplications or stale badges. |
| [ ] | **Validate live workforce mapping.** | Open the map view to assert `LiveUserMap` renders markers, handles empty states, and responds to player availability toggles. |
| [ ] | **Ensure planner workload accuracy.** | Review the planner view to confirm grouped assignments stay aligned with `PlannerView` filtering when switching companies or services. |
| [ ] | **Verify bulk notification hand-offs.** | Drive the `SendForm` workflow, requiring selected users with valid `playerId`, and confirm push notifications send plus success toasts. |
| [ ] | **Guard mention pickers for shifts.** | Interact with service/user `MentionOption` selectors to ensure search, keyboard navigation, and multi-select chips populate the scheduler forms. |
| [ ] | **Protect shift summary cards.** | Validate `ShiftService.get_all` and `ShiftService.getShiftSummary` outputs feed the KPI cards after filters or WebSocket churn. |

### Forms & Response Intelligence
| Status | Initiative | Objective |
| --- | --- | --- |
| [ ] | **Verify form response exports.** | Trigger Excel/PDF downloads from `forms/response` to keep export utilities functioning across dependency changes. |
| [ ] | **Assert form response WebSocket updates.** | Stub `SOCKET_MESSAGE_EVENTS.UPDATE_CHECK` and `CREATE` to verify the responses grid reorders rows and surfaces toast feedback without manual refresh. |
| [ ] | **Validate response view switching.** | Toggle between table, inspect, and report modes so `currentView` and `FormResponseSettingPage` render the appropriate layout and breadcrumbs. |
| [ ] | **Confirm notification-driven deep links.** | Fire the notification event wiring to highlight a response and ensure the correct row scrolls into view when `go-to-panic-table` fires. |
| [ ] | **Enforce response schema validation.** | Attempt to open malformed structures via `FormService.get_structure` and assert `validateResponse` blocks inspection with localized toasts. |
| [ ] | **Cover response status transitions.** | Update entries through `FormService.remove_response_one` and status toggles to confirm summary metrics and audit trails stay synchronized. |

### Access, Correspondence & Visitor Logs
| Status | Initiative | Objective |
| --- | --- | --- |
| [ ] | **Validate access creation flows.** | Use the `AccessForm` modal to create, edit, and delete entries while ensuring socket updates refresh the table without reloads. |
| [ ] | **Protect access summary analytics.** | Confirm the KPI cards recalc correctly when new entries arrive or when `calculatePercentage` handles zero-state denominators. |
| [ ] | **Exercise access reporting exports.** | Trigger the table export controls wired through `modulesReport.Access` to validate downloaded data respects filters and visibility. |
| [ ] | **Validate correspondence lifecycle management.** | Create, edit, and remove correspondence entries via `CorrespondenceForm`, ensuring WebSocket updates sync row observations. |
| [ ] | **Guard correspondence KPI cards.** | Re-run summary fetches after socket updates to keep resolved vs. in-progress percentages accurate. |
| [ ] | **Ensure place-aware filtering.** | Switch `selectedPlace` values and assert both access and correspondence tables refetch using the new context without stale rows. |

### Notifications, Users & Devices
| Status | Initiative | Objective |
| --- | --- | --- |
| [ ] | **Exercise notification authoring.** | Run the `HistoryForm` modal to create and edit notifications, then assert the listing refreshes to safeguard the orchestration pipeline. |
| [ ] | **Audit notification history analytics.** | Validate cards and table actions in `history.page.tsx`, including create/update/delete paths and metric recalculations after each operation. |
| [ ] | **Validate notification deletion safeguards.** | Delete items through `NotificationHistoryService.deleteNotification` and ensure confirmation flows update the table and counters. |
| [ ] | **Cover user provisioning workflows.** | Use `CreateUser` to add and edit operators, verifying permission checks, summary counter refreshes, and toast messaging. |
| [ ] | **Test targeted user messaging.** | Switch to the `UserMessage` view, compose messages, and ensure they respect role-based guards and return to the table cleanly. |
| [ ] | **Verify bulk push notification gating.** | Drive the Users table selection plus `SendForm` gating so only users with `playerId` can be targeted, warning when prerequisites fail. |
| [ ] | **Protect user status analytics.** | Assert the totals/connected/disconnected cards update after websocket or manual edits pulled from `UserService.getDashboardStats`. |
| [ ] | **Guard device registry placeholders.** | Keep the devices page rendering its placeholder state post-login to detect regressions that hide future provisioning UI. |

### Platform & Marketing Experience
| Status | Initiative | Objective |
| --- | --- | --- |
| [ ] | **Validate marketing language parity.** | Re-run the home page spec to ensure bilingual hero copy, pricing sections, and CTA buttons stay localized after i18n updates. |
| [ ] | **Exercise the public demo request form.** | Submit the `DemoForm` with success and failure states, asserting validation messaging and analytics events fire. |
| [ ] | **Verify global footer and policy links.** | Crawl the marketing shell to confirm privacy, terms, and contact routes resolve without 404s after build changes. |
| [ ] | **Cover tenant onboarding landing pages.** | Smoke test `tenant/tenant.tsx` flows to ensure multi-step onboarding renders, validates inputs, and posts via `TenantService`. |
| [ ] | **Guard global settings microsite routes.** | Navigate `globals` pages to confirm shared assets, hero media, and translations load through the static build pipeline. |

## Test Objective & Rationale
These suites provide confidence that the dashboard remains operable for security, concierge, and field
teams. By asserting the presence of mission-critical analytics, confirming that search and filtering
controls respond instantly, and safeguarding localization toggles, we prevent regressions that would
otherwise block shift changes, panic escalations, or compliance reporting. The backlog above prioritizes
multi-tenant context changes, panic response tooling, and content authoring so that the automation keeps
pace with the platform roadmap.
