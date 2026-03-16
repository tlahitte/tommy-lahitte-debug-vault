---
phase: 02-notion-foundation-blog
plan: "03"
subsystem: infra
tags: [github-actions, netlify, notion, cron, rebuild-trigger]

# Dependency graph
requires:
  - phase: 02-notion-foundation-blog
    provides: Notion data layer and blog route infrastructure from plans 02-01 and 02-02

provides:
  - GitHub Actions daily cron workflow that triggers Netlify rebuild at 06:00 UTC
  - Manual workflow_dispatch trigger for on-demand Netlify builds from GitHub UI
  - NETLIFY_BUILD_HOOK_TOKEN secret pattern for secure token storage (token only, not full URL)

affects:
  - 03-blog-ui (depends on Notion content being in place and rebuild pipeline working)
  - deployment (Netlify rebuild automation now active once secret is configured)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "GitHub Actions cron rebuild: schedule + workflow_dispatch triggers, env secret injected into curl POST"

key-files:
  created:
    - .github/workflows/scheduled-rebuild.yml
  modified: []

key-decisions:
  - "Store only the alphanumeric token portion of the Netlify Build Hook URL as NETLIFY_BUILD_HOOK_TOKEN GitHub Secret — not the full URL — to prevent accidental URL leakage in logs"
  - "workflow_dispatch added alongside cron to enable manual trigger from GitHub Actions UI without waiting for next scheduled run"
  - "No checkout step in workflow — only HTTP POST required, checkout would be wasted time and resource"

patterns-established:
  - "Netlify rebuild trigger pattern: curl -s -X POST to build_hooks URL with TOKEN env var from GitHub Secrets"

requirements-completed: [NOTI-05, BLOG-01, BLOG-02]

# Metrics
duration: 2min
completed: 2026-03-16
---

# Phase 02 Plan 03: Notion Content Migration and Rebuild Trigger Summary

**GitHub Actions daily cron at 06:00 UTC POSTs to Netlify Build Hook via NETLIFY_BUILD_HOOK_TOKEN secret — content migration to Notion database awaiting human checkpoint**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-16T11:55:08Z
- **Completed:** 2026-03-16T11:57:00Z
- **Tasks:** 1/2 (paused at checkpoint:human-verify)
- **Files modified:** 1

## Accomplishments

- GitHub Actions scheduled rebuild workflow created and committed
- Daily 06:00 UTC cron + manual workflow_dispatch trigger configured
- Secret token pattern established: token-only (not full URL) in NETLIFY_BUILD_HOOK_TOKEN
- Checkpoint reached: human must populate Notion DB with 2 articles and configure secrets

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GitHub Actions scheduled rebuild workflow** - `dc48a72` (chore)

**Plan metadata:** pending final commit

## Files Created/Modified

- `.github/workflows/scheduled-rebuild.yml` - Daily cron + workflow_dispatch trigger that POSTs to Netlify Build Hook using NETLIFY_BUILD_HOOK_TOKEN secret

## Decisions Made

- Used `TOKEN` as the local env var name (not `NETLIFY_BUILD_HOOK_TOKEN`) to keep the run command readable, mapping from the GitHub Secret via the `env:` block
- No checkout step added — the workflow only performs an HTTP POST, no repo access required
- `workflow_dispatch` added alongside cron so the hook can be tested immediately without waiting 24h

## Deviations from Plan

None - plan executed exactly as written.

## User Setup Required

The following manual steps are required before this plan is complete:

**Notion content migration:**
1. In your Notion Blog database, create a page for each article below (exact slugs required):
   - Article 1: Title "Technical Director at the People Person Show", Slug `technical-director-people-person-show`, Status Published, Date 2025-03-11 — full details in plan frontmatter
   - Article 2: Title "Building ElevenApps: a Native macOS Voice Interface for an Immersive Show", Slug `elevenapps-immersive-show-swift`, Status Published, Date 2026-03-11 — full details in plan frontmatter
2. Populate body content of each article in Notion (match src/content/blog/ source files)

**Environment variables:**
- Add `NOTION_TOKEN=` and `NOTION_DATABASE_ID=` to `.env.local`
- Add both vars to Netlify site settings → Environment variables

**Netlify Build Hook:**
1. Go to Netlify → Site settings → Build & deploy → Build hooks → Add build hook "Notion Rebuild" on branch main
2. Copy only the token portion (after the last `/` in the hook URL)
3. Go to GitHub → repository Settings → Secrets and variables → Actions → New repository secret: `NETLIFY_BUILD_HOOK_TOKEN` = token from previous step

**Verification:**
- Run `npm run build` — should succeed with `out/blog/technical-director-people-person-show/` and `out/blog/elevenapps-immersive-show-swift/` present
- Go to GitHub Actions → "Scheduled Notion Rebuild" → "Run workflow" — should succeed

## Next Phase Readiness

- Blocked on human checkpoint: Notion content migration and secret setup required before plan is fully complete
- Once checkpoint cleared: both blog post URLs will resolve in the built output and the daily rebuild trigger will be active

---
*Phase: 02-notion-foundation-blog*
*Completed: 2026-03-16 (partial — awaiting checkpoint)*
