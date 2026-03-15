# Feature Research

**Domain:** Maker/tinkerer personal portfolio site — project showcases + blog journal
**Researched:** 2026-03-15
**Confidence:** HIGH (multiple converging sources across maker communities, portfolio best practices, design references)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features visitors assume exist. Missing these = the site feels incomplete or unprofessional.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Project gallery / index page | Visitors expect to browse all projects at a glance before diving in | LOW | Grid or list layout with cover image + title + one-liner. Already planned in PROJECT.md |
| Per-project page with gallery | Every project is multi-faceted; a single image is never enough | MEDIUM | Multiple photos (process + result), not just the hero shot |
| Cover image per project | Visual entry point; absent = feels abandoned | LOW | Handled at Notion CMS level — field required in schema |
| Project title + short description | Basic orientation; visitors give 5s before bouncing | LOW | Visible on card and at top of project page |
| Technologies / tools used | Readers want to understand what was involved at a glance | LOW | Tag list or inline callout block — not a wall of prose |
| Blog / journal index page | Second content type expected on a personal site | LOW | Already exists in current codebase |
| Individual article pages | Readable long-form content with proper typography | LOW | Already exists; redesign needed for identity |
| About page | Visitors need to anchor who made this before trusting the work | LOW | Must convey the maker identity, not a resume dump |
| Responsive design (mobile) | 66% of web traffic is mobile — broken mobile = invisible site | LOW | Tailwind makes this straightforward; already done for blog |
| SEO metadata per page | Portfolio exists to be discovered; invisible to search = no reach | LOW | Already implemented (metadata, OG, Schema.org, sitemap) |
| Legible typography | Long-form reads fail completely with poor type | LOW | Already planned in PROJECT.md; redesign scope |
| Navigation coherent with identity | Inconsistent nav breaks trust before content loads | LOW | In scope for the visual redesign |

---

### Differentiators (Competitive Advantage)

Features that set this portfolio apart. Most makers don't have these — they're what make the site memorable and aligned with the core value ("understand Tommy's approach, not just his output").

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Process documentation — not just results | Shows how Tommy thinks, not just what he built. The #1 differentiator in maker portfolios. Mediocre portfolios show the finished object; great ones show the mess before it. | MEDIUM | Structured sections: Motivation → Approach → Problems encountered → What I learned → Result |
| Failures & lessons-learned section per project | Authenticity signal. Hiding failures signals polish-over-substance. Documenting them signals confidence and intellectual honesty. | LOW | A dedicated "What went wrong / what I learned" block on each project page |
| Build log / chronological process entries | Shows a project as a living process, not a retroactive summary. Readers follow along. Hackaday's most-read content is build logs. | HIGH | Requires either: (a) Notion sub-pages as log entries or (b) a series of dated blocks within the project page. MEDIUM if kept as a flat section. |
| Visual process photos (not just hero shots) | Work-in-progress photos are more credible and interesting than polished finals. Raw = authentic. | LOW | Requires discipline in photo-taking during builds — content problem, not code problem |
| "Materials used" / bill of materials callout | Grounds the project in physical reality. Readers immediately understand scale and constraints. | LOW | A callout block or table in the project page — rendered from a Notion table |
| Identity-coherent design system (kraft/industrial) | Visitors sense the aesthetic IS the maker. Teenage Engineering effect: the packaging is part of the product. Generic site = generic maker impression. | MEDIUM | The full visual redesign — palette, typography, spacing, texture cues |
| Maker identity visible on homepage | The homepage should communicate who Tommy is and what he values before any specific project. Most personal sites bury the "why." | MEDIUM | A short, opinionated hero statement + 2–3 featured projects as proof |
| Cross-linking projects ↔ articles | When a project has a related journal article, surface it. Readers who engage with one type of content get pulled into the other. | LOW | A "Related writing" link on project pages and "Related project" link on articles |
| Category/filter system on projects | As the project count grows, filtering by domain (electronics, software, art, fabrication) prevents cognitive overload | MEDIUM | Already exists for tips; same pattern applies to projects |
| Estimated complexity / time callout | Gives readers orientation: is this a weekend hack or a 3-month obsession? Relevant context before reading. | LOW | A metadata field in Notion, rendered as a badge |

---

### Anti-Features (Commonly Requested, Often Problematic)

