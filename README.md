<p align="center">
  <img src="./public/image/image.svg" width="220" alt="Tryvoo logo" />
</p>
<h1 align="center">Tryvoo Dashboard</h1>
<p align="center">
  Control center for Tryvoo's multi-channel operations, providing teams with real-time visibility,
  automation, and collaboration tools across the entire service lifecycle.
</p>
<p align="center">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://preactjs.com/"><img src="https://img.shields.io/badge/Preact-673AB8?style=for-the-badge&logo=preact&logoColor=white" alt="Preact" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://vitest.dev/"><img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" /></a>
  <a href="https://playwright.dev/"><img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" /></a>
</p>

## Table of Contents
- [Overview](#overview)
- [Key Capabilities](#key-capabilities)
- [Product Modules](#product-modules)
- [Architecture Highlights](#architecture-highlights)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Testing & Quality](#testing--quality)
  - [Unit Testing](#unit-testing)
  - [End-to-End Testing](#end-to-end-testing)
  - [Static Analysis & Formatting](#static-analysis--formatting)
  - [Testing Utilities](#testing-utilities)
- [Project Structure](#project-structure)
- [UI Naming Convention](#ui-naming-convention)

## Extra Documentation

- [Dates](./src/utils/utilities/README.md)
- [Network](./src/utils/network/README.md)
- [Toast](./src/utils/toast/README.md)
- [Socket](./src/utils/socket/README.md)

## Overview
Tryvoo Dashboard is the operations cockpit for Tryvoo, designed to orchestrate day-to-day
services across tenants, locations, and workforce teams. The application consolidates real-time data,
streamlines administrative tasks, and provides actionable insights so operations leaders can
respond quickly to on-site situations. Built with Preact and AWS Amplify, Tryvoo delivers a fast,
secure, and responsive experience across desktop environments.

## Key Capabilities
- **Unified tenant management** – onboard new tenants, configure service instances, and manage
  permissions from a single pane of glass.
- **Operational awareness** – monitor devices, shifts, panic alerts, memos, and correspondence in
  real time through WebSocket updates and telemetry dashboards.
- **Configurable workflows** – build and manage digital forms, access policies, and user roles tailored
  to each company or location.
- **Field collaboration** – trigger panic workflows, dispatch notifications, and share context-rich
  updates with teams in just a few clicks.
- **Data portability** – export structured information, generate printable reports, and connect to
  downstream systems via Excel, PDF, and image utilities.

## Product Modules
- **Dashboard Home** – curated overview of operations, active alerts, and quick actions.
- **Devices** – inventory management for hardware deployed at each place, including connectivity
  monitoring and assignment to tenants.
- **Forms** – low-code form builder backed by Final Form for configuring inspections, checklists,
  and service reports.
- **Shifts** – scheduling hub with drag-and-drop tooling (powered by `@dnd-kit`) for staffing and
  operational coverage planning.
- **Memos & Correspondence** – centralized communication feed to document incidents, visitor logs,
  and handovers across shifts.
- **Access Control** – role- and permission-management layer integrating tenant-specific policies and
  audit trails.
- **Users & Tenants** – administration of personnel, account provisioning through AWS Cognito, and
  company/tenant hierarchies with place selection.
- **History & Notifications** – full audit log, toast notifications, and panic modal for high-priority
  escalations.

## Architecture Highlights
- **Frontend stack** – Preact with TypeScript, Vite, Tailwind CSS, and component composition patterns
  for highly reusable UI primitives.
- **Authentication & Authorization** – AWS Amplify Authenticator integrates with Cognito for secure
  login, session management, and tenant-aware access control.
- **State management** – Signals and Zustand stores power reactive state, keeping cross-module data
  synchronized without excessive re-renders.
- **Real-time communication** – Socket connections orchestrated via the `WebSocketManager` deliver
  live updates for panic alerts, notifications, and device status changes.
- **Telemetry & Observability** – Grafana Faro instrumentation streams front-end performance and
  user journey data for proactive monitoring.
- **Localization** – `react-i18next` enables multilingual experiences with automatic language detection
  and tenant-specific content packs.
- **Maps & Geospatial context** – MapLibre integration supports geospatial visualizations for sites
  and devices.

## Getting Started
### Prerequisites
- Node.js 20+ (or Bun 1.0+ if you prefer Bun for scripts)
- pnpm, npm, or bun package manager
- Amplify environment variables configured for your target tenant

### Installation
Install dependencies with your preferred package manager:

```bash
# with bun
bun install

# or with pnpm
pnpm install

# or with npm
npm install
```

### Launch the development server
```bash
bun run start
# or: pnpm start
# or: npm run start
```
The Vite dev server runs at <http://localhost:5173> by default and proxies API traffic to
`http://localhost:3010` (see `package.json`).

## Environment Configuration
| Variable                      | Default                  | Description                                         |
| ----------------------------- | ------------------------ | --------------------------------------------------- |
| `VITE_UCA_DEFAULT_SERVICE_URL`| `http://localhost:8080/` | Base URL for the UCA services consumed by the app. |

Amplify credentials, Cognito settings, and tenant context are loaded from `src/aws-exports.ts`.
Override these values with environment-specific builds or runtime configuration in your deployment
pipeline.

## Available Scripts
| Command               | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `bun run start`       | Run the Vite development server with hot module replacement. |
| `bun run build`       | Type-check and compile an optimized production bundle.       |
| `bun run preview`     | Serve the production build locally for smoke testing.        |
| `bun run test:unit`   | Execute unit tests with Vitest.                              |
| `bun run test:cov`    | Run unit tests with coverage reporting.                      |
| `bun run test:e2e`    | Launch Playwright end-to-end test suite.                     |
| `bun run test:e2e:report` | Open the latest Playwright HTML report.                 |
| `bun run prettier`    | Format source files with Prettier according to project style.|

> Replace `bun run` with `pnpm`, `npm run`, or `yarn` depending on your tooling preference.

## Testing & Quality
Testing is automated at multiple layers to ensure the dashboard remains reliable as new features are
delivered. The following sections summarize what runs locally and in CI and how to reproduce those
checks on your machine.

### Unit Testing
- **Scope** – UI components, hooks, Zustand stores, and pure utilities.
- **Tooling** – [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/)
  for DOM assertions and accessibility queries.
- **How to run** – `bun run test:unit` (or replace `bun` with `pnpm`, `npm run`, or `yarn`).
- **Watch mode** – Add `--watch` to keep Vitest running while editing files.
- **Coverage** – `bun run test:cov` generates an HTML report in `coverage/` with branch, line, and
  statement metrics; maintainers target ≥90% coverage for core modules.

### End-to-End Testing
- **Scope** – Critical journeys such as authentication, tenant switching, panic workflows, and
  device management.
- **Tooling** – [Playwright](https://playwright.dev/) with a project configuration located in
  `playwright.config.ts`.
- **How to run** – `bun run test:e2e` executes the suite in headless Chromium by default.
- **Reports** – `bun run test:e2e:report` opens the most recent HTML report so you can inspect
  screenshots, traces, and console logs.
- **Environment** – Ensure the API server (default `http://localhost:3010`) is reachable and seeded
  with test tenants before starting the suite.

### Static Analysis & Formatting
- **ESLint** – Run `npx eslint .` (or `pnpm exec eslint .`) to enforce coding standards; the
  configuration lives in `.eslintrc.json`.
- **TypeScript** – `npx tsc --noEmit` validates type safety without generating build output.
- **Prettier** – `bun run prettier` formats files using the shared style guide.
- **Commit hooks** – Husky pre-commit hooks re-run linting and formatting to keep diffs clean.

### Testing Utilities
- **Mock services** – Shared fixtures and test harnesses live under `src/__tests__/` for unit tests
  and `tests/` for Playwright suites, keeping arrangements (API responses, Amplify auth state, etc.)
  easy to reuse.
- **CI insights** – Grafana Faro dashboards track runtime errors surfaced by automated tests and
  production telemetry so regressions are detected quickly.

## Project Structure
```bash
Tryvoo-dashboard/
├── public/                # Static assets (favicons, marketing visuals, sounds)
├── src/
│   ├── app.tsx            # Root application shell and Amplify integration
│   ├── main.tsx           # Entry point bootstrapping Preact
│   ├── assets/            # Global styles, icons, fonts, and media
│   ├── components/
│   │   ├── common/        # Shared UI primitives (inputs, dropdowns, sidebar, modals)
│   │   ├── compose/       # Complex widgets combining multiple primitives
│   │   └── utils/         # Component helpers and styling utilities
│   ├── pages/             # Feature modules (dashboard, home, settings, tenant, etc.)
│   ├── services/          # API clients (Company, Place, Tenant, Role, BaseService)
│   ├── store/             # Zustand slices and signal-based state management
│   ├── utils/             # Cross-cutting helpers (routing, network, telemetry, storage)
│   ├── i18n/              # Localization setup and resource bundles
│   └── types/             # Shared TypeScript interfaces and enums
├── tests/                 # Playwright e2e suites
├── vite.config.ts         # Vite configuration with Preact preset
└── vitest.config.ts       # Vitest configuration for unit testing
```

## UI Naming Convention
All DOM element IDs follow the pattern `vx-{element}-{page}-{name}` to keep selectors and telemetry
consistent across teams. Element abbreviations:

## Pipeline QA

For GitHub Actions automation to run successfully on pull requests targeting the `QA` branch, make sure the workflow includes the following primary steps:

```yaml
name: QA Validation

on:
  pull_request:
    branches:
      - QA

jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - run: pnpm run test:unit
      - run: pnpm run test:cov
      - run: pnpm run test:e2e
```

This pipeline installs project dependencies, prepares Playwright browsers, and runs the unit, coverage, and end-to-end suites defined in `package.json`.

## Frontend Element ID Abbreviations

1. `input` → `inp`
2. `checkbox` → `che`
3. `radiobutton` → `rdb`
4. `switch` → `swt`
5. `dropdown` → `dpn`
6. `number` → `nmr`
7. `textarea` → `txa`
8. `button` → `btn`

Adhering to this convention ensures UI automation, analytics, and QA scenarios remain reliable as the
interface evolves.
