# Coding Conventions

**Analysis Date:** 2026-03-15

## Naming Patterns

**Files:**
- Component files: PascalCase (e.g., `TipCard.tsx`, `CategoryBadge.tsx`)
- Utility/lib files: camelCase (e.g., `tips.ts`, `blog.ts`, `types.ts`)
- Content data files: kebab-case (e.g., `editor-downgrade-unreal-asset.ts`, `debugging-visual-logger.ts`)
- Layout/app files: camelCase pages with file-based routing (e.g., `page.tsx`, `layout.tsx`)

**Functions:**
- Component functions: PascalCase (e.g., `export default function TipCard()`)
- Utility functions: camelCase (e.g., `getAllTips()`, `getTipBySlug()`, `renderBlock()`)
- Event handlers: camelCase prefixed with `handle` (e.g., `handleSelect()`, `handleChange()`)
- Type guards: camelCase suffixed with `is` or `can` (e.g., `isValidCategory()`)

**Variables:**
- Constants: UPPERCASE_SNAKE_CASE for module-level config objects (e.g., `CATEGORIES`, `CUSTOM_VERSIONS`, `VALID_CATEGORIES`)
- Regular variables: camelCase (e.g., `latestTips`, `current`, `filtered`)
- Boolean variables: prefix with `is`, `has`, or `can` (e.g., `aria-pressed={current === value}`)

**Types:**
- Interfaces: PascalCase prefixed with descriptive domain (e.g., `TipCardProps`, `BlogCardProps`, `CategoryBadgeProps`)
- Type aliases: PascalCase (e.g., `Category`, `Tip`, `BlogPost`, `TipContent`)
- Generic parameters: Single uppercase letter (e.g., `<Record<Category, { label: string; className: string }>`)

## Code Style

**Formatting:**
- Line ending: 2 spaces for indentation (inferred from file structure)
- Trailing commas: Used in multi-line arrays and objects (see `package.json`, tip content arrays)
- Semicolons: Present on all statements
- Line length: Flexible, following Next.js conventions

**Linting:**
- Tool: `eslint-config-next` (ESLint v9)
- Run command: `npm run lint` → invokes `next lint`
- No explicit `.eslintrc` or config file found; uses Next.js default linting rules

**Imports/Exports:**
- File exports: Use `export default` for React components
- Type exports: Use `export type` for TypeScript types and interfaces
- Const exports: Use `export const` for utility functions and data (e.g., `export const allTips: Tip[]`)

## Import Organization

**Order:**
1. External libraries (React, Next.js): `import type { Metadata } from 'next'`, `import { useRouter } from 'next/navigation'`
2. Next.js components: `import Link from 'next/link'`, `import Image from 'next/image'`
3. Type imports: `import type { Tip, Category } from '@/lib/types'`
4. Local component imports: `import TipCard from '@/components/tips/TipCard'`
5. Local utility/lib imports: `import { getAllTips } from '@/lib/tips'`

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Used consistently throughout: `@/components/...`, `@/lib/...`, `@/content/...`

## Error Handling

**Patterns:**
- No explicit error throwing or try-catch blocks observed in source files
- Defensive null coalescing: Uses `??` operator (e.g., `const level = block.level ?? 2`, `const current = searchParams.get('category') ?? 'all'`)
- Optional chaining: Uses `?.` for safe property access (e.g., `post.image`, `block.items?.map()`)
- Undefined/null checks: Conditional rendering (e.g., `{post.image ? ... : ...}`, `{filtered.length === 0 ? ... : ...}`)
- Fallback patterns: Ternary operators and Suspense boundaries for client components

## Logging

**Framework:** Not used - no logging calls detected in source code

## Comments

**When to Comment:**
- Phase markers used: Comments like `// PHASE 1: DONE`, `// PHASE 2: DONE` mark completion of implementation phases
- Inline explanations: Rare; code is self-documenting through clear naming
- Section labels: Used sparingly for complex layout sections (see `src/app/page.tsx` with `{/* Hero + About — combined section ... */}`)
- JSDoc: Not used; TypeScript types provide sufficient documentation

**Comment Style:**
- Single-line comments use `//`
- Multi-line comments use `{/* ... */}` in JSX for clarity

## Function Design

**Size:**
- Components: 30-100 lines typical (TipCard, CategoryBadge, Header)
- Render functions: 50-80 lines with complex conditional rendering (renderBlock in TipDetail.tsx)
- Utilities: 5-15 lines with focused responsibility (getAllTips, getTipBySlug, getTipsByCategory)

**Parameters:**
- Object destructuring preferred: `function TipCard({ tip }: TipCardProps)`
- Props interfaces always defined: `interface TipCardProps { tip: Tip }`
- Single props parameter standard for React components

**Return Values:**
- React components: Return JSX or JSX.Element
- Utility functions: Return typed values (Array, undefined, filtered collections)
- Null checks: Use optional returns (e.g., `function getTipBySlug(): Tip | undefined`)

## Module Design

**Exports:**
- Content modules export single named export: `export const tip: Tip = { ... }`
- Data modules export arrays: `export const allTips: Tip[] = [ ... ]`
- Utility modules export named functions: `export function getAllTips()`, `export function getTipBySlug()`
- Component modules export default component: `export default function TipCard()`

**Barrel Files:**
- Used in content: `src/content/tips/index.ts` imports and re-exports all tips
- Used in content: `src/content/blog/index.ts` imports and re-exports all blog posts
- Structure: Import individual modules, export collected array for convenience

**Client/Server Markers:**
- `'use client'` directive used for interactive components: `CategoryFilter.tsx`, `BlogCard.tsx`, `TipsGrid.tsx`
- Server components: Default for pages and data-fetching layouts (page.tsx, layout.tsx)
- Clean separation maintained between client-side state and server-side data

## TypeScript Configuration

**Strict Mode:**
- `"strict": true` enabled in `tsconfig.json`
- All types explicitly defined; no implicit `any`
- Union types used for discriminated types: `type Category = 'editor' | 'debugging' | 'qa-workflow'`
- Tagged unions for content blocks: `type TipContent = { type: 'paragraph' | 'heading' | ... }`

**Common Patterns:**
- Record types for configuration maps: `Record<Category, { label: string; className: string }>`
- Readonly props: `Readonly<{ children: React.ReactNode }>` in RootLayout
- Type guards: `isValidCategory()` as type predicate for discriminating union types

## Styling

**Framework:** Tailwind CSS v3.4.17

**Patterns:**
- Inline classes: All styling through Tailwind utility classes
- Color scheme: Dark theme with accent colors (violet-400, violet-500, violet-700, etc.)
- Spacing: Consistent use of Tailwind scale (px-4, gap-3, mt-8, mb-3, etc.)
- Responsive: Mobile-first with `sm:`, `lg:` breakpoints
- Hover states: `hover:text-violet-300`, `hover:border-violet-700/60`
- Transitions: `transition-colors duration-300`, `transition-all duration-300`
- Shadows: Custom via inline styles for complex gradients; Tailwind shadows for standard effects

**Reusable Patterns:**
- Category color mapping via Record object: `categoryConfig: Record<Category, { label: string; className: string }>`
- Button states: Active/hover classes stored in object arrays for reuse (CategoryFilter)
- Card container pattern: Repeated `rounded-xl border border-zinc-800 bg-zinc-900/50` structure

---

*Convention analysis: 2026-03-15*
