# Architecture

**Analysis Date:** 2026-03-15

## Pattern Overview

**Overall:** Next.js Static Site Generator (SSG) with Content-as-Data model

**Key Characteristics:**
- Static content files with TypeScript type definitions
- React Server Components throughout (no client-side hydration overhead)
- Data layer separated from presentation via library functions
- Client-side filtering on Tips page (minimal interactivity)
- Next.js metadata and Schema.org integration for SEO
- TailwindCSS utility-first styling

## Layers

**Presentation Layer (UI Components):**
- Purpose: Render content and handle minimal client-side interactions
- Location: `src/components/`
- Contains: React Server Components and Client Components
- Depends on: Type definitions from `src/lib/types.ts` and `src/lib/blog-types.ts`
- Used by: Page components in `src/app/`
- Examples: `TipCard`, `TipDetail`, `BlogCard`, `Hero`, `Header`, `Footer`

**Page Layer (Next.js App Router):**
- Purpose: Define routes, generate static parameters, set metadata
- Location: `src/app/` (Next.js 13+ App Router)
- Contains: Page components, layout files, route groups
- Depends on: Data functions from `src/lib/`
- Used by: Next.js routing system
- Examples: `page.tsx` files in root, `/tips/[slug]/`, `/blog/[slug]/`

**Data Access Layer (Library Functions):**
- Purpose: Query and transform content data
- Location: `src/lib/`
- Contains: Type definitions and query functions
- Depends on: Content module exports
- Used by: Page and component layer
- Key files:
  - `tips.ts` - Functions: `getAllTips()`, `getTipBySlug()`, `getTipsByCategory()`
  - `blog.ts` - Functions: `getAllPosts()`, `getPostBySlug()`
  - `types.ts` - Tip/Category type definitions
  - `blog-types.ts` - BlogPost type definitions

**Content Layer (Data Files):**
- Purpose: Store authored content as TypeScript objects
- Location: `src/content/`
- Contains: Tip definitions, blog post definitions
- Structure: Each tip/post is exported as an object matching interface
- Examples: `debugging-visual-logger.ts`, `people-person-show.ts`
- Content discovery: `src/content/tips/index.ts`, `src/content/blog/index.ts` (barrel exports)

**Layout Layer (Root Structure):**
- Purpose: Define site-wide structure, header/footer
- Location: `src/app/layout.tsx`
- Contains: RootLayout, global styles, font imports, Schema.org markup
- Metadata: Site-level metadata, canonical URLs, OG tags
- Children: All pages and sections

## Data Flow

**Tip Display Flow (with filtering):**

1. User visits `/tips/` page
2. `src/app/tips/page.tsx` calls `getAllTips()` from `src/lib/tips.ts`
3. `getAllTips()` imports `allTips` array from `src/content/tips/index.ts`
4. Content is sorted by `publishedAt` descending
5. Data passed to `<TipsGrid>` component
6. TipsGrid wraps content in Suspense, renders `<TipsGridInner>`
7. TipsGridInner (Client Component) reads `category` from URL search params
8. Filters tips by category using `getTipsByCategory()` or client-side filter
9. Maps filtered tips to `<TipCard>` components
10. Each TipCard renders summary preview with link to `/tips/{slug}/`

**Tip Detail Flow (SSG with dynamic routes):**

1. User visits `/tips/{slug}/` page
2. Next.js calls `generateStaticParams()` at build time → returns all tip slugs
3. During build, Next.js renders all slug variations statically
4. `generateMetadata()` called per route → fetches metadata for SEO
5. Page component calls `getTipBySlug(slug)` → finds matching tip
6. If found, renders `<TipDetail>` with tip object
7. TipDetail maps `tip.content[]` array through `renderBlock()` switch statement
8. Block types (paragraph, heading, code, callout, list) render with Tailwind styling
9. Returns 404 if slug not found

**Blog Post Flow (Similar SSG pattern):**

1. User visits `/blog/` → displays all posts from `getAllPosts()`
2. Posts displayed as `<BlogCard>` components with images and excerpts
3. User visits `/blog/{slug}/` → generates static routes at build time
4. Page renders post content using `renderBlock()` for BlogBlock types
5. Post can include optional external link

**Home Page Flow:**

1. User visits `/` → `src/app/page.tsx`
2. Calls `getAllTips().slice(0, 3)` and `getAllPosts().slice(0, 2)`
3. Renders Hero section (visual intro)
4. Renders AboutCard (author info)
5. Renders latest blog posts as BlogCard previews
6. Renders latest tips as TipCard previews
7. Both sections include "View All" links to full pages

**Sitemap Generation:**

1. `src/app/sitemap.ts` is called by Next.js at build time
2. Fetches all tips and posts
3. Creates entries with lastModified, changeFrequency, priority
4. Returns flat array of sitemap entries for XML generation