Features that appear attractive but don't fit this project's core value or create disproportionate maintenance cost.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Comment system / community discussion | "Users should engage with content" | Personal portfolio is a broadcast, not a community. Comments need moderation, spam filtering, and ongoing maintenance. Dilutes the maker-as-author voice. | Link to Hackaday.io or GitHub Issues for technical discussion; social links for conversation |
| Dark mode toggle | "Users prefer dark mode" | Out of scope per PROJECT.md. Adds CSS complexity and a system-state dependency. The industrial/kraft identity only works as a light palette. | Committed light theme with excellent contrast ratios |
| Real-time view counters / analytics dashboard | "Know what content performs" | Public-facing vanity metrics invite gaming and distract from content quality. Private analytics (Plausible/Netlify) give the data without cluttering the UI. | Private analytics only; no public counters |
| Search bar with full-text search | "Users want to find anything quickly" | At <50 projects/articles, search is over-engineering. Adds either client-side JS bundle weight (Fuse.js) or a backend dependency. | Category filters + linear browsing; add search only when >100 items |
| Newsletter / email subscription | "Build an audience" | Requires an email service, subscription management, GDPR compliance, and regular email content creation — a separate product. | RSS feed (free, stateless, already a standard for blogs) |
| Like / bookmark / favorite per project | "Users want to save favorites" | Requires user state = authentication = a backend. No auth is an explicit constraint. | Social sharing links; no saved state |
| Contact form with complex fields | Out of scope per PROJECT.md | "Project inquiry type," "budget," etc. adds friction. Portfolio readers don't fill out forms. | A single visible email address or a minimal one-field form |
| CMS admin interface on the site | "Manage content from anywhere" | Explicitly out of scope. Notion already does this better than any custom /admin panel. | Notion as CMS — already decided |
| Animation for its own sake | "Stand out with motion" | Micro-animations add polish; animations-as-decoration inflate bundle size and distract from content. The Teenage Engineering reference is notable for what it doesn't animate. | Purposeful transitions only (page load fade, image hover state, scroll reveal for hero) |
| Testimonials / social proof section | "Credibility signal" | Tommy is not selling services from this portfolio; it's a maker identity site, not a freelance landing page. Testimonials feel mismatched to the "garage workbench" aesthetic. | Let the work speak; link to GitHub stars or community reactions if relevant |

---

## Feature Dependencies

```
[About page]
    └──requires──> [Design system / identity] (About is meaningless if the visual voice doesn't reinforce the text)

[Project gallery]
    └──requires──> [Notion CMS integration] (static content migration → Notion pipeline)
    └──requires──> [Project page template] (can't link to pages that don't exist)

[Project page — process sections]
    └──requires──> [Notion CMS integration] (Notion is the editing surface)
    └──requires──> [Rich content rendering] (image galleries, callout blocks, tables from Notion)

[Cross-linking projects ↔ articles]
    └──requires──> [Both content types live] (needs both project pages AND blog articles in Notion)
    └──requires──> [Notion relation field support] (Notion relations between project DB and article DB)

[Category/filter on projects]
    └──requires──> [Project gallery] (filter has nothing to act on without the list)
    └──requires──> [Category field in Notion schema]

[Build log / chronological entries]
    └──requires──> [Notion CMS integration]
    └──enhances──> [Process documentation sections] (chronological detail enriches the narrative)

[RSS feed]
    └──requires──> [Blog articles with dates and slugs] (already exists conceptually)

[Design system / identity]
    └──enhances──> [Every content page] (visual identity amplifies content credibility)

[SEO metadata]
    └──enhances──> [Project gallery] and [Blog index] and [Individual pages]
    └──requires──> [Notion CMS integration] (dynamic titles/descriptions come from Notion fields)
```

### Dependency Notes

- **Notion CMS integration is the critical path:** project pages, process documentation, cross-linking, and the filter system all depend on it. It must land before any content-dependent features.
- **Design system must precede content page work:** building project pages in the wrong visual context means rework. Establish the design tokens (palette, type scale, spacing) before building page templates.
- **Process documentation sections are low-code, high-impact:** they depend on Notion integration but are themselves just a structured Notion page layout — no special frontend component needed beyond what renders rich text blocks.
- **Build log (full chronological format) conflicts with simplicity:** if Tommy does not document projects as he builds them, a build log is post-hoc reconstruction and loses authenticity. Start with a flat "process" section; graduate to logs only if the content habit supports it.

---

## MVP Definition

### Launch With (v1)

The minimum needed to ship a redesigned maker portfolio that fulfills the core value ("understand the approach, not just the output").

- [ ] Notion CMS integration — project pages + blog articles — this is the foundation everything else builds on
- [ ] Project gallery page — visual grid of projects with cover image, title, one-liner
- [ ] Individual project page with: gallery, motivation, process narrative, what I learned, tools/materials used, result
- [ ] Blog/journal index and article pages — redesigned for the kraft/industrial visual identity
- [ ] About page — maker identity, not resume; must communicate "why I build"
- [ ] Homepage — featured projects + a short opinionated statement of who Tommy is
- [ ] Design system — kraft/beige palette, Teenage Engineering-inspired type and spacing
- [ ] Responsive layout and existing SEO (already done, preserve during redesign)

### Add After Validation (v1.x)

Features to add once the core is working and content is flowing.

- [ ] Category/filter on projects — add when project count reaches 8+, not before
- [ ] Cross-linking projects ↔ articles — add once both content types have several published items
- [ ] RSS feed for blog — low effort, high value for returning readers once content rhythm is established
- [ ] Estimated complexity / time badge per project — add when the pattern of what metadata Tommy actually fills in is clear

### Future Consideration (v2+)

Defer until the portfolio is live, content is regularly updated, and the site's identity is stable.

