# Phase 1: Design System - Research

**Researched:** 2026-03-15
**Domain:** Tailwind CSS semantic tokens, visual identity migration, Framer Motion animations, Next.js App Router
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Palette kraft/industrielle**
- Background principal: `#FAFAF7` — blanc cassé chaud
- Surface secondaire (cards, panels): `#F0EBE0` — offset chaud subtil
- Texte principal: `#1A1816` — noir chaud légèrement brunâtre
- Accent: `#C85A3A` — rouille/terra cotta
- Texte secondaire/muted: Claude's discretion — warm mid-gray cohérent (ex. ~#7A6F68)
- Border: Claude's discretion — subtil, tirant sur le beige/sable (ex. ~#E2D9CE)

**Tokens sémantiques Tailwind (DSGN-01)**
Tokens à extraire dans `tailwind.config.ts` AVANT toute modification de composant:
```
surface        → #FAFAF7
surface-raised → #F0EBE0
text-primary   → #1A1816
text-muted     → ~#7A6F68
accent         → #C85A3A
accent-hover   → Claude's discretion (version plus sombre de l'accent)
border         → ~#E2D9CE
```
Les tokens remplacent TOUTES les valeurs hardcodées zinc/violet dans Header, Footer, Tag, CodeBlock.

**Navigation**
- Ordre des liens: Blog → Projects → About (gauche à droite après le nom)
- Logo/identité: "Tommy Lahitte" en texte à gauche — nom complet, pas de monogramme
- Comportement scroll: sticky transparent en haut → fond `surface` opaque au scroll (avec légère bordure bottom)
- Mobile: liens visibles et compressés directement — pas de hamburger (3 liens c'est gérable)
- Liens phase 1: Projects et About sont dans la nav dès maintenant même si les pages n'existent pas

**Micro-animations (DSGN-03)**
- Niveau général: présence modérée — transitions 250-350ms, easing naturel
- Librairie: Framer Motion avec AnimatePresence pour transitions de pages
- Transitions de pages: fade/slide via AnimatePresence — doux, 250-300ms
- Hover cards: `translateY(-2px)` + ombre légère
- Hover liens nav: transition de couleur vers `accent`
- Focus states: outline visible, cohérent avec l'accent rouille

### Claude's Discretion
- Valeurs exactes de `text-muted` et `border` (dans la gamme indiquée)
- Valeur exacte de `accent-hover` (variante sombre de l'accent)
- Easing curve pour les animations (ease-out standard recommandé)
- Implémentation précise du header transparent → opaque (threshold de scroll)
- Espace et taille de typographie (Inter reste la police, Claude décide des tailles et poids)

### Deferred Ideas (OUT OF SCOPE)
- Fusion Blog + Tips en une section unifiée — Phase 2
- Page `/about` et `/projects` — pages créées en Phase 3 et 4, la nav pointe dessus mais le contenu arrive plus tard
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DSGN-01 | Le design system extrait des tokens sémantiques Tailwind (`surface`, `text-primary`, `text-muted`, `accent`, `border`) avant toute modification de composant | Tailwind v3 `theme.extend.colors` with CSS custom property bridge in `globals.css` |
| DSGN-02 | L'identité visuelle maker appliquée — palette kraft/beige, typographie précise, espacement généreux, allègement du style actuel "AI-générique" | Full palette migration from zinc-dark + violet to kraft/industrial. All components identified with hardcoded values to replace. |
| DSGN-03 | Les micro-animations sobres implémentées sur les interactions clés (hover cards, transitions de pages, états de focus) | Framer Motion (motion) v12.x confirmed compatible with Next.js 15.2.3 + React 19. `app/template.tsx` pattern for page transitions. |
</phase_requirements>

---

## Summary

The project is a Next.js 15.2.3 / React 19 personal portfolio currently styled with a dark zinc + violet palette. The entire visual identity needs to be replaced with a kraft/industrial warm light palette. The codebase has zero abstraction today — every component uses hardcoded Tailwind color classes (`text-zinc-100`, `bg-zinc-950`, `hover:text-violet-300`) directly.

Phase 1 is purely a design system foundation phase. No new routes, no new content, no Notion integration. The work is: (1) define semantic tokens in `tailwind.config.ts`, (2) update CSS custom properties in `globals.css`, (3) migrate all existing components to use those tokens, (4) rebuild the Header component with new identity and scroll behavior, (5) add Framer Motion for page transitions and card hover interactions.

Framer Motion has been rebranded to `motion` and is fully compatible with React 19 and Next.js 15. The recommended pattern for App Router page transitions is `app/template.tsx` with `"use client"` — this is the stable 2025 approach. AnimatePresence for full exit animations across routes remains fragile in App Router; the `template.tsx` entry-only pattern is the pragmatic choice.

**Primary recommendation:** Define tokens in `tailwind.config.ts` using CSS custom properties bridged from `globals.css`, then migrate components one-by-one, then add Framer Motion last.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 3.4.17 (already installed) | Utility-first styling + semantic token layer | Already in the project; v3 `theme.extend.colors` is the right extension point |
| motion (framer-motion) | 12.x | Page transitions, hover animations, AnimatePresence | Rebranded from `framer-motion`, confirmed React 19 + Next.js 15 compatible |
| next/navigation `usePathname` | Built-in Next.js 15 | Key prop for AnimatePresence page transitions | Required to detect route changes in App Router |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React `useState` + `useEffect` | Built-in React 19 | Scroll position tracking for header opacity | Lightweight — no extra library needed for a scroll threshold |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `motion` (framer-motion) | Native CSS transitions | CSS covers hover transitions already; Motion needed specifically for AnimatePresence page transitions and `translateY` hover with shadow |
| `motion` (framer-motion) | View Transitions API | View Transitions API is Chrome 111+/Safari 18+ only — still risky for broad support in 2026 |
| Custom scroll hook | scroll-driven CSS animations | CSS scroll-driven animations are elegant but lack broad Firefox support as of early 2026; JS hook is safer |

**Installation:**
```bash
npm install motion
```

---

## Architecture Patterns

### Recommended Project Structure

No new directories needed. Changes are confined to existing files plus one new file:

```
src/
├── app/
│   ├── globals.css          # CSS custom properties — extend with new palette tokens
│   ├── layout.tsx           # Update body classes from zinc-950 to bg-surface text-primary
│   └── template.tsx         # NEW — "use client" Framer Motion page transition wrapper
├── components/
│   └── layout/
│       ├── Header.tsx       # Full rebuild: new identity, scroll behavior, new links
│       └── Footer.tsx       # Token migration only (zinc → semantic tokens)
├── components/ui/
│   ├── Tag.tsx              # Token migration only
│   └── CodeBlock.tsx        # Token migration only (code block needs light-mode equivalents)
└── tailwind.config.ts       # Extend colors with 7 semantic tokens
```

### Pattern 1: Two-Layer Token Architecture (CSS vars + Tailwind)

**What:** Define colors as CSS custom properties in `:root` (globals.css), then reference them in `tailwind.config.ts`. This means tokens are accessible both as Tailwind classes AND as `var(--token)` in CSS.

**When to use:** Always — this is the pattern already established in the project (`--background`, `--foreground`) and must be extended consistently.

**Example:**
```typescript
// tailwind.config.ts
const config: Config = {
  theme: {
    extend: {
      colors: {
        // Existing pattern — extend it:
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // New semantic tokens:
        surface: 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        border: 'var(--border)',
      },
    },
  },
}
```

```css
/* globals.css — :root */
:root {
  /* Keep existing vars for backwards compat, update their values */
  --background: #FAFAF7;
  --foreground: #1A1816;
  /* New tokens */
  --surface: #FAFAF7;
  --surface-raised: #F0EBE0;
  --text-primary: #1A1816;
  --text-muted: #7A6F68;
  --accent: #C85A3A;
  --accent-hover: #A8432A;   /* ~20% darker than accent */
  --border: #E2D9CE;
}
```

**Usage in components:**
```tsx
// Before:
<div className="bg-zinc-950 text-zinc-100 border border-zinc-800">
// After:
<div className="bg-surface text-text-primary border border-border">
```

### Pattern 2: Scroll-Aware Header (Client Component)

**What:** Header as a `"use client"` component that tracks scroll position and switches between transparent and opaque backgrounds.

**When to use:** Required for the Header per locked decisions.

**Example:**
```tsx
// src/components/layout/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface border-b border-border'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-text-primary">
            Tommy Lahitte
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link href="/blog" className="text-sm font-medium text-text-muted hover:text-accent transition-colors">
              Blog
            </Link>
            <Link href="/projects" className="text-sm font-medium text-text-muted hover:text-accent transition-colors">
              Projects
            </Link>
            <Link href="/about" className="text-sm font-medium text-text-muted hover:text-accent transition-colors">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

### Pattern 3: Page Transitions via `app/template.tsx`

**What:** Next.js App Router's `template.tsx` re-renders on every navigation, making it the stable hook point for page entry animations. Unlike `layout.tsx` which persists across navigations, `template.tsx` mounts fresh on each route change.

**When to use:** Required for page transition animations. This is the 2025 recommended pattern — `AnimatePresence` wrapping across routes is fragile in App Router.

**Example:**
```tsx
// src/app/template.tsx
'use client'

import { motion } from 'motion/react'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

### Pattern 4: Card Hover with Framer Motion

**What:** Cards receive `translateY(-2px)` + shadow lift on hover using Framer Motion `whileHover`.

**When to use:** On BlogCard and future project cards. Delivers the "physical object lifting" feel from locked decisions.

**Example:**
```tsx
// In BlogCard.tsx — replace the Tailwind hover classes
import { motion } from 'motion/react'

<motion.div
  whileHover={{ y: -2, boxShadow: '0 8px 24px -4px rgba(200, 90, 58, 0.12)' }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  {/* card content */}
</motion.div>
```

### Anti-Patterns to Avoid

- **Mixing semantic and raw tokens:** Never write `text-zinc-500` alongside `text-text-muted` in the same codebase. After migration, raw zinc/violet classes must be completely absent from component files.
- **Animating layout properties:** Don't animate `height`, `width`, or `padding` for hover effects — use `transform` (via `y`, `scale`) only. Layout animations trigger reflows.
- **AnimatePresence wrapping layout.tsx children directly:** This pattern is unstable in App Router. Use `template.tsx` for page transitions instead.
- **Keeping `--background: #09090b` in globals.css:** The existing dark CSS vars will conflict if not replaced. The body class in `layout.tsx` (`bg-zinc-950`) must also be removed and replaced with `bg-surface`.
- **Hero component's conic-gradient spin halo:** This violet/cyan spinning animation is phase-specific but not addressed in Phase 1 scope. The Hero exists but its internal violet colors are flagged — do not touch the Hero internals in Phase 1 (it ships as-is until Phase 4).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Page transitions | Custom CSS keyframe + route listener | `motion/react` + `template.tsx` | App Router lifecycle is non-trivial; Motion handles mount/unmount cleanly |
| Hover animations | Tailwind `hover:` classes for transform+shadow combo | `motion/react` `whileHover` | Framer Motion handles spring physics and combined transform+shadow atomically |
| Scroll threshold detection | `IntersectionObserver` with sentinel div | Simple `window.scrollY` in `useEffect` | A pixel threshold (48px) doesn't need an observer — direct scroll listener is simpler and sufficient |

**Key insight:** The animation requirements are minimal by design (250-350ms, ease-out, no complex orchestration). Framer Motion is warranted for AnimatePresence + `whileHover` API ergonomics, not for complex sequencing. Keep usage intentionally simple.

---

## Common Pitfalls

### Pitfall 1: CSS Custom Property Name Collision

**What goes wrong:** The existing `globals.css` defines `--background` and `--foreground` pointing to dark colors. If you only add new tokens without updating the old ones, some components using `bg-background` will stay dark while others using `bg-surface` are light.

**Why it happens:** The project already uses `--background`/`--foreground` bridged through `tailwind.config.ts`. These must be updated in sync.

**How to avoid:** Update `--background` to point to `#FAFAF7` (same as `--surface`) and `--foreground` to `#1A1816` (same as `--text-primary`). Both old and new token names then resolve to the kraft palette.

**Warning signs:** Body background stays dark after token migration. Check `layout.tsx` — the body has hardcoded `bg-zinc-950` that must be replaced.

### Pitfall 2: `motion/react` Import vs. `framer-motion`

**What goes wrong:** framer-motion has been rebranded. Installing `framer-motion` still works (it's maintained at v12.x), but the new canonical import is `motion/react`. Mixing both in the same project causes duplicate bundle weight.

**Why it happens:** The ecosystem is mid-transition. Many tutorials and Stack Overflow answers still use `import { motion } from 'framer-motion'`.

**How to avoid:** Install the `motion` package and use `import { motion, AnimatePresence } from 'motion/react'` throughout. Verify with `npm ls motion framer-motion` — only one should be present.

**Warning signs:** Bundle size unexpectedly large; ESLint import resolver warnings about duplicate motion packages.

### Pitfall 3: Motion Components in Server Components

**What goes wrong:** Using `motion.div` or any Framer Motion component in a Server Component crashes at build time.

**Why it happens:** Framer Motion relies on browser APIs and React hooks — incompatible with RSC rendering.

**How to avoid:** Any component file that imports from `motion/react` must have `'use client'` as the first line. This applies to: `Header.tsx`, `template.tsx`, `BlogCard.tsx` (already has it), any card component with `whileHover`.

**Warning signs:** Build error: "You're importing a component that needs ... it only works in a Client Component."

### Pitfall 4: CodeBlock in Light Mode

**What goes wrong:** `CodeBlock.tsx` uses `bg-zinc-900` / `text-zinc-200` — a dark code block. On a light page, this can look intentional (common pattern) OR jarring depending on contrast. The current implementation uses inline dark styling.

**Why it happens:** Code blocks traditionally use dark backgrounds regardless of page theme.

**How to avoid:** The safest migration is to keep CodeBlock's internal dark styling as-is (it's a conventional dark-on-light contrast choice) but update the outer border from `border-zinc-800` to `border-border`. This keeps the code block legible while participating in the token system.

**Warning signs:** Code blocks visually "float" too aggressively or lose contrast on the warm light background.

### Pitfall 5: Badge Glow CSS in globals.css

**What goes wrong:** `globals.css` contains `.badge-glow` styles using `var(--badge-glow)` and `var(--badge-border)`. These are component-specific CSS vars set inline. They don't conflict with the new palette tokens directly, but the `.badge-glow` animation was designed for the dark zinc theme and will look wrong on the warm light background.

**Why it happens:** The CategoryBadge component in Tips uses badge-glow — it's still live code.

**How to avoid:** Review `CategoryBadge.tsx` during migration. Update badge glow colors to use the accent palette (`--accent`) rather than the old violet values.

---

## Code Examples

Verified patterns for this specific migration:

### Complete tailwind.config.ts

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        border: 'var(--border)',
      },
      fontFamily: {
        display: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

### Complete globals.css :root section

```css
:root {
  /* Legacy aliases — kept for backwards compat, updated values */
  --background: #FAFAF7;
  --foreground: #1A1816;
  /* Semantic kraft palette */
  --surface: #FAFAF7;
  --surface-raised: #F0EBE0;
  --text-primary: #1A1816;
  --text-muted: #7A6F68;
  --accent: #C85A3A;
  --accent-hover: #A8432A;
  --border: #E2D9CE;
}
```

### layout.tsx body class migration

```tsx
// Before:
<body className="bg-zinc-950 text-zinc-100 flex flex-col min-h-screen">
// After:
<body className="bg-surface text-text-primary flex flex-col min-h-screen">
```

### Tag.tsx token migration

```tsx
// Before:
<span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
// After:
<span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-surface-raised text-text-muted border border-border">
```

### Footer.tsx token migration (key classes)

```tsx
// Before: border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-violet-400 text-zinc-500
// After:  border-border   bg-surface   text-text-muted hover:text-accent  text-text-muted
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import { motion } from 'framer-motion'` | `import { motion } from 'motion/react'` | Late 2024 | New package name; API identical |
| `AnimatePresence` in `_app.tsx` (Pages Router) | `app/template.tsx` with motion wrapper | Next.js 13+ (App Router) | template.tsx re-renders on nav, layout.tsx does not |
| Hardcoded Tailwind color classes | Semantic tokens via `theme.extend.colors` + CSS vars | Design system best practice, accelerated by Tailwind v4 trends | Enables future theming; eliminates color-hunting during refactors |

**Deprecated/outdated in this project:**
- `bg-zinc-950`, `text-zinc-100`, `text-zinc-400`, `text-zinc-500`, `border-zinc-800`: All to be replaced by semantic tokens
- `text-violet-300`, `text-violet-400`, `hover:text-violet-300`, `hover:text-violet-400`, `ring-violet-500`: All violet references — replace with `accent` or `text-primary`
- `--accent: #8b5cf6` in globals.css: Replaced by `#C85A3A`

---

## Open Questions

1. **CodeBlock dark theme on light background**
   - What we know: Current CodeBlock uses `bg-zinc-900`/`text-zinc-200` — a dark code block on a now-light page
   - What's unclear: Whether the contrast is intentional (acceptable) or should be lightened
   - Recommendation: Keep dark code block (industry convention); only update outer border to `border-border`. Revisit in Phase 2 if feedback indicates it's jarring.

2. **Hero component violet animations**
   - What we know: `Hero.tsx` has a conic-gradient spinning glow in violet/cyan and a `ring-violet-500` on the avatar image
   - What's unclear: Phase 1 scope says components used in the current site should use tokens — but Hero is also going to be rebuilt in Phase 4
   - Recommendation: Migrate Hero's Tailwind color classes to semantic tokens in Phase 1 (the spinning halo can use `accent` instead of violet). This prevents the page having a mixed palette.

3. **Tips section badge-glow colors**
   - What we know: `CategoryBadge.tsx` uses `--badge-glow`/`--badge-border`/`--badge-text` CSS vars set inline on each badge
   - What's unclear: These vars are set with violet/teal/orange values per category
   - Recommendation: Update the per-badge inline styles to use accent-palette-adjacent colors (warm reds, ambers) instead of violet/teal. Low-priority cosmetic change — can be done as part of Token Migration task.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — Wave 0 gap |
| Config file | None — see Wave 0 |
| Quick run command | `npm run build` (build verification, no test framework) |
| Full suite command | `npm run build && npm run lint` |

No testing framework (Jest, Vitest, Playwright) is installed in the project. Given the purely visual/CSS nature of this phase, automated unit tests provide limited value. The meaningful validation for this phase is:

1. **Build passes** (`npm run build`) — confirms no TypeScript errors, no import failures
2. **Lint passes** (`npm run lint`) — confirms code quality
3. **Visual inspection** — semantic token coverage, correct palette, responsive nav

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DSGN-01 | Semantic tokens defined in tailwind.config.ts | manual-only | `grep -r "bg-zinc\|text-zinc\|border-zinc\|text-violet\|bg-violet" src/components src/app` should return 0 results | N/A |
| DSGN-01 | Tokens referenced in globals.css :root | manual-only | `grep "surface\|text-primary\|text-muted\|accent\|border" tailwind.config.ts` returns all 7 tokens | N/A |
| DSGN-02 | All hardcoded zinc/violet classes removed from components | manual-only | grep audit (see DSGN-01 command above) | N/A |
| DSGN-02 | Body background is warm light (not dark) | smoke | `npm run build` succeeds; visual browser check | N/A |
| DSGN-03 | Framer Motion installed and page transitions work | smoke | `npm run build` succeeds (Motion imports resolve) | N/A |
| DSGN-03 | template.tsx exists with motion wrapper | manual-only | File exists at `src/app/template.tsx` | N/A |

### Sampling Rate
- **Per task commit:** `npm run build && npm run lint`
- **Per wave merge:** `npm run build && npm run lint` + visual browser check at `npm run dev`
- **Phase gate:** Build green + lint green + visual inspection before `/gsd:verify-work`

### Wave 0 Gaps
- No test framework to install (this phase doesn't benefit from unit tests — purely visual CSS migration)
- The verification strategy is build + lint + grep audit for hardcoded color class elimination

*(If a testing framework is desired for future phases, Vitest + Playwright would be the standard stack for Next.js 15. Not needed for Phase 1.)*

---

## Sources

### Primary (HIGH confidence)

- Official Tailwind CSS docs — `theme.extend.colors` with CSS custom properties pattern
- Next.js 15 App Router docs — `template.tsx` vs `layout.tsx` re-render behavior
- `motion` package (formerly framer-motion) — React 19 compatibility confirmed via npm + community reports

### Secondary (MEDIUM confidence)

- [motion.dev/docs/react-upgrade-guide](https://motion.dev/docs/react-upgrade-guide) — Official upgrade guide confirming `framer-motion` → `motion/react` migration path
- [GitHub Next.js discussion #72228](https://github.com/vercel/next.js/discussions/72228) — Community confirmation of `motion/react` import fixing React 19 issues
- [imcorfitz.com — Framer Motion page transitions App Router](https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router) — `template.tsx` pattern documented

### Tertiary (LOW confidence)

- Community examples of scroll-aware headers with `useEffect` + `window.scrollY` — pattern is standard React but specific threshold (48px) is Claude's discretion

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Tailwind v3 installed, motion v12 React 19 compatible confirmed, no new framework risks
- Architecture: HIGH — patterns derived from existing codebase conventions + official Next.js App Router docs
- Pitfalls: HIGH — all identified pitfalls come from direct code inspection of the existing files (zinc/violet hardcodes confirmed, CSS var collision confirmed, Server Component constraint confirmed)

**Research date:** 2026-03-15
**Valid until:** 2026-06-15 (stable stack — Tailwind v3, motion v12, Next.js 15 are not fast-moving targets)
