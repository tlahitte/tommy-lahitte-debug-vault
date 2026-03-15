---
phase: 01-design-system
plan: 04
subsystem: ui
tags: [motion, framer-motion, animation, tailwind, semantic-tokens, next-js, blogcard, page-transitions]

# Dependency graph
requires:
  - phase: 01-design-system plan 01
    provides: Semantic token definitions in tailwind.config.ts and globals.css (border-border, bg-surface-raised, text-text-muted, text-accent, text-text-primary)
provides:
  - motion@12.36.0 installed via npm (import from 'motion/react')
  - src/app/template.tsx — page entry animation wrapper (fade-up, 250ms, easeOut)
  - BlogCard.tsx migrated to semantic tokens with Framer Motion whileHover lift
affects:
  - 01-design-system (any remaining component migrations referencing old zinc/violet classes)
  - future phases using animation patterns

# Tech tracking
tech-stack:
  added:
    - motion@12.36.0 (formerly framer-motion, canonical package is now 'motion', import from 'motion/react')
  patterns:
    - template.tsx entry-only page animation (re-renders on every navigation, unlike layout.tsx)
    - motion.article with whileHover for card lift — physical object feel
    - Link as plain wrapper + motion.article as animated content container

key-files:
  created:
    - src/app/template.tsx
    - eslint.config.mjs
  modified:
    - src/components/blog/BlogCard.tsx
    - package.json
    - package-lock.json

key-decisions:
  - "motion installed via --registry https://registry.npmjs.org flag (corporate Artifactory proxy at artifacts.ol.epicgames.net not reachable from home network)"
  - "framer-motion appears as a dependency of motion@12.36.0 itself — not separately installed, single bundle, no duplication concern"
  - "eslint.config.mjs created to unblock npm run lint (pre-existing gap: no ESLint config existed)"

patterns-established:
  - "Pattern: 'use client' + motion import — any file using motion/react must have 'use client' as first line"
  - "Pattern: card hover = motion.article whileHover={{ y: -2, boxShadow }} not Tailwind hover: classes"
  - "Pattern: page transition = template.tsx entry-only, no AnimatePresence exit animations (fragile in App Router)"

requirements-completed: [DSGN-02, DSGN-03]

# Metrics
duration: 4min
completed: 2026-03-15
---

# Phase 01 Plan 04: Motion Animations and BlogCard Token Migration Summary

**motion@12.36.0 installed, BlogCard rebuilt with semantic tokens and whileHover rust-shadow lift, template.tsx delivering 250ms fade-up entry on every navigation**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-15T22:27:05Z
- **Completed:** 2026-03-15T22:31:28Z
- **Tasks:** 2 of 2 (checkpoint pending human verification)
- **Files modified:** 5

## Accomplishments

- motion@12.36.0 installed (import path: `motion/react`, no framer-motion duplicate in app code)
- src/app/template.tsx created with `'use client'`, fade-up entry animation (opacity 0→1, y 8→0, 250ms easeOut) on every route change
- BlogCard.tsx fully migrated: zero zinc/violet residue, all colors use semantic tokens, Framer Motion whileHover with physical lift and warm rust shadow
- Build and lint pass cleanly

## Task Commits

1. **Task 1: Install motion package and create template.tsx** - `d1c483a` (feat)
2. **Task 2: Migrate BlogCard.tsx to semantic tokens with Framer Motion hover** - `2a26391` (feat)

## Files Created/Modified

- `src/app/template.tsx` — page entry animation wrapper, re-renders on every navigation
- `src/components/blog/BlogCard.tsx` — semantic tokens + Framer Motion whileHover lift, zero zinc/violet classes
- `eslint.config.mjs` — ESLint config (pre-existing gap, required for lint to run)
- `package.json` — motion@12.36.0 added to dependencies
- `package-lock.json` — lockfile updated

## Decisions Made

- Installed motion using `--registry https://registry.npmjs.org` flag because the global npm config points to an Epic Games Artifactory proxy (`artifacts.ol.epicgames.net`) that is not reachable from the home network. The project `.npmrc` does not override this, so the public registry flag was required.
- framer-motion appears as a peer/sub-dependency of motion@12.36.0 itself — this is expected, not a duplication issue. The app code only imports from `motion/react`.
- Created `eslint.config.mjs` (Rule 3 auto-fix) because `npm run lint` prompted interactively for ESLint setup when no config existed — this blocked the acceptance criterion verification.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created eslint.config.mjs to unblock npm run lint**
- **Found during:** Task 2 verification
- **Issue:** `npm run lint` launched an interactive ESLint setup wizard because no config file existed — could not exit 0 non-interactively
- **Fix:** Created `eslint.config.mjs` with `next/core-web-vitals` and `next/typescript` extends, matching Next.js 15 recommended setup
- **Files modified:** `eslint.config.mjs`
- **Verification:** `npm run lint` exits 0 with "No ESLint warnings or errors"
- **Committed in:** `2a26391` (Task 2 commit)

**2. [Rule 3 - Blocking] Used --registry flag for npm install motion**
- **Found during:** Task 1 (npm install)
- **Issue:** Global npm config points to Epic Games Artifactory proxy not reachable outside corporate network — `npm install motion` returned ENOTFOUND
- **Fix:** `npm install motion --registry https://registry.npmjs.org`
- **Files modified:** package.json, package-lock.json (standard install side effects)
- **Verification:** `npm ls motion` shows motion@12.36.0
- **Committed in:** `d1c483a` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both auto-fixes necessary to meet acceptance criteria. No scope creep.

## Issues Encountered

- Corporate npm registry (Artifactory) not reachable from home network — resolved by specifying public registry for this install. Future npm installs in this project environment will need the same flag if run outside the corporate network.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- motion is installed and importable; template.tsx and BlogCard.tsx are the reference implementations for animation patterns in this project
- Checkpoint (Task 3) still requires human visual verification: page fade-up transitions and BlogCard hover lift need browser confirmation
- After checkpoint approval, plan 04 is fully complete and DSGN-02 + DSGN-03 are closed

---
*Phase: 01-design-system*
*Completed: 2026-03-15*
