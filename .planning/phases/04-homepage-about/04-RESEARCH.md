# Phase 4: Homepage + About - Research

**Researched:** 2026-03-16
**Domain:** Next.js 15 App Router, homepage narrative design, Notion CMS data composition, static content authoring
**Confidence:** HIGH — based entirely on direct codebase inspection, all prior phases complete

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOME-01 | La page d'accueil présente un hero fort communiquant la démarche maker avec impact visuel immédiat | Hero component already exists (`src/components/home/Hero.tsx`). Current copy positions Tommy as "Senior QA Engineer at Epic Games" — needs rewriting to foreground the maker identity. CTA links point to `/tips` and `/blog`; update to project + blog sections. |
| HOME-02 | La page d'accueil met en vedette 2-3 projets récents avec aperçu visuel | `getAllPosts()` already returns `category` field from Phase 3. Filter for `category === 'Project'`, take first 2-3. Use existing `BlogCard` or a new compact card variant. Link to `/blog/{slug}`. |
| HOME-03 | La page d'accueil affiche les derniers articles de blog en aperçu | Same DAL, filter for `category === 'Article'`. Current homepage already has a "Latest Posts" section using `BlogCard`. Rename + retarget section. |
| HOME-04 | La page d'accueil intègre une section About courte | `AboutCard` component already exists and is complete. It needs to be embedded in the homepage, not as a new widget — the current About section design is already inline-ready. |
| ABOU-01 | Une page `/about` dédiée présente la bio complète et le parcours maker | `src/app/about/page.tsx` already exists with `AboutCard` and avatar header. The page structure is in place. Needs copy audit: current text positions Tommy as "QA Engineer at Epic Games" first rather than as a maker. Story ordering and copy rewrite needed. |
</phase_requirements>

---

## Summary

Phase 4 is almost entirely a content and composition phase, not an infrastructure phase. All underlying data, components, and pages already exist — they were built in Phases 1–3. The homepage (`src/app/page.tsx`) currently shows "Latest Posts" (2 recent posts, category-unaware) and "Latest Tips" (3 tips). It needs to be redesigned with three data-driven sections: hero, featured projects (2-3), and recent articles. The About page (`src/app/about/page.tsx`) exists structurally but carries copy from the "QA Engineer" era — it needs a maker-first narrative rewrite.

The critical data work is minimal: `getAllPosts()` already supports `category` filtering via the `category` field added in Phase 3. The homepage just needs to call `getAllPosts()`, slice by category, and feed results to the card components. No new Notion properties, no new API calls, no new data layer work. The only new code is: (a) category-filtered data composition in `page.tsx`, (b) hero copy rewrite, (c) about page copy rewrite, and (d) optionally a dedicated `FeaturedProjectCard` component if the featured-project cards need a different visual treatment from `BlogCard`.

The biggest risk in this phase is narrative, not technical: the copy must communicate "maker who builds things" in 5 seconds, not "QA engineer at a games company." The metadata (`title`, `description`, Schema.org `Person`) also currently reflects the old QA identity and needs updating.

**Primary recommendation:** Rewrite the homepage in a single plan (one wave): update hero copy, filter posts by category for projects and articles sections, embed `AboutCard` inline, update metadata. Then rewrite About page copy in a second plan. Keep `BlogCard` for articles; introduce a `FeaturedProjectCard` only if visual differentiation is needed.

---

## Standard Stack

### Core (all from prior phases — no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | ^15.5.12 | App Router, SSG, async server components | Project foundation, established |
| TypeScript | ^5 | Type safety | All source files are `.tsx`/`.ts` |
| Tailwind CSS | ^3.4.17 | Utility styling, all kraft tokens defined | Phase 1 completed token layer |
| `motion/react` | ^12.36.0 | Hover animations on cards | Already installed, used in `Hero.tsx` and `BlogCard.tsx` |
| `@notionhq/client` | ^2.3.0 | Notion data access via existing `blog.ts` DAL | Pinned in Phase 2 |
| Vitest | ^4.1.0 | Unit tests | Chosen in Phase 2, config in `vitest.config.ts` |

