# Roadmap: debug-vault

## Overview

debug-vault goes from a generic-looking TypeScript-static site to a distinctive maker portfolio backed by Notion as the live CMS. Four phases follow the dependency graph strictly: the design token layer lands first so no component is ever built in the wrong visual context; the Notion data layer comes second (proven on the lower-risk blog migration); the new projects section layers on top of the verified Notion foundation; and the homepage plus About page close out the narrative once real content exists to reference.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Design System** - Establish kraft/industrial token layer and redesign global layout before any component is built (completed 2026-03-15)
- [ ] **Phase 2: Notion Foundation + Blog** - Build the Notion data layer and migrate blog content to prove it end-to-end
- [ ] **Phase 3: Projects Section** - Add the new Projects content type on top of the verified Notion foundation
- [ ] **Phase 4: Homepage + About** - Complete the narrative pages and visual landing experience with real content in place

## Phase Details

### Phase 1: Design System
**Goal**: The site has a coherent kraft/industrial visual identity and every subsequent component can be built correctly by default
**Depends on**: Nothing (first phase)
**Requirements**: DSGN-01, DSGN-02, DSGN-03
**Success Criteria** (what must be TRUE):
  1. Semantic Tailwind tokens (`surface`, `text-primary`, `text-muted`, `accent`, `border`) exist in `tailwind.config.ts` and are used in place of hardcoded color values
  2. A visitor sees the kraft/beige palette, precise typography, and generous spacing — the site no longer reads as AI-generated
  3. Navigation is visually coherent with the maker identity and works correctly on mobile and desktop
  4. Hover interactions and page transitions carry subtle micro-animations that feel intentional, not decorative
**Plans**: 4 plans

Plans:
- [ ] 01-01-PLAN.md — Semantic token foundation (tailwind.config.ts, globals.css, layout.tsx)
- [ ] 01-02-PLAN.md — Header rebuild (brand identity, scroll behavior, new nav order)
- [ ] 01-03-PLAN.md — Component token migration (Footer, Tag, CodeBlock, CategoryBadge, Hero)
- [ ] 01-04-PLAN.md — BlogCard migration + Framer Motion (motion install, template.tsx, BlogCard hover)

### Phase 2: Notion Foundation + Blog
**Goal**: Blog content is served from Notion at build time, all critical Notion pitfalls are solved, and the rebuild pipeline is wired up
**Depends on**: Phase 1
**Requirements**: NOTI-01, NOTI-02, NOTI-03, NOTI-04, NOTI-05, BLOG-01, BLOG-02
**Success Criteria** (what must be TRUE):
  1. All existing blog articles are accessible at their original URLs (no broken links, SEO preserved)
  2. A blog article written and published in Notion appears on the live site after a Netlify rebuild — no code change needed
  3. Images in blog articles load correctly and do not break after 1 hour (build-time download confirmed)
  4. Notion block types (paragraph, heading, code, callout, image, lists, toggle, divider) all render visually in blog articles
  5. Publishing a page in Notion triggers an automatic Netlify rebuild without manual intervention
**Plans**: 5 plans

Plans:
- [ ] 02-01-PLAN.md — Wave 0 test scaffold (vitest config, stub test files for all requirements)
- [ ] 02-02-PLAN.md — Notion data layer (client, types, DAL, image downloader, blog list layout)
- [ ] 02-03-PLAN.md — Content migration + rebuild trigger (Notion articles, GitHub Actions cron)
- [ ] 02-04-PLAN.md — NotionBlock renderer (11-type switch, unit tests)
- [ ] 02-05-PLAN.md — Article page wiring (NotionBlock import, ReadingProgressBar, improved header)

### Phase 3: Projects Section
**Goal**: Visitors can browse and read project pages pulled entirely from Notion, with visual gallery and project metadata
**Depends on**: Phase 2
**Requirements**: PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05
**Success Criteria** (what must be TRUE):
  1. Visiting `/projects` shows a filterable grid of all published projects with cover image, title, and category
  2. Each project page displays rich Notion content (title, description, body), a photo gallery, and a visible status badge (En cours / Terminé / Archivé)
  3. Projects can be filtered by category (hardware, software, art, mixte) on the listing page
  4. A new project added and published in Notion appears on the site after a rebuild with no code changes
**Plans**: TBD

### Phase 4: Homepage + About
**Goal**: The homepage communicates Tommy's maker identity at a glance and the About page tells the full story — both reference real published content
**Depends on**: Phase 3
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, ABOU-01
**Success Criteria** (what must be TRUE):
  1. A first-time visitor understands who Tommy is and what he builds within 5 seconds of landing on the homepage
  2. The homepage features 2-3 recent projects with visual preview and links to their detail pages
  3. The homepage shows recent blog article previews, linking to the articles
  4. Visiting `/about` presents Tommy's full maker bio and creative journey — reads as a human story, not a resume
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Design System | 6/6 | Complete   | 2026-03-15 |
| 2. Notion Foundation + Blog | 2/5 | In Progress|  |
| 3. Projects Section | 0/? | Not started | - |
| 4. Homepage + About | 0/? | Not started | - |

---
*Roadmap created: 2026-03-15*
*Last updated: 2026-03-16 — Phase 2 plans revised: 5 plans across 4 waves (added blog list layout, ReadingProgressBar, article page wiring)*
