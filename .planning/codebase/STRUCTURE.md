# Codebase Structure

**Analysis Date:** 2026-03-15

## Directory Layout

```
project-root/
├── src/                              # Source code
│   ├── app/                          # Next.js 13+ App Router pages & layouts
│   │   ├── layout.tsx                # Root layout (Header, Footer, global structure)
│   │   ├── page.tsx                  # Home page (/)
│   │   ├── sitemap.ts                # Dynamic sitemap generation
│   │   ├── not-found.tsx             # 404 page
│   │   ├── globals.css               # Global styles
│   │   ├── blog/                     # Blog section
│   │   │   ├── page.tsx              # Blog listing page (/blog)
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Blog post detail page (/blog/{slug})
│   │   └── tips/                     # Tips section
│   │       ├── page.tsx              # Tips listing page (/tips)
│   │       └── [slug]/
│   │           └── page.tsx          # Tip detail page (/tips/{slug})
│   ├── components/                   # Reusable React components
│   │   ├── blog/                     # Blog-specific components
│   │   │   └── BlogCard.tsx          # Blog post preview card
│   │   ├── home/                     # Home page components
│   │   │   ├── Hero.tsx              # Hero section with intro text & CTAs
│   │   │   └── AboutCard.tsx         # Author info card
│   │   ├── tips/                     # Tips-specific components
│   │   │   ├── CategoryBadge.tsx     # Badge showing tip category
│   │   │   ├── CategoryFilter.tsx    # Filter buttons for categories
│   │   │   ├── TipCard.tsx           # Tip preview card
│   │   │   ├── TipDetail.tsx         # Full tip article render
│   │   │   └── TipsGrid.tsx          # Grid layout with filtering
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx            # Navigation header
│   │   │   └── Footer.tsx            # Footer with links
│   │   └── ui/                       # Reusable UI utilities
│   │       ├── CodeBlock.tsx         # Syntax-highlighted code block
│   │       └── Tag.tsx               # Small tag badge
│   ├── content/                      # Content data files
│   │   ├── blog/                     # Blog post content
│   │   │   ├── index.ts              # Barrel export of all posts
│   │   │   ├── people-person-show.ts # Individual blog post
│   │   │   └── elevenlabs-elevenpapps-immersive-show.ts
│   │   └── tips/                     # Tip content
│   │       ├── index.ts              # Barrel export of all tips
│   │       ├── debugging-*.ts        # Debugging category tips
│   │       ├── editor-*.ts           # Editor category tips
│   │       └── qa-workflow-*.ts      # QA workflow category tips
│   └── lib/                          # Utility functions and types
│       ├── types.ts                  # Tip and Category type definitions
│       ├── blog-types.ts             # BlogPost type definition
│       ├── tips.ts                   # Tip query functions
│       └── blog.ts                   # Blog post query functions
├── public/                           # Static assets (images, fonts, etc.)
│   ├── og-image.png                  # Open Graph default image
│   ├── tommy-lahitte-avatar-480.webp # Profile image
│   └── [other assets]
├── .next/                            # Next.js build output (generated, not committed)
├── out/                              # Static export output (generated, not committed)
├── .planning/                        # Planning and documentation
│   └── codebase/                     # Codebase analysis documents
├── node_modules/                     # Dependencies (not committed)
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS configuration (for TailwindCSS)
├── tailwind.config.ts                # TailwindCSS configuration
├── package.json                      # Project metadata and dependencies
├── package-lock.json                 # Locked dependency versions
└── README.md                         # Project documentation
```

## Directory Purposes