### No New Dependencies Required

This phase installs no new packages. All UI primitives, animation library, and data access layer are in place.

**Installation:**
```bash
# No new packages needed
```

---

## Architecture Patterns

### Recommended Project Structure (additions and modifications only)

```
src/
├── app/
│   ├── page.tsx                      # REWRITE: hero copy, category-filtered sections, metadata
│   └── about/
│       └── page.tsx                  # REWRITE: about copy, maker narrative ordering
├── components/
│   └── home/
│       ├── Hero.tsx                  # REWRITE copy only — structure stays
│       ├── AboutCard.tsx             # UNCHANGED — already complete
│       └── FeaturedProjectCard.tsx   # NEW (optional) — if projects need different card layout
└── lib/
    └── blog.ts                       # UNCHANGED — getAllPosts() already supports category
```

### Pattern 1: Category-Filtered Homepage Data Fetching

**What:** `page.tsx` calls `getAllPosts()` once, then slices by category. Never call `getAllPosts()` twice.

**When to use:** Any time the homepage needs content from Notion split by content type.

**Example:**
```typescript
// src/app/page.tsx
export default async function HomePage() {
  const allPosts = await getAllPosts()

  // 2-3 most recent Projects
  const featuredProjects = allPosts
    .filter((p) => p.category === 'Project')
    .slice(0, 3)

  // 2-3 most recent Articles
  const recentArticles = allPosts
    .filter((p) => p.category === 'Article')
    .slice(0, 3)

  return (
    // ...
  )
}
```

`getAllPosts()` returns posts sorted descending by `Date` (from Notion query in `blog.ts` line 192). No local sort needed.

### Pattern 2: Hero Copy Structure (Maker Identity in 5 Seconds)

**What:** The hero must communicate identity (maker/tinkerer), domain (art + technology), and what the site contains — all in the above-the-fold view.

**Current state:** "Hey, I'm Tommy / Senior QA Engineer · Epic Games / On this website you'll find engineering field notes, side projects, and the things I think are worth sharing."

**Needed:** Lead with the maker identity. Epic Games is a credibility signal, not the lede. Something like: "maker and tinkerer who bridges art and technology / building projects at the intersection of electronics, software, and creative experimentation / Senior QA Engineer at Epic Games."

**Structure to preserve:** `h1` name + wave emoji, `em` shimmer tagline, separator, descriptive paragraph, CTA buttons. The component structure in `Hero.tsx` is exactly right — only text and CTA hrefs change.

**CTA updates needed:**
- Current: "Unreal Tips" → `/tips`, "Read Journal" → `/blog`, "GitHub" → github
- Phase 4: "See Projects" → `/blog?category=Project`, "Read Journal" → `/blog`, keep GitHub or add "About" CTA

### Pattern 3: Sections Layout on Homepage

**What:** The homepage sections pattern — hero banner full-width, then alternating surface/surface-raised content sections.

**Current structure in `page.tsx`:**
```
Section 1: Hero (bg-surface-raised, rust radial vignette, hero-texture)
Section 2: Latest Posts (bg-surface-raised)
Section 3: Latest Tips (no bg — default surface)
```

**Phase 4 target structure:**
```
Section 1: Hero (bg-surface-raised, rust radial vignette, hero-texture) — UPDATED copy + CTAs
Section 2: Featured Projects (2-3 project cards with cover images) — new
Section 3: Recent Articles (2-3 article previews) — replaces "Latest Posts"
Section 4: About Short (AboutCard inline) — HOME-04
```

Note: "Latest Tips" section is removed or de-emphasized — tips are no longer the primary content. The `AboutCard` in Section 4 satisfies HOME-04 without any new component.

### Pattern 4: About Page Narrative Structure

