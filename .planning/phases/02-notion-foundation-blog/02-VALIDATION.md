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
| **Config file** | `vitest.config.ts` (Wave 0 — plan 02-01 installs) |
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
| 02-01-T1 | 01 | 0 | infra | setup | `npx vitest run 2>&1 \| grep -E "passed\|no test files"` | ❌ W0 | ⬜ pending |
| 02-01-T2 | 01 | 0 | NOTI-01, NOTI-02, NOTI-03, NOTI-04 | stubs | `npx vitest run --reporter=verbose` | ❌ W0 | ⬜ pending |
| 02-02-T1 | 02 | 1 | NOTI-04 | unit | `npx tsc --noEmit` | ❌ W1 | ⬜ pending |
| 02-02-T2 | 02 | 1 | NOTI-01 | unit | `npx tsc --noEmit` | ❌ W1 | ⬜ pending |
| 02-02-T3 | 02 | 1 | NOTI-01, NOTI-03, NOTI-04 | unit | `npx vitest run src/lib/blog.test.ts` | ❌ W1 | ⬜ pending |
| 02-02-T4 | 02 | 1 | context-compliance | unit | `npx tsc --noEmit` | ❌ W1 | ⬜ pending |
| 02-03-T1 | 03 | 1 | NOTI-05 | lint | `cat .github/workflows/scheduled-rebuild.yml \| grep NETLIFY_BUILD_HOOK_TOKEN` | ❌ W1 | ⬜ pending |
| 02-03-T2 | 03 | 1 | BLOG-01, BLOG-02 | manual | `npm run build && ls out/blog/` | N/A | ⬜ pending |
| 02-04-T1 | 04 | 2 | NOTI-02, NOTI-03 | unit | `npx tsc --noEmit` | ❌ W2 | ⬜ pending |
| 02-04-T2 | 04 | 2 | NOTI-02, NOTI-03 | unit | `npx vitest run src/components/blog/NotionBlock.test.tsx` | ❌ W2 | ⬜ pending |
| 02-05-T1 | 05 | 3 | NOTI-02 | unit | `npx tsc --noEmit` | ❌ W3 | ⬜ pending |
| 02-05-T2 | 05 | 3 | NOTI-02, context-compliance | unit | `npx tsc --noEmit` | ❌ W3 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements (plan 02-01)

Test files created by plan 02-01:
- [x] `vitest.config.ts` — install and configure vitest with Next.js jsdom + `@` alias
- [x] `src/lib/notion.test.ts` — stubs for NOTI-01 (getAllPosts pagination, image URL mapping)
- [x] `src/lib/blog.test.ts` — stubs for NOTI-04 (property mapping) and BLOG-02 (slug preservation)
- [x] `src/components/blog/NotionBlock.test.tsx` — stubs for NOTI-02 (11 block types) and NOTI-03 (silent fallback)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Netlify rebuild triggered on Notion publish | NOTI-05 | Requires live Netlify + Notion webhook or GitHub Actions schedule; cannot be simulated in unit tests | 1. Publish a Notion draft page. 2. Verify Netlify build log shows new deploy within 5 min (webhook) or next cron fire. |
| Images don't expire after 60 min | BLOG-01 | Time-based external service behaviour | 1. Trigger build. 2. Wait 90 min. 3. Load blog article — images must still load from `/notion-images/`. |
| Both slugs resolve after build | BLOG-02 | Requires live Notion credentials | `npm run build && ls out/blog/elevenapps-immersive-show-swift/ out/blog/technical-director-people-person-show/` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
