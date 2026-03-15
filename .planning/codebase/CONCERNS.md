# Codebase Concerns

**Analysis Date:** 2026-03-15

## Tech Debt

**Hardcoded Base URL:**
- Issue: The base URL `https://tommylahitte.com` is hardcoded in multiple places instead of being centralized
- Files: `src/app/sitemap.ts` (line 7), `src/app/tips/[slug]/page.tsx` (line 22), `src/app/blog/[slug]/page.tsx` (line 28, 33)
- Impact: Difficult to maintain across environments. If domain changes, requires updates in multiple files. No environment-aware configuration.
- Fix approach: Extract base URL to environment variable or centralized constant in `src/lib/config.ts`

**Duplicated Date Formatting:**
- Issue: Date formatting logic repeated across multiple components using `new Date().toLocaleDateString()` with different locale parameters
- Files: `src/components/blog/BlogCard.tsx` (line 12), `src/components/tips/TipDetail.tsx` (line 75), `src/app/blog/[slug]/page.tsx` (line 81), `src/components/tips/TipCard.tsx` (line 22)
- Impact: Inconsistent date formatting across the application. Hard to maintain unified date format strategy.
- Fix approach: Create utility function `formatDate(date: string, locale?: string)` in `src/lib/utils.ts`

**Hardcoded Locale Strings:**
- Issue: Date locale strings ('en-US', 'en-GB') are scattered throughout components
- Files: `src/components/tips/TipDetail.tsx`, `src/components/tips/TipCard.tsx`, `src/components/blog/BlogCard.tsx`, `src/app/blog/[slug]/page.tsx`
- Impact: Inconsistent localization (some use 'en-US', others 'en-GB'). Difficult to support multiple locales.
- Fix approach: Define locale constants in a centralized config and use them consistently

**Large Component File:**
- Issue: `src/components/home/AboutCard.tsx` is 191 lines, which exceeds typical component size guidelines
- Files: `src/components/home/AboutCard.tsx`
- Impact: Harder to test and maintain. Could be split into smaller, more focused components.
- Fix approach: Consider breaking into sub-components for distinct sections

## Known Bugs

**Invalid Date Handling:**
- Symptoms: Potential silent failures if `publishedAt` or `date` fields contain invalid date strings
- Files: `src/lib/tips.ts` (line 6), `src/components/tips/TipCard.tsx` (line 22), `src/app/blog/[slug]/page.tsx` (line 81)
- Trigger: If a tip or blog post has malformed date strings (e.g., "2024-13-45"), `new Date()` creates an Invalid Date object
- Current behavior: Invalid dates silently fail in toLocaleDateString() without throwing errors
- Workaround: None currently in place. Dates render as "Invalid Date" string.
- Fix approach: Add validation function `isValidDateString()` and use it during content loading

**Missing Fallback for renderBlock in Blog Posts:**
- Symptoms: Blog post content with unknown block types renders as nothing (no error thrown)
- Files: `src/app/blog/[slug]/page.tsx` (line 48-71)
- Trigger: If a blog post content block has type other than 'paragraph', 'heading', 'list', it silently skips rendering
- Current behavior: Function returns `undefined` for unknown types
- Workaround: None. Content is lost silently.
- Fix approach: Return a fallback UI or warning message for unknown block types

**XSS Risk in Schema JSON:**
- Symptoms: JSON.stringify() output injected directly into HTML via dangerouslySetInnerHTML without sanitization
- Files: `src/app/layout.tsx` (line 73), `src/app/tips/[slug]/page.tsx` (line 71), `src/app/blog/[slug]/page.tsx` (line 109-111)
- Trigger: If tip/post data contains unescaped special characters or JSON structures with malicious content
- Current risk: Low (data is statically imported, not from user input), but pattern is unsafe if content source changes
- Fix approach: Use a dedicated library like `next-safe-json` or validate that tip/post content is safe before stringifying

## Security Considerations

**Email Address Exposed:**
- Risk: Email address `tlahitte@gmail.com` is hardcoded in footer component and directly clickable
- Files: `src/components/layout/Footer.tsx` (line 29)
- Current mitigation: Uses `mailto:` link, so email is somewhat obfuscated in rendering
- Recommendations: Consider using a contact form instead, or obfuscate email display client-side

**External Links Not Protected:**
- Risk: Multiple external links in Footer and content cards use target="_blank" with rel="noopener noreferrer"
- Files: `src/components/layout/Footer.tsx` (lines 7-80), `src/components/blog/BlogCard.tsx` (line 52-60)
- Current mitigation: Proper `rel` attributes are used (`noopener noreferrer`)
- Recommendations: Consistently verify all external links have proper security attributes. Current implementation is secure.

**No Content Security Policy:**
- Risk: No CSP headers configured for the application
- Files: N/A (configuration issue)
- Current mitigation: Static export prevents dynamic script injection
- Recommendations: Add CSP meta tag in `src/app/layout.tsx` to restrict resource loading

## Performance Bottlenecks

**Client-Side Category Filtering with Suspense:**
- Problem: Category filter on `/tips` page is a client component that filters data client-side
- Files: `src/components/tips/TipsGrid.tsx`, `src/components/tips/CategoryFilter.tsx`
- Cause: Uses `useSearchParams()` and `useRouter()` requiring client-side hydration
- Current impact: Requires JavaScript to load and interactive filtering doesn't work without JS
- Improvement path: Consider Server Components with searchParams to pre-render filtered views, eliminating need for client-side filtering

**Date Parsing in Sorting:**
- Problem: Tips are sorted by creating new Date objects on every sort, every time getAllTips() is called
- Files: `src/lib/tips.ts` (line 5-7)
- Cause: No memoization or caching of sorted tips
- Current impact: Repeated Array.sort() with date comparisons on every page load
- Improvement path: Pre-sort tips array during build time or cache the sorted result