**What:** `/about` currently has: avatar hero header + `AboutCard` (bio paragraphs + interactive skill badges). The structure is correct — it just needs copy that reads as a maker story, not a resume.

**Narrative arc for the rewrite:**
1. Who Tommy is at root — curious, takes things apart, maker
2. Career thread — live shows → VYV media servers → Epic Games/Unreal, all connected
3. Current work — what he builds now (projects on this site)
4. What this site is — a side-effect of working in the open

The interactive `AboutCard` skill badges (Unreal Engine, Software Dev, Technical Direction, Electronics, Film Photography, AI) are already correct and comprehensive — keep unchanged.

**Metadata that needs updating:**
- `page.tsx` title: "About | Tommy Lahitte" → fine
- `description`: "QA Engineer at Epic Games, maker, tinkerer..." → reorder to lead with maker
- Schema.org `Person` in `layout.tsx`: `jobTitle: 'Senior QA Engineer'` and `knowsAbout` array — update to add maker/electronics/photography

### Pattern 5: FeaturedProjectCard (if needed)

**What:** The existing `BlogCard` shows: cover image (h-52), date, title, excerpt, "Read more" + optional external link. For homepage project cards, a slightly different treatment may be needed — wider image, status badge visible, more prominent visual.

**When to use:** Only create `FeaturedProjectCard` if the design clearly requires something `BlogCard` cannot achieve with minor prop adjustments. Otherwise reuse `BlogCard` directly.

**Rationale for separate component:** Projects on the homepage should feel like a visual portfolio showcase — image-first, title prominent, brief description. `BlogCard` at `h-52` is already good for this. A `FeaturedProjectCard` would differ only in: showing `StatusBadge`, potentially a larger image treatment (`aspect-[16/9]` vs fixed height), and linking text "View Project" instead of "Read more".

**Practical decision:** Start with `BlogCard` reuse. If the visual result is unsatisfactory during implementation, create `FeaturedProjectCard` as a thin wrapper that adds the status badge and adjusts image ratio.

### Anti-Patterns to Avoid

- **Calling `getAllPosts()` multiple times in one page:** Each call hits Notion API (at build time). Call once, filter in memory.
- **Creating a new Notion database or new properties for homepage data:** Everything needed (`category`, `image`, `status`, `excerpt`) already exists in the unified blog database.
- **Adding `'use client'` to `page.tsx`:** The homepage is a server component. It can `await getAllPosts()` directly. Only leaf components that need interactivity (none identified here) need client boundaries.
- **Using `next/image` for Notion-downloaded images in card components:** Phase 2 decision — plain `<img>` for static export compatibility when dimensions are unknown. `BlogCard` already uses `next/image` with `fill` — this is safe because the container div has explicit height. For new components, follow the same pattern or use plain `<img>`.
- **Hardcoding project/article content in page.tsx:** Both sections must come from `getAllPosts()`. Never hardcode content that should come from Notion.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Category-filtered post list | Custom Notion query per category | `getAllPosts().filter(p => p.category === 'X')` | `getAllPosts()` already fetches all published posts with category; filter in memory |
| Project card with cover image | New image component | `BlogCard` (existing) or thin `FeaturedProjectCard` wrapper | `BlogCard` already handles image/no-image, hover animation, correct aspect ratio |
| About page skill badges | New interactive component | `AboutCard` (already complete in `src/components/home/AboutCard.tsx`) | Fully implemented with animation, auto-close, and all 6 skill descriptions |
| Avatar with rotating glow | New animation | Existing pattern in `Hero.tsx` and `about/page.tsx` | Both already implement the identical `conic-gradient`/frosted ring pattern |
| Random illustration in page headers | New asset system | `RandomDoodle` (existing in `src/components/ui/RandomDoodle.tsx`) | Already used on the blog page banner — apply same pattern to homepage sections if needed |

