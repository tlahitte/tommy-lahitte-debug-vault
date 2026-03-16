---
phase: 02-notion-foundation-blog
plan: "03"
subsystem: infra
tags: [github-actions, netlify, notion, cron, rebuild-trigger, content-migration]

# Dependency graph
requires:
  - phase: 02-notion-foundation-blog
    provides: Notion data layer and blog route infrastructure from plans 02-01 and 02-02

provides:
  - GitHub Actions daily cron workflow that triggers Netlify rebuild at 06:00 UTC
  - Manual workflow_dispatch trigger for on-demand Netlify builds from GitHub UI
  - NETLIFY_BUILD_HOOK_TOKEN secret pattern for secure token storage (token only, not full URL)
  - Both existing blog articles migrated to Notion database with exact slugs preserved
  - Static TypeScript content files deleted — Notion is now the single source of truth

affects:
  - 03-portfolio-projects (data layer proven end-to-end, pattern reusable)
  - deployment (Netlify rebuild automation now active, daily cron live)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "GitHub Actions cron rebuild: schedule + workflow_dispatch triggers, env secret injected into curl POST"
    - "Token-only secret pattern: store alphanumeric token, reconstruct full Netlify Build Hook URL in workflow run step"

key-files:
  created:
    - .github/workflows/scheduled-rebuild.yml
  modified:
    - src/content/blog/people-person-show.ts (deleted — migrated to Notion)
    - src/content/blog/elevenlabs-elevenpapps-immersive-show.ts (deleted — migrated to Notion)

key-decisions:
  - "Store only the alphanumeric token portion of the Netlify Build Hook URL as NETLIFY_BUILD_HOOK_TOKEN GitHub Secret — not the full URL — to prevent accidental URL leakage in logs"
  - "workflow_dispatch added alongside cron to enable manual trigger from GitHub Actions UI without waiting for next scheduled run"
  - "No checkout step in workflow — only HTTP POST required, checkout would be wasted time and resource"
  - "GitHub Actions daily cron chosen as free-plan fallback — Notion webhook automation requires Notion Plus or above; cron fires unconditionally at 06:00 UTC"

patterns-established:
  - "Netlify rebuild trigger pattern: curl -s -X POST to build_hooks URL with TOKEN env var from GitHub Secrets"
  - "Content migration pattern: delete static .ts source files after Notion database is confirmed as source of truth"

requirements-completed: [NOTI-05, BLOG-01, BLOG-02]

# Metrics
duration: ~2h (multi-session with human checkpoint)
completed: 2026-03-16
---

# Phase 02 Plan 03: Notion Content Migration and Rebuild Trigger Summary

**Two existing blog articles migrated to Notion with exact slugs preserved, static TypeScript content files deleted, and a daily GitHub Actions cron triggers a Netlify rebuild via Build Hook — full Notion-backed content pipeline operational.**

## Performance

- **Duration:** ~2h (multi-session including human checkpoint for Notion content migration and secrets setup)
- **Started:** 2026-03-16T11:55:08Z
- **Completed:** 2026-03-16
- **Tasks:** 2/2
- **Files modified:** 3 (1 created, 2 deleted)

## Accomplishments

- GitHub Actions scheduled rebuild workflow created and committed (`dc48a72`)
- Daily 06:00 UTC cron + manual `workflow_dispatch` trigger configured
- Secret token pattern established: token-only (not full URL) in `NETLIFY_BUILD_HOOK_TOKEN`
- Both articles migrated to Notion: `technical-director-people-person-show` and `elevenapps-immersive-show-swift` with Status = Published
- `NOTION_TOKEN` and `NOTION_DATABASE_ID` added to `.env.local` and Netlify environment variables
- `NETLIFY_BUILD_HOOK_TOKEN` added as GitHub repository secret
- `npm run build` succeeded with both slug directories present in `out/blog/`
- GitHub Actions "Scheduled Notion Rebuild" ran successfully via manual dispatch and triggered a Netlify deploy
- Static blog source files (`src/content/blog/`) deleted — Notion is now single source of truth (`c8b3dd2`)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GitHub Actions scheduled rebuild workflow** - `dc48a72` (chore)
2. **Task 2: Human-verify checkpoint — Notion content migration + secrets setup** - verified by user; static files deleted in `c8b3dd2`

**Plan metadata:** `a6abcd7` (docs: complete plan — prior checkpoint commit)

## Files Created/Modified

- `.github/workflows/scheduled-rebuild.yml` — Daily cron at 06:00 UTC + `workflow_dispatch`; POSTs to `https://api.netlify.com/build_hooks/${TOKEN}` using `NETLIFY_BUILD_HOOK_TOKEN` secret
- `src/content/blog/people-person-show.ts` — Deleted (content migrated to Notion)
- `src/content/blog/elevenlabs-elevenpapps-immersive-show.ts` — Deleted (content migrated to Notion)

## Decisions Made

- Used `TOKEN` as the local env var name (not `NETLIFY_BUILD_HOOK_TOKEN`) to keep the `run:` command readable, mapping from the GitHub Secret via the `env:` block
- No checkout step added — the workflow only performs an HTTP POST, no repo access required
- `workflow_dispatch` added alongside cron so the hook can be tested immediately without waiting 24h
- GitHub Actions daily cron chosen over Notion webhook automation because the project is on the free Notion plan (webhook requires Notion Plus or above); cron fires unconditionally at 06:00 UTC

## Deviations from Plan

None - plan executed exactly as written. Human checkpoint (Task 2) completed as designed.

## Issues Encountered

None. Build succeeded on first attempt after Notion content migration and environment variable setup.

## User Setup Required

All manual steps completed during the human checkpoint:

**Notion content migration:**
- Article 1: "Technical Director at the People Person Show", Slug `technical-director-people-person-show`, Status Published, Date 2025-03-11
- Article 2: "Building ElevenApps: a Native macOS Voice Interface for an Immersive Show", Slug `elevenapps-immersive-show-swift`, Status Published, Date 2026-03-11
- Body content of each article populated in Notion

**Environment variables:**
- `NOTION_TOKEN` and `NOTION_DATABASE_ID` added to `.env.local` and Netlify environment variables

**GitHub Secrets:**
- `NETLIFY_BUILD_HOOK_TOKEN` (token portion only) added as repository secret

## Next Phase Readiness

- Notion content pipeline is fully operational: create/update articles in Notion → daily rebuild at 06:00 UTC publishes them automatically
- Both blog slugs resolve in the built output — ready for Phase 03 (portfolio projects)
- The blocker noted in STATE.md ("Confirm Notion plan tier before Phase 2") is resolved: free plan is sufficient via GitHub Actions cron fallback
- No remaining blockers for Phase 02 continuation

---
*Phase: 02-notion-foundation-blog*
*Completed: 2026-03-16*