**Repeated Image Dimensions Processing:**
- Problem: Image sizes calculated during metadata generation but also needed for rendering
- Files: `src/app/blog/[slug]/page.tsx` (line 134-135)
- Cause: Static dimensions (1200x670) are hardcoded in multiple places
- Current impact: Minor. Image renders with width/height hints properly set.
- Improvement path: Define image dimensions as constants in `src/lib/config.ts`

## Fragile Areas

**Slug-Based Routing Without Validation:**
- Files: `src/app/tips/[slug]/page.tsx`, `src/app/blog/[slug]/page.tsx`
- Why fragile: If a slug doesn't exist, the page renders notFound(). No validation that slug format is valid before querying.
- Safe modification:
  1. Validate slug format (alphanumeric, hyphens only) before lookup
  2. Add logging when notFound() is called to detect broken links
  3. Use generateStaticParams() correctly (already implemented)
- Test coverage: Tests should verify behavior for non-existent slugs and invalid slug formats

**Category Filter Type Coercion:**
- Files: `src/components/tips/TipsGrid.tsx` (line 15-16)
- Why fragile: `isValidCategory` uses type predicate but doesn't deeply validate. If new categories are added to types but not to VALID_CATEGORIES array, silently returns incorrect type
- Safe modification:
  1. Make VALID_CATEGORIES a const assertion to ensure it matches the Category type
  2. Add runtime validation that throws during build if mismatch detected
  3. Use TypeScript const satisfies to enforce alignment
- Test coverage: Test all valid categories explicitly filter correctly

**Search Params Handling:**
- Files: `src/components/tips/CategoryFilter.tsx` (line 40-49)
- Why fragile: URLSearchParams construction could create malformed URLs if `value` contains special characters not properly encoded
- Safe modification:
  1. Use URL constructor instead of manual string concatenation
  2. Validate category parameter before pushing to router
  3. Add safeguards against null/undefined values
- Test coverage: Test with various category values, including edge cases

**Static Content Loading Without Type Validation:**
- Files: `src/content/tips/index.ts`, `src/content/blog/index.ts`
- Why fragile: Content is imported as unvalidated objects. No schema validation at import time.
- Safe modification:
  1. Add Zod or TypeScript runtime validation in `getAllTips()` and `getAllPosts()`
  2. Add try-catch around Date parsing in content files
  3. Validate required fields exist before using
- Test coverage: Tests should verify all content follows expected schema

## Scaling Limits

**Static Content in Memory:**
- Current capacity: Currently holds 20 tips and 2 blog posts
- Limit: If content grows to 500+ items, the entire array is loaded in memory on every page load
- Scaling path:
  1. For < 100 items: current approach is fine
  2. For > 100 items: Consider pagination or lazy loading
  3. For > 1000 items: Implement database with incremental loading
  4. Alternative: Use Next.js ISR with granular revalidation per content item

**Single-Page Build Time:**
- Current capacity: Static generation works well for current site size
- Limit: With many content items, `generateStaticParams()` could slow build time
- Scaling path: Current implementation uses parallel generation, which is optimal. If build time becomes issue, consider:
  1. On-demand ISR for infrequently accessed pages
  2. Separate build stages for different content types
  3. Incremental Static Regeneration (ISR) for tips/blog pages

**Build Output Size:**
- Current capacity: Small footprint with minimal dependencies
- Limit: Static export generates an HTML file per page. With 500+ items, this could exceed deployment limits
- Scaling path: Current Next.js static export is efficient. If needed, consider:
  1. Compression on hosting platform
  2. Splitting into multiple deployments
  3. CDN with edge optimization

## Dependencies at Risk

**No Runtime Data Validation:**
- Risk: Untyped content data could fail at runtime if schema changes
- Impact: Silent failures in rendering, particularly with date parsing and object access
- Migration plan: Add Zod schema validation layer for content at import time

**Next.js Static Export Constraints:**
- Risk: Using `output: 'export'` disables server-side features like dynamic routes with parameters at runtime
- Impact: Cannot add server-side features without refactoring build configuration
- Migration plan: If server-side features needed (e.g., dynamic 404 pages), switch to standard Next.js deployment and handle routes differently

## Test Coverage Gaps

**No Tests for Content Validation:**
- What's not tested: Invalid dates, missing required fields, malformed content blocks
- Files: `src/lib/tips.ts`, `src/lib/blog.ts`, `src/content/*/index.ts`
- Risk: Corrupted content silently renders broken pages
- Priority: High (directly affects user experience)

**No Tests for Routing Edge Cases:**
- What's not tested: Non-existent slugs, URL injection attempts, special characters in slugs
- Files: `src/app/tips/[slug]/page.tsx`, `src/app/blog/[slug]/page.tsx`
- Risk: Broken links don't trigger monitoring or reporting
- Priority: High (affects site reliability)

**No Tests for Category Filter Logic:**
- What's not tested: Invalid category values in query params, type validation
- Files: `src/components/tips/TipsGrid.tsx`, `src/components/tips/CategoryFilter.tsx`
- Risk: Filter silently ignores invalid categories without indication to user
- Priority: Medium (impacts usability)

**No Tests for Date Formatting:**
- What's not tested: Invalid date strings, locale handling, timezone edge cases
- Files: Multiple components using date formatting
- Risk: Invalid dates display as "Invalid Date" without proper fallback
- Priority: Medium (impacts presentation)

**No End-to-End Tests:**
- What's not tested: Full user workflows (browse tips, filter, navigate to detail page)
- Files: All page components and navigation
- Risk: Regressions in user flows undetected until production
- Priority: High (critical for site reliability)

---

*Concerns audit: 2026-03-15*