**Key insight:** This phase is almost entirely composition. Every building block was constructed in Phases 1-3. The primary deliverable is correct copy, correct data wiring, and the right section layout — not new infrastructure.

---

## Common Pitfalls

### Pitfall 1: Forgetting to Update Metadata and Schema.org

**What goes wrong:** The homepage `metadata` export in `page.tsx` and the global `layout.tsx` Schema.org `Person` block still describe Tommy as "QA Engineer & Unreal Debug Vault" — reflecting the old site identity. SEO and social sharing will continue to project the wrong identity.

**Why it happens:** It's easy to focus on visible UI and miss the `metadata` export and `layout.tsx` head scripts.

**How to avoid:** HOME-01 should include an explicit task step to update: `page.tsx` title + description, `layout.tsx` default metadata title/description, and the `siteSchemas` Person object in `layout.tsx`.

**Warning signs:** Google Search result preview still shows "QA Engineer & Unreal Debug Vault" branding after deploy.

### Pitfall 2: getAllPosts() Returns Empty Category Slices

**What goes wrong:** If no posts in Notion have `category === 'Project'` set at the time of the build, `featuredProjects` is an empty array, and the homepage projects section renders nothing (or crashes if not guarded).

**Why it happens:** Notion content may not have the `Category` property populated on all entries.

**How to avoid:** Guard the section with a length check: `{featuredProjects.length > 0 && (<section>...</section>)}`. This makes the homepage gracefully degrade if no categorized content exists yet.

**Warning signs:** Build succeeds but homepage shows no projects section with no error — section is silently absent.

### Pitfall 3: Hero CTA Links Point to Wrong Routes

**What goes wrong:** Current CTAs link to `/tips` ("Unreal Tips") and `/blog` ("Read Journal"). Phase 4 should update these to reflect the new site structure (projects + journal). If CTAs are not updated, the hero still sends visitors to the tips page as the primary destination.

**Why it happens:** `Hero.tsx` has the CTA hrefs hardcoded. Easy to forget to update them.

**How to avoid:** Update `Hero.tsx` CTAs explicitly: primary button → `/blog?category=Project` ("See Projects"), secondary → `/blog` ("Read Journal"). The current `{ scroll: false }` pattern is not applicable here since these are navigation links, not filter actions.

**Warning signs:** Clicking the primary hero CTA goes to `/tips` after the phase is complete.

### Pitfall 4: About Page Copy Feels Like a Resume

**What goes wrong:** The rewritten About page still lists "Senior QA Engineer at Epic Games" as the lede, with maker identity as a footnote. Violates ABOU-01 ("reads as a human story, not a resume").

**Why it happens:** It's easier to organize by job title/company than by personal narrative arc.

**How to avoid:** Structure the narrative chronologically around curiosity and building: "I've always taken things apart to see how they work" → live show career arc → media server work at VYV → Unreal at Epic. The job title appears as context within the story, not as the headline.

**Warning signs:** The first paragraph of the About page mentions "Epic Games" or "QA Engineer" before it mentions making/building/curiosity.

### Pitfall 5: "Latest Posts" Section Still Shows Mixed Categories

**What goes wrong:** The current homepage `getAllPosts().slice(0, 2)` shows the 2 most recent posts regardless of category — these could be recommendations or projects, not articles. The section should show articles only (HOME-03).

**Why it happens:** The `getAllPosts()` call predates the `category` field from Phase 3.

**How to avoid:** Filter for `category === 'Article'` before slicing: `allPosts.filter(p => p.category === 'Article').slice(0, 3)`.

---

## Code Examples

### Category-Filtered Data Composition

