---
phase: 4
slug: homepage-about
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `pnpm vitest run` |
| **Full suite command** | `pnpm vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run`
- **After every plan wave:** Run `pnpm vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 1 | HOME-01 | manual | visual inspection | N/A | ⬜ pending |
| 4-01-02 | 01 | 1 | HOME-02 | unit | `pnpm vitest run` | ❌ W0 | ⬜ pending |
| 4-01-03 | 01 | 1 | HOME-03 | unit | `pnpm vitest run` | ❌ W0 | ⬜ pending |
| 4-01-04 | 01 | 1 | HOME-04 | manual | visual inspection | N/A | ⬜ pending |
| 4-02-01 | 02 | 2 | ABOU-01 | manual | visual inspection | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Existing vitest infrastructure covers all phase requirements
- [ ] Data layer tests already exist from Phase 2/3

*Existing infrastructure covers most phase requirements. New tests needed only for homepage data fetching logic.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| First-time visitor understands Tommy's identity in 5s | HOME-01 | Subjective visual/narrative quality | Load homepage, verify hero text, tagline, and CTA buttons communicate maker identity |
| About page reads as human story | ABOU-01 | Subjective narrative quality | Read /about page, verify bio feels personal, not resume-like |
| Featured projects have visual previews | HOME-02 | Visual layout verification | Check homepage shows 2-3 project cards with images and links |
| Blog previews link correctly | HOME-03 | Navigation verification | Click blog preview links, verify they reach correct articles |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
