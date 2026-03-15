---
phase: 1
slug: design-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-15
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (via Next.js / existing project tooling) |
| **Config file** | `vitest.config.ts` or `package.json` scripts |
| **Quick run command** | `npm run build -- --no-lint` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build -- --no-lint`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | DSGN-01 | build | `npm run build -- --no-lint` | ✅ | ⬜ pending |
| 1-01-02 | 01 | 1 | DSGN-01 | build | `npm run build -- --no-lint` | ✅ | ⬜ pending |
| 1-02-01 | 02 | 2 | DSGN-02 | build | `npm run build -- --no-lint` | ✅ | ⬜ pending |
| 1-02-02 | 02 | 2 | DSGN-03 | build | `npm run build -- --no-lint` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — no new test framework needed. Validation is build-based (TypeScript compilation + Tailwind CSS generation confirms token correctness).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Kraft/beige palette visible to visitor | DSGN-02 | Visual — no automated color perception test | Load `localhost:3000`, confirm warm beige background, no zinc/violet visible |
| Navigation works on mobile & desktop | DSGN-02 | Responsive layout requires visual check | Resize to 375px and 1280px, verify nav hamburger/full menu |
| Micro-animations feel intentional | DSGN-03 | Subjective quality judgment | Hover links/cards, trigger page transition — confirm smooth, not decorative |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