```typescript
// src/app/page.tsx — verified pattern using getAllPosts() from src/lib/blog.ts
export default async function HomePage() {
  const allPosts = await getAllPosts()

  const featuredProjects = allPosts
    .filter((p) => p.category === 'Project')
    .slice(0, 3)

  const recentArticles = allPosts
    .filter((p) => p.category === 'Article')
    .slice(0, 3)

  return (
    <>
      {/* Section 1: Hero */}
      <section
        className="bg-gradient-to-b from-surface-raised to-surface border-b border-border relative overflow-hidden hero-texture"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,90,58,0.06) 0%, transparent 70%), linear-gradient(to bottom, var(--surface-raised), var(--surface))',
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 py-10 sm:py-16">
            <Hero />
          </div>
        </div>
      </section>

      {/* Section 2: Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="pt-12 sm:pt-16 pb-12 bg-surface">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-text-primary mb-8 font-display">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProjects.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            {/* View all projects link */}
          </div>
        </section>
      )}

      {/* Section 3: Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="pt-12 sm:pt-16 pb-12 bg-surface-raised">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-text-primary mb-8 font-display">Journal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentArticles.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            {/* View all articles link */}
          </div>
        </section>
      )}

      {/* Section 4: Short About — HOME-04 */}
      <section className="pt-12 sm:pt-16 pb-32 bg-surface">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <AboutCard />
        </div>
      </section>
    </>
  )
}
```

### Hero CTA Pattern (to update in Hero.tsx)

```typescript
// Source: src/components/home/Hero.tsx — CTAs to update
// FROM:
<Link href="/tips" ...>Unreal Tips</Link>
<Link href="/blog" ...>Read Journal</Link>

// TO:
<Link href="/blog?category=Project" ...>See Projects</Link>
<Link href="/blog" ...>Read Journal</Link>
// Keep GitHub link — external credibility signal
```

### Graceful Empty Section Guard

```typescript
// Always guard category-filtered sections against empty arrays
{featuredProjects.length > 0 && (
  <section>
    {/* projects */}
  </section>
)}
```

### Metadata Update Pattern

```typescript
// src/app/page.tsx — update title, description to maker identity
export const metadata: Metadata = {
  title: 'Tommy Lahitte | Maker & Tinkerer',
  description:
    'Tommy Lahitte — maker who bridges art and technology. Projects, field notes, and things worth building.',
  alternates: {
    canonical: 'https://tommylahitte.com/',
  },
  // openGraph follows same pattern
}
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Homepage shows `getAllTips()` as primary content | Phase 4: Homepage shows projects + articles from Notion | Site narrative shifts from "debug vault" to "maker portfolio" |
| `getAllPosts().slice(0, 2)` (category-unaware) | `allPosts.filter(category).slice(0, N)` | Projects and articles shown in dedicated sections, not mixed |
| About page = AboutCard only | About page = maker narrative copy + existing AboutCard | ABOU-01: reads as human story |
| Hero CTA primary: "Unreal Tips" | Hero CTA primary: "See Projects" | First action visitor takes reflects maker identity, not QA niche |
| Schema.org Person: "Senior QA Engineer" only | Update to include maker/builder facets | SEO structured data reflects full identity |

**Deprecated/outdated:**
- The `getAllTips()` import in `page.tsx` and the "Latest Tips" section: not part of the new homepage structure. The Tips section served the old "debug vault" identity. Phase 4 removes it in favor of Projects + Articles sections.

---

## Open Questions

1. **Should the "Latest Tips" section be removed or moved?**
   - What we know: The current homepage prominently features 3 tips cards. Tips are not part of the Phase 4 requirements.
   - What's unclear: Whether Tommy wants tips to remain on the homepage (lower priority) or disappear from it entirely.
   - Recommendation: Remove from homepage — the phase requirements do not mention tips, and the nav still has "Unreal Tips" as a direct link. The tips discovery path is preserved through nav; the homepage narrative should focus on the maker story (projects + articles + about).

2. **FeaturedProjectCard vs. reusing BlogCard**
   - What we know: `BlogCard` uses `motion.article`, fixed `h-52` image, date, title, excerpt, "Read more" text. It does not show `StatusBadge`.
   - What's unclear: Whether the visual weight of project cards on the homepage warrants a distinct card type.
   - Recommendation: Start implementation with `BlogCard` reuse. The planner should schedule `FeaturedProjectCard` as a conditional task — "create only if BlogCard visual result is insufficient."

3. **About page: keep avatar hero section or simplify?**
   - What we know: `about/page.tsx` has a hero section with the rotating glow avatar (identical to `Hero.tsx`), then `AboutCard` below. The structure exists.
   - What's unclear: Whether the avatar hero banner adds value on the About page given it already appears on the homepage hero.
   - Recommendation: Keep the avatar section on About — it anchors the page identity and is visually distinctive. Only the surrounding copy and section headline need updating.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `pnpm vitest run src/lib/blog.test.ts` |
| Full suite command | `pnpm vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | Hero renders maker identity copy (not "QA Engineer" as lede) | manual-only | Visual review — copy content not unit-testable | N/A |
| HOME-02 | `getAllPosts()` returns Project-category posts with `image` field usable for homepage | unit | `pnpm vitest run src/lib/blog.test.ts` | ✅ (extend existing) |
| HOME-03 | `getAllPosts()` returns Article-category posts for homepage section | unit | `pnpm vitest run src/lib/blog.test.ts` | ✅ (extend existing) |
| HOME-04 | AboutCard renders without errors when embedded in server page | unit | `pnpm vitest run src/components/blog/` | N/A — AboutCard is pure static render |
| ABOU-01 | About page renders without errors, AboutCard is present | smoke | `pnpm run build` (Next.js static export validates all pages) | ✅ via build |

