# Testing Patterns

**Analysis Date:** 2026-03-15

## Test Framework

**Runner:**
- No test runner configured or detected
- No test files found in `src/` directory
- `package.json` contains no testing dependencies (Jest, Vitest, etc.)

**Assertion Library:**
- Not applicable - no testing framework present

**Run Commands:**
- No test commands defined in `package.json`
- Suggestion for future setup: `npm run test` (not currently implemented)

## Test File Organization

**Location:**
- No test files present in codebase
- Standard convention would be: co-located with source files or in `src/__tests__/`

**Naming:**
- Standard Node.js/JavaScript convention (if implemented): `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`

**Structure:**
- Not applicable - no existing test structure

## Test Structure

**Suite Organization:**
- Not applicable - no tests exist
- Recommended approach based on codebase patterns:
  - Component tests: Test props interface, rendering, event handlers
  - Utility tests: Test function return values and edge cases
  - Integration tests: Test data flow from content modules through utilities to components

**Patterns:**
- Setup pattern: Not established
- Teardown pattern: Not established
- Assertion pattern: Not established

## Mocking

**Framework:**
- Not applicable - no mocking framework present

**Patterns:**
- Recommended for future tests:
  - Mock `next/navigation` hooks: `useRouter()`, `useSearchParams()`
  - Mock `next/image` for Image components
  - Mock content modules for unit testing utilities
  - Mock fetch for API-based utilities (if added)

**What to Mock:**
- External Next.js hooks (routing, navigation)
- Next.js built-in components (Image, Link with data)
- Content modules when testing filtering/sorting utilities
- API calls (if data fetching is added)

**What NOT to Mock:**
- Pure utility functions (getTipBySlug, getAllTips)
- Type definitions
- Component composition (render actual child components in integration tests)

## Fixtures and Factories

**Test Data:**
- No fixtures currently defined
- Recommended approach: Create factory functions matching existing data structures

Example fixture structure (future implementation):
```typescript
// src/__fixtures__/tips.ts
import type { Tip } from '@/lib/types'

export const mockTip: Tip = {
  slug: 'test-tip',
  title: 'Test Tip',
  category: 'editor',
  summary: 'A test tip for testing',
  tags: ['test'],
  publishedAt: '2026-03-15',
  content: [
    { type: 'paragraph', text: 'Test content' }
  ],
}

export const mockTips: Tip[] = [mockTip]
```

**Location:**
- Would be: `src/__fixtures__/` or `src/__mocks__/`

## Coverage

**Requirements:**
- No coverage requirements enforced
- Recommended targets (not currently implemented):
  - Utilities: 100% coverage
  - Components: 80%+ coverage
  - Pages: 50%+ coverage (less critical for static pages)

**View Coverage:**
- Not applicable - no test framework set up
- Future setup would use: `npm run test -- --coverage`

## Test Types

**Unit Tests:**
- Scope: Individual utility functions and pure components
- Target files: `src/lib/*.ts`, simple components like `Tag.tsx`, `CategoryBadge.tsx`
- Approach: Test function inputs/outputs, component rendering with different props
- Examples:
  - `getTipBySlug('nonexistent')` returns `undefined`
  - `getTipsByCategory('editor')` filters correctly
  - `CategoryBadge` renders correct label and styling for each category

**Integration Tests:**
- Scope: Component interaction with hooks and data flow
- Target files: `TipsGrid.tsx`, `CategoryFilter.tsx` (interaction between components and routing)
- Approach: Render component with mocked router, test filtering workflow
- Examples:
  - Click category button → router.push called with correct query
  - URL search params update → filtered tips display updates

**E2E Tests:**
- Framework: Not used
- Would test: Full page navigation, filtering, blog/tips browsing
- Recommendation: Add Playwright or Cypress if needed for production validation

## Accessibility Testing

**No explicit accessibility tests:**
- Codebase uses semantic HTML: `<article>`, `<header>`, `<section>`, `<time>`
- ARIA attributes present: `role="group"`, `aria-label`, `aria-pressed`, `aria-hidden`
- Recommendation: Add accessibility testing to verify ARIA attributes and keyboard navigation

## Static Analysis

**TypeScript:**
- Strict mode enabled in `tsconfig.json`
- Compiler provides type checking: `npm run build` will catch type errors
- No runtime type validation library (consider adding for content data)

**ESLint:**
- Configuration: `eslint-config-next` v9
- Run: `npm run lint`
- Enforces Next.js best practices but no custom rules observed

## Common Patterns

**Async Testing:**
- Not applicable - no async/await logic in components
- Future pattern (if needed):
```typescript
// Example: Test async data loading
describe('getBlogPost', () => {
  it('should fetch post and return data', async () => {
    const post = await getBlogPost('slug')
    expect(post).toBeDefined()
  })
})
```

**Error Testing:**
- Current pattern: Null coalescing and optional chaining prevent errors
- Future pattern (for edge cases):
```typescript
describe('getTipBySlug', () => {
  it('should return undefined for nonexistent slug', () => {
    const result = getTipBySlug('nonexistent')
    expect(result).toBeUndefined()
  })

  it('should return tip for valid slug', () => {
    const result = getTipBySlug('debugging-visual-logger')
    expect(result?.title).toBe('Debugging with the Visual Logger')
  })
})
```

**Component Event Testing:**
- Future pattern (for interactive components):
```typescript
describe('CategoryFilter', () => {
  it('should call router.push when category is selected', () => {
    const mockRouter = { push: jest.fn() }
    // Mock useRouter to return mockRouter
    render(<CategoryFilter />)

    const editorButton = screen.getByRole('button', { name: 'Editor' })
    fireEvent.click(editorButton)

    expect(mockRouter.push).toHaveBeenCalledWith('/tips/?category=editor', expect.any(Object))
  })
})
```

## Recommended Testing Setup

**To implement testing:**

1. Add dependencies:
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

2. Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

3. Add to `package.json` scripts:
```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
}
```

4. Create `src/__tests__/setup.ts` for global test configuration

5. Start with utility function tests before component tests

---

*Testing analysis: 2026-03-15*
