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
- [ ] **Cover tenant, company, and place switching.** Automate the selectors backed by `useUserStore`
  and local storage to ensure context changes trigger WebSocket reconnections and persist across reloads.
- [ ] **Validate the panic workflow end-to-end.** Seed or stub panic alerts, open the panic modal, and
  assert status transitions (via `PanicService`) propagate to both the table and the real-time widget.
- [ ] **Exercise notification authoring.** Drive the `HistoryForm` modal to create or edit a
  notification and confirm the list refreshes, protecting the orchestration pipeline.
- [ ] **Test memo resolution details.** Expand coverage for memo expandable panels to ensure panic vs.
  novelty timelines render, matching the supervisor workflow in `memos.page.tsx`.
- [ ] **Verify form response exports.** Trigger the download logic in `forms/response` to guarantee the
  Excel/PDF utilities keep working after dependency upgrades.

## Test Objective & Rationale
These suites provide confidence that the dashboard remains operable for security, concierge, and field
teams. By asserting the presence of mission-critical analytics, confirming that search and filtering
controls respond instantly, and safeguarding localization toggles, we prevent regressions that would
otherwise block shift changes, panic escalations, or compliance reporting. The backlog above prioritizes
multi-tenant context changes, panic response tooling, and content authoring so that the automation keeps
pace with the platform roadmap.