**Note on HOME-01 and ABOU-01 copy requirements:** The "reads as a human story" and "5-second identity" criteria are qualitative. They are verified by visual review during `/gsd:verify-work`, not automated tests. The automated tests confirm the data pipeline is correct (categories returned, images present); the narrative quality is a human judgment call.

### Sampling Rate

- **Per task commit:** `pnpm vitest run`
- **Per wave merge:** `pnpm vitest run && pnpm run build`
- **Phase gate:** Full suite green + build succeeds before `/gsd:verify-work`

### Wave 0 Gaps

- None — existing test infrastructure covers all automated requirements for this phase. The blog DAL tests in `src/lib/blog.test.ts` already test `getAllPosts()` return shape. No new test files are needed for Phase 4.

*(The qualitative requirements HOME-01 and ABOU-01 are manual-review items, not testable via vitest.)*

---

## Sources

### Primary (HIGH confidence)

- Direct codebase inspection — `src/app/page.tsx`, `src/app/about/page.tsx`, `src/components/home/Hero.tsx`, `src/components/home/AboutCard.tsx`, `src/components/blog/BlogCard.tsx`, `src/lib/blog.ts`, `src/lib/blog-types.ts`
- `src/app/blog/page.tsx` — section structure pattern for page headers
- `src/app/layout.tsx` — global metadata and Schema.org structures to update
- `tailwind.config.ts` + `src/app/globals.css` — all kraft design tokens confirmed
- `vitest.config.ts` + `package.json` — test infrastructure and dependency versions
- `.planning/REQUIREMENTS.md` — HOME-01 through HOME-04, ABOU-01
- `.planning/phases/03-projects-section/03-RESEARCH.md` — Phase 3 patterns and decisions

### Secondary (MEDIUM confidence)

- Next.js 15 App Router async server component pattern — consistent with existing `blog/page.tsx` and `blog/[slug]/page.tsx` usage

### Tertiary (LOW confidence)

- None — all claims are grounded in direct codebase inspection

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified from `package.json`, all patterns verified from source files
- Architecture: HIGH — homepage section pattern, data filtering, component reuse all proven in prior phases
- Pitfalls: HIGH — metadata update gap and category-aware filtering are concrete, code-grounded risks
- Copy/narrative quality: LOW for automation — qualitative requirements (5-second identity, human story) cannot be verified programmatically

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (stable stack, internal patterns — no external dependencies change)
