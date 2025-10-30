# Frontend Improvement Backlog

## Priority 1 — Foundation
- Wire up project hygiene: add ESLint + Prettier (with `npm run lint`/`npm run format`), enable Vitest + Testing Library, and make CI run `npm run test`. Tighten `tsconfig.json` (`noUnusedLocals`, `noImplicitReturns`, `exactOptionalPropertyTypes`) so unused imports like `ListGroup` or `BookSearchResultItem` fail fast.
- Replace hard-coded axios base URLs with a single `VITE_API_BASE_URL`, validate it on boot, and update `.env.template`/deployment docs so production builds stop ignoring environment configuration.

## Priority 2 — User Experience
- Convert `BookSearchBar` into a controlled component (stateful `value` instead of static `selected`) with labeled search options, keyboard handling, and a submit callback that triggers the API.
- Finish the auth story: move TODO login logging into a dedicated auth hook/slice, surface success/error feedback in `LoginDialog`, and show authenticated state (token storage, logout) in `TopBar`.

## Priority 3 — Data & Architecture
- Introduce a query/caching layer (e.g., React Query or SWR) for `BookTable` and `BookDetails` so fetches are cached, deduped, and cancellable; handle aborts on modal close or component unmount to avoid React 18 state warnings.
- Add component/integration coverage for key flows (Home → Browse, modal open/close, error retries) with Vitest + Testing Library or Playwright.

## Priority 4 — Cleanup & Structure
- Prune or relocate playground components (`Message.tsx`, unused Book search result display) and move toward a feature-first directory layout (`features/books`, `features/auth`) with shared UI primitives stored separately.