**State Management:**

- No global state management (Redux, Zustand, etc.) - not needed
- URL search params used for Tips page filtering (category)
- Component-level state minimal (TipsGrid uses `useSearchParams()` for client-side filtering)
- All data is immutable (content files)

## Key Abstractions

**Tip Object:**
- Purpose: Encapsulates a debugging/QA tip with structured content
- Examples: `src/content/tips/debugging-visual-logger.ts`, `src/content/tips/editor-output-log-filters.ts`
- Pattern: Each file exports a `tip` constant of type `Tip`
- Contains: slug, title, category, summary, tags, content array, publishedAt
- Content array composed of flexible block types (TipContent union)

**BlogPost Object:**
- Purpose: Encapsulates a blog post with optional external link
- Examples: `src/content/blog/people-person-show.ts`, `src/content/blog/elevenlabs-elevenpapps-immersive-show.ts`
- Pattern: Each file exports a `post` constant of type `BlogPost`
- Contains: slug, title, date, excerpt, optional image, optional external link, content blocks

**TipContent/BlogBlock Union Types:**
- Purpose: Flexible content structure supporting multiple block types
- Pattern: Discriminated union using `type` field
- Supported types for tips: paragraph, heading, code, callout, list
- Supported types for blog: paragraph, heading, list
- Enables type-safe rendering via switch statements in `renderBlock()`

**Category Type:**
- Purpose: Enumerated valid tip categories
- Type: `'editor' | 'debugging' | 'qa-workflow'`
- Used for: Filtering on Tips page, styling category badges

## Entry Points

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: User navigates to `/` or site root
- Responsibilities:
  - Fetch latest 3 tips and 2 blog posts
  - Render Hero introduction with CTAs
  - Display preview cards for tips and blog
  - Include navigation links to full pages

**Tips Listing Page:**
- Location: `src/app/tips/page.tsx`
- Triggers: User navigates to `/tips`
- Responsibilities:
  - Fetch all tips
  - Render grid with filtering capability
  - Set SEO metadata

**Tip Detail Page:**
- Location: `src/app/tips/[slug]/page.tsx`
- Triggers: User navigates to `/tips/{slug}/`
- Responsibilities:
  - Generate static routes for all tips at build time
  - Fetch specific tip by slug
  - Render full article with schema.org markup
  - Return 404 if not found

**Blog Listing Page:**
- Location: `src/app/blog/page.tsx`
- Triggers: User navigates to `/blog`
- Responsibilities:
  - Fetch all blog posts
  - Render grid of blog cards with images
  - Set SEO metadata

**Blog Post Detail Page:**
- Location: `src/app/blog/[slug]/page.tsx`
- Triggers: User navigates to `/blog/{slug}/`
- Responsibilities:
  - Generate static routes for all posts at build time
  - Fetch specific post by slug
  - Render full article with optional image and external link
  - Return 404 if not found

**Sitemap:**
- Location: `src/app/sitemap.ts`
- Triggers: Next.js metadata generation (build time)
- Responsibilities:
  - Generate XML sitemap entries for all pages
  - Include priority and change frequency hints

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page load
- Responsibilities:
  - Render site-wide structure (Header, Footer, main slot)
  - Inject global metadata and schema.org site schema
  - Load fonts (Inter)
  - Apply global CSS

## Error Handling

**Strategy:** Fail-safe with 404 pages for missing content

**Patterns:**

- **Missing Slug:** Dynamic routes call `getTipBySlug()` or `getPostBySlug()`. If undefined returned, page calls `notFound()` which triggers Next.js 404 page (`src/app/not-found.tsx`)
- **Missing Category:** Client-side filter validates category against `VALID_CATEGORIES` before filtering. Invalid category shows all tips
- **Empty Results:** If filtered tips array is empty, TipsGrid displays "No tips in this category yet" message

## Cross-Cutting Concerns

**Logging:** No logging framework. Console available but not used in production code.

**Validation:** Minimal - URL slugs validated against existing content at build time via `generateStaticParams()`.

**Authentication:** Not applicable - public website with no auth requirements.

**SEO:**
- Implemented via Next.js `Metadata` API in page components
- Dynamic metadata generation via `generateMetadata()` for dynamic routes
- Schema.org markup injected via `<script type="application/ld+json">` in page components
- Canonical URLs set for all pages
- Open Graph and Twitter Card tags included
- Sitemap generated automatically

**Styling:**
- TailwindCSS utility classes
- Custom animations in `src/app/globals.css` (spin-slow)
- Dark theme (zinc/violet color palette)
- Responsive design with `sm:`, `lg:` breakpoints

---

*Architecture analysis: 2026-03-15*
