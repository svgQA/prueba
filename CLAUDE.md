# Voxline Dashboard Development Guide

## Commands
- Start dev server: `npm run start` or `bun start`
- Build project: `npm run build` or `bun build`
- Preview build: `npm run preview` or `bun preview`
- Run all tests: `npm run test` or `bun test`
- Run single test: `npx vitest run src/__tests__/path/to/test.spec.tsx`
- E2E test report: `npm run test:e2e:report`
- Format code: `npm run prettier`

## Code Style
- **Types**: Interfaces in `interface.d.ts` files, prefixed with 'I' (e.g., `IButtonProps`)
- **Imports**: Group by source - React first, then libraries, then internal modules
- **Components**: Functional components using arrow functions with destructured props
- **Naming**: PascalCase for components/interfaces, camelCase for variables/functions
- **File Structure**: Component files with interface.d.ts, componentName.tsx
- **Error Handling**: Try/catch for async, toast notifications for user errors
- **State**: @preact/signals for local state, custom hooks for shared logic
- **Testing**: Organized in describe/it blocks with testing-library
- **Styling**: Tailwind CSS with conditional classes