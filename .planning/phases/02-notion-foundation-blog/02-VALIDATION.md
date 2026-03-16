---
phase: 2
slug: notion-foundation-blog
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` (Wave 0 installs) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose --coverage` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose --coverage`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 0 | NOTI-01 | unit | `npx vitest run src/lib/notion.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | NOTI-01 | unit | `npx vitest run src/lib/notion.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | NOTI-02 | unit | `npx vitest run src/lib/notion.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-04 | 01 | 1 | NOTI-03 | unit | `npx vitest run src/lib/notion.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | BLOG-01 | unit | `npx vitest run src/lib/notion-images.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 1 | BLOG-02 | unit | `npx vitest run src/components/notion-renderer.test.ts` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 2 | NOTI-04 | integration | `npx vitest run src/app/blog.test.ts` | ❌ W0 | ⬜ pending |
| 02-03-02 | 03 | 2 | NOTI-05 | manual | N/A | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — install and configure vitest with Next.js
- [ ] `src/lib/notion.test.ts` — stubs for NOTI-01, NOTI-02, NOTI-03
- [ ] `src/lib/notion-images.test.ts` — stubs for BLOG-01 (image download)
- [ ] `src/components/notion-renderer.test.ts` — stubs for BLOG-02 (block rendering)
- [ ] `src/app/blog.test.ts` — stubs for NOTI-04 (URL slugs / SEO)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Netlify rebuild triggered on Notion publish | NOTI-05 | Requires live Netlify + Notion webhook or GitHub Actions schedule; cannot be simulated in unit tests | 1. Publish a Notion draft page. 2. Verify Netlify build log shows new deploy within 5 min (webhook) or next cron fire. |
| Images don't expire after 60 min | BLOG-01 | Time-based external service behaviour | 1. Trigger build. 2. Wait 90 min. 3. Load blog article — images must still load from `/notion-images/`. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
