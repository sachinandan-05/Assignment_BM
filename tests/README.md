# Tests

Vitest + Testing Library + fast-check + jest-axe harness.

- `tests/setup.ts` — global setup, jest-dom + jest-axe matchers, jsdom polyfills
- `tests/arbitraries.ts` — fast-check arbitraries that generate domain-typed mock data respecting model invariants
- `tests/**/*.test.ts(x)` — colocated property and unit tests

Run:

```bash
npm run test       # watch mode
npm run test:run   # single run (CI)
npm run test:ui    # vitest UI
```