- [ ] Build log / chronological process entries — requires a content discipline habit to form first; evaluate after 6 months of use
- [ ] Full-text search — only warranted at 100+ items across both content types

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Notion CMS integration (projects + blog) | HIGH | HIGH | P1 |
| Project gallery + project page template | HIGH | MEDIUM | P1 |
| Design system / visual identity | HIGH | MEDIUM | P1 |
| Process documentation structure (on project page) | HIGH | LOW | P1 |
| About page | HIGH | LOW | P1 |
| Homepage with featured projects | HIGH | MEDIUM | P1 |
| Blog index + article pages (redesigned) | HIGH | LOW | P1 |
| What I learned / failures section | HIGH | LOW | P1 |
| Materials used / tools callout | MEDIUM | LOW | P2 |
| Category filter on projects | MEDIUM | MEDIUM | P2 |
| Cross-linking projects ↔ articles | MEDIUM | MEDIUM | P2 |
| RSS feed | MEDIUM | LOW | P2 |
| Estimated complexity badge | LOW | LOW | P2 |
| Build log / chronological entries | HIGH | HIGH | P3 |
| Full-text search | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## What a Great Project Showcase Looks Like vs. a Mediocre One

This is the core question for project page design. Evidence from Hackaday, portfolio best practices, and maker community standards converges on a clear contrast:

| Dimension | Mediocre Project Page | Great Project Page |
|-----------|----------------------|-------------------|
| Content scope | Final result only | Full arc: motivation → process → problems → result |
| Failures | Hidden or absent | Documented explicitly as "what went wrong" |
| Visual evidence | 1–2 polished hero shots | Process photos, in-progress shots, detail shots, final |
| Voice | Dry, tool-listing prose | Personal, opinionated, first-person ("I tried X, it broke because...") |
| Technical detail | Vague ("I used electronics") | Specific ("L298N motor driver, powered by 2S LiPo, ran too hot") |
| Reflection | None | "What I learned" section — about the domain AND about the process |
| Context | No orientation | Clear statement of what problem this solves or why it was worth building |
| Length | Too short (3 sentences) OR too long (wall of text) | Structured sections — skimmable but deep for those who want detail |
| Outcome | Implied | Stated plainly — did it work? what would you do differently? |

**The single biggest differentiator:** documenting the failure mode. Any finished project page can show the thing working. Only authentic makers document why it almost didn't, and what that taught them.

---

## Competitor Feature Analysis

Reference points are not commercial competitors but comparable personal maker/developer portfolios and maker documentation platforms:

| Feature | Hackaday.io | Instructables | Typical dev portfolio | Tommy's approach |
|---------|------------|---------------|----------------------|-----------------|
| Project overview | YES | YES | YES | YES — table stakes |
| Build log / process | YES (core) | YES (steps) | Rare | Flat process section v1, log format v2+ |
| Materials / BOM | YES | YES | N/A | Callout block per project |
| Community discussion | YES | YES | Sometimes | NO — out of scope, link to platforms |
| Identity / aesthetic | Generic | Generic | Often generic | Distinctive — kraft/industrial, the differentiator |
| Journal / blog | NO | NO | Sometimes | YES — second content type, unique in the maker space |
| Failures documented | Community-encouraged | Rarely | Almost never | YES — explicit section, a key differentiator |
| CMS editing | Platform UI | Platform UI | Code edits | Notion — frictionless for Tommy |
| Filtering / categories | YES | YES | Rare | YES — planned for v1.x |

---

## Sources

- Hackaday — "How Best To Get Your Project On Hackaday" (project documentation philosophy): https://hackaday.com/2021/04/27/how-best-to-get-your-project-on-hackaday/
- Hackaday.io — Project format documentation (build logs, BOM, gallery): https://hackaday.io/project/46/logs
- Speckyboy — "10 Beautiful Examples of Storytelling in Portfolio Design": https://speckyboy.com/tell-story-portfolio/
- Design Shack — "Portfolio Storytelling: How to Present Your Work Like a Narrative": https://designshack.net/articles/freelancing/storytelling-in-portfolio-design/
- Dribbble Design Blog — "Crafting a Narrative: Mastering Storytelling in Your Design Portfolio": https://dribbble.com/stories/2024/03/18/crafting-a-narrative-mastering-storytelling-in-your-design-portfolio
- Rethink your Design Portfolio / Medium — "Tips on presenting School Projects": https://medium.com/portfolio-principles/tips-on-presenting-school-projects-on-your-design-portfolio-9230ca8d5c14
- Cirkled In — "From Idea to Impact: Documenting a Passion Project": https://www.cirkledin.com/library/resume-and-portfolio-building/documenting-passion-project-portfolio-process-impact/
- learnui.design — "Create a Standout UX/UI Design Portfolio: The 4 Key Principles": https://www.learnui.design/blog/portfolio-mistakes.html
- Teenage Engineering design reference: https://teenage.engineering/designs
- WebFX — "30 Minimalist Portfolio Website Designs for Inspiration": https://www.webfx.com/blog/web-design/minimalist-portfolio-website/

---

*Feature research for: debug-vault — Tommy Lahitte maker/tinkerer portfolio*
*Researched: 2026-03-15*