**src/app/**
- Purpose: Route definitions and page layouts using Next.js 13+ App Router
- Contains: Page components, layout wrappers, dynamic route handlers
- Key pattern: Nested directory structure maps to URL routes
- Dynamic segments: `[slug]` directories enable dynamic routing with `params`

**src/components/**
- Purpose: Reusable React components organized by feature/domain
- Contains: Presentational components and client-side interactive components
- Naming: Each component is a `.tsx` file with PascalCase name matching export
- Subdirectories: Grouped by feature domain (blog, tips, home, layout, ui)

**src/content/**
- Purpose: Authored content stored as TypeScript objects (CMS-free approach)
- Contains: Tip definitions, blog post definitions
- Pattern: Each content item is a separate file exporting a typed object
- Discovery: `index.ts` files import and re-export all content in that section
- Advantages: Version control, no database, builds content into static output

**src/lib/**
- Purpose: Shared utility functions and type definitions
- Contains:
  - Type definitions (`types.ts`, `blog-types.ts`)
  - Query/accessor functions (`tips.ts`, `blog.ts`)
- Pattern: Functions accept no parameters and return or find data
- Export style: Named exports for individual functions

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Home page entry point (/)
- `src/app/tips/page.tsx`: Tips listing entry point (/tips)
- `src/app/tips/[slug]/page.tsx`: Dynamic tip detail route
- `src/app/blog/page.tsx`: Blog listing entry point (/blog)
- `src/app/blog/[slug]/page.tsx`: Dynamic blog post detail route
- `src/app/layout.tsx`: Root layout wrapper for all pages
- `src/app/sitemap.ts`: Sitemap generation (XML sitemap)

**Configuration:**
- `tsconfig.json`: TypeScript compiler options, path aliases (@/* → src/*)
- `next.config.ts`: Next.js configuration
- `tailwind.config.ts`: TailwindCSS theme, plugins, content paths
- `postcss.config.mjs`: PostCSS plugin configuration
- `package.json`: Dependencies, scripts, project metadata

**Core Logic:**
- `src/lib/tips.ts`: `getAllTips()`, `getTipBySlug()`, `getTipsByCategory()`
- `src/lib/blog.ts`: `getAllPosts()`, `getPostBySlug()`
- `src/lib/types.ts`: Tip, TipContent, Category interfaces
- `src/lib/blog-types.ts`: BlogPost, BlogBlock interfaces

**Testing:**
- No test files present - testing not configured

**Global Styling:**
- `src/app/globals.css`: Global CSS including custom animations
- Tailwind directives: `@tailwind base`, `@tailwind components`, `@tailwind utilities`

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `TipCard.tsx`, `CategoryBadge.tsx`)
- Utilities/Functions: camelCase (e.g., `tips.ts`, `blog.ts`)
- Content files: kebab-case with descriptive prefix (e.g., `debugging-visual-logger.ts`, `editor-output-log-filters.ts`)
- Type definition files: kebab-case (e.g., `blog-types.ts`)

**Directories:**
- All lowercase (e.g., `components/`, `content/`, `lib/`, `app/`)
- Route segments: kebab-case (e.g., `[slug]` for dynamic routes)

**Exports:**
- Components: Default export (e.g., `export default function TipCard()`)
- Utility functions: Named exports (e.g., `export function getAllTips()`)
- Content: Exported as `tip` or `post` constant (e.g., `export const tip: Tip = {...}`)

**Types:**
- Interfaces: PascalCase, no prefix (e.g., `Tip`, `BlogPost`, `TipContent`)
- Type unions: Descriptive PascalCase (e.g., `Category`, `BlogBlock`)

## Where to Add New Code

**New Tip:**
- Content: Create `src/content/tips/{slug}.ts` with `tip: Tip = {...}` export
- Type definition: Uses existing `Tip` interface from `src/lib/types.ts`
- Discovery: Add import and reference in `src/content/tips/index.ts` to `allTips` array
- Display: Automatically appears on `/tips` page and generates static `/tips/{slug}/` route

**New Blog Post:**
- Content: Create `src/content/blog/{slug}.ts` with `post: BlogPost = {...}` export
- Type definition: Uses existing `BlogPost` interface from `src/lib/blog-types.ts`
- Discovery: Add import and reference in `src/content/blog/index.ts` to `allPosts` array
- Display: Automatically appears on `/blog` page and generates static `/blog/{slug}/` route

**New Component:**
- Location: `src/components/{feature}/{ComponentName}.tsx`
- Create subdirectory under `components/` if new feature domain
- Use Client Component (`'use client'`) only if needs `useSearchParams()`, `useState()`, or event handlers
- Default to Server Components where possible

**New Page/Route:**
- Location: `src/app/{route-segment}/page.tsx`
- Use dynamic routes with `[slug]` directories for content
- Implement `generateStaticParams()` for build-time static generation
- Implement `generateMetadata()` for dynamic SEO per route

**Utility Functions:**
- Location: `src/lib/{domain}.ts` (e.g., `src/lib/tips.ts`)
- Use named exports
- Keep functions pure (no side effects)
- Return or find data from content modules

**Type Definitions:**
- New content types: Add to `src/lib/types.ts` or create new file like `src/lib/types-{domain}.ts`
- Discriminated unions: Use `type` field for switch statement rendering (see `TipContent`, `BlogBlock`)

## Special Directories

**src/content/**
- Purpose: Content storage (CMS-like approach without database)
- Generated: No (manually authored)
- Committed: Yes (version control of all content)
- Pattern: Each tip/post is a TypeScript file with typed object
- Discovery: Barrel exports in `index.ts` files aggregate all content

**public/**
- Purpose: Static assets served directly by Next.js
- Generated: No (static files)
- Committed: Yes
- Contents: Images, favicons, etc.
- Serve from: Root URL path (e.g., `/tommy-lahitte-avatar-480.webp` maps to `public/tommy-lahitte-avatar-480.webp`)

**.next/**
- Purpose: Next.js build output directory
- Generated: Yes (by `next build`)
- Committed: No (in .gitignore)
- Contains: Compiled JavaScript, optimized pages, ISR cache

**out/**
- Purpose: Static HTML export output directory
- Generated: Yes (by `next build && next export`, or `next build` with `output: 'export'`)
- Committed: No (in .gitignore)
- Contains: Pre-rendered HTML files for all routes

**node_modules/**
- Purpose: Installed npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No (in .gitignore)
- Lock file: `package-lock.json` (committed for reproducible installs)

---

*Structure analysis: 2026-03-15*
