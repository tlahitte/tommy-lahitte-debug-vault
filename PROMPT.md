# Task: Build tommy-lahitte-debug-vault Next.js Site

## Context
Build a Next.js 15 App Router static export site for Tommy Lahitte (QA Engineer, Epic Games).
Dark theme: zinc-950 bg, violet-500 accent. Tailwind only — no CSS modules.
Notion source page: "Useful Stuff" (fetch via Notion MCP in Phase 6).

## Each Iteration: Check Phase Markers, Then Advance

---

## Phase 1: Scaffold (if `package.json` missing)
Create: package.json, next.config.ts (output:'export'), netlify.toml, tailwind.config.ts,
tsconfig.json, src/app/globals.css, src/lib/types.ts, src/lib/tips.ts,
src/content/tips/index.ts (empty allTips array), .claude/.gitignore (epic-ralph.local.md).
Marker: add `// PHASE 1: DONE` to src/content/tips/index.ts

## Phase 2: Layout & UI Components (if Phase 1 done, Header.tsx missing)
Create: Header.tsx (sticky, "Tommy Lahitte | Debug Vault", Home+Tips links),
Footer.tsx, layout.tsx (Inter font, dark bg, Header+Footer),
CodeBlock.tsx, Tag.tsx, CategoryBadge.tsx (editor=blue, debugging=red, qa-workflow=green).
Marker: `// PHASE 2: DONE` in src/app/layout.tsx

## Phase 3: Home Page (if Phase 2 done, `// PHASE 3: DONE` not in page.tsx)
Create: Hero.tsx (Tommy Lahitte name, "QA Engineer | Unreal Engine" tagline, CTA→/tips),
AboutCard.tsx (2-3 sentence bio), src/app/page.tsx.
Marker: `// PHASE 3: DONE` in src/app/page.tsx

## Phase 4: Tips Index (if Phase 3 done, `// PHASE 4: DONE` missing)
Create: TipCard.tsx, CategoryFilter.tsx ('use client', ?category= param),
src/app/tips/page.tsx (reads param, renders TipCard grid).
Marker: `// PHASE 4: DONE` in src/app/tips/page.tsx

## Phase 5: Tip Detail Page (if Phase 4 done, `// PHASE 5: DONE` missing)
Create: TipDetail.tsx (renders TipContent[] blocks: paragraph/heading/code/callout/list),
src/app/tips/[slug]/page.tsx (generateStaticParams from getAllTips(), metadata, back link).
Marker: `// PHASE 5: DONE` in src/app/tips/[slug]/page.tsx

## Phase 6: Notion Content Import (if Phase 5 done, fewer than 3 tips in index.ts)
1. Use Notion MCP to find "Useful Stuff" page and retrieve its blocks
2. For each tip/section: determine category, create kebab-case slug,
   write src/content/tips/<category>-<slug>.ts exporting a Tip object
3. Add each tip to allTips in src/content/tips/index.ts
4. Process 3-5 tips per iteration; leave `// NOTION FETCH: up to block <id>` comment to resume
Marker: `// PHASE 6: DONE` in src/content/tips/index.ts when all blocks processed

## Phase 7: SEO & Polish (if Phase 6 done, `// PHASE 7: DONE` missing anywhere)

### Metadata
- Add `generateMetadata()` to every page: unique title, description, canonical URL, og:*, twitter:*
- Home title format: "Tommy Lahitte | QA Engineer & Unreal Debug Vault"
- Tip title format: "<Tip Title> — Tommy Lahitte Debug Vault"

### Structured Data (JSON-LD)
- Add Person schema to src/app/layout.tsx:
  `{ "@type": "Person", "name": "Tommy Lahitte", "jobTitle": "QA Engineer", "knowsAbout": ["Unreal Engine", "Game QA", "Debugging"] }`
- Add Article/HowTo schema to src/app/tips/[slug]/page.tsx per tip

### Sitemap & robots.txt
- Generate public/sitemap.xml listing all pages with <loc>, <lastmod>, <changefreq>, <priority>
- Create public/robots.txt allowing all crawlers with Sitemap reference

### Heading Hierarchy
- Ensure one <h1> per page (tip title on detail pages, "Tommy Lahitte" on home)
- <h2> for tip section headings

### Image alt text
- All images have descriptive alt text; all have explicit width + height

### Other
- Add src/app/not-found.tsx with friendly 404 message
- Verify generateStaticParams covers all tips
- Add README.md
- Confirm no API routes or 'use server' exist

When all done, output exactly: <promise>SITE BUILD COMPLETE</promise>

## Rules
- Never skip phases — always check markers first
- Never overwrite content from previous iterations
- All TypeScript must be strict — no `any`
- Tailwind utility classes only
- React Server Components by default; `'use client'` only for interactive components
