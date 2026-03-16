---
phase: 3
slug: projects-section
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm vitest run src/lib/blog.test.ts` |
| **Full suite command** | `pnpm vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run src/lib/blog.test.ts`
- **After every plan wave:** Run `pnpm vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | PROJ-01 | unit | `pnpm vitest run src/lib/blog.test.ts` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | PROJ-02 | unit | `pnpm vitest run src/lib/blog.test.ts` | ❌ W0 | ⬜ pending |
| 03-01-03 | 01 | 1 | PROJ-03 | unit | `pnpm vitest run src/lib/blog.test.ts` | ❌ W0 | ⬜ pending |
| 03-01-04 | 01 | 1 | PROJ-04 | unit | `pnpm vitest run src/lib/blog.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | PROJ-05 | unit | `pnpm vitest run src/components/blog/BlogCategoryFilter.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/blog.test.ts` — extend: add describe blocks for PROJ-01 (category field), PROJ-03 (gallery download), PROJ-04 (ProjectStatus field)
- [ ] `src/components/blog/BlogCategoryFilter.test.tsx` — new file covering PROJ-05 filter behavior

*Existing infrastructure covers framework install — vitest already configured and running.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Gallery images render correctly with responsive grid | PROJ-03 | Visual layout verification | Open a project page with gallery images, verify 2-3 column grid renders correctly at mobile and desktop breakpoints |
| Status badge visible on project detail page | PROJ-04 | Visual rendering check | Open a project page, verify status pill badge shows correct value |
| Category filter pills visually match design system | PROJ-05 | Visual styling check | Open `/blog`, verify pills match kraft identity styling |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
