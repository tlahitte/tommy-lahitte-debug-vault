# Pitfalls Research

**Domain:** Notion-as-CMS + Next.js 15 portfolio with Tailwind visual rebrand
**Researched:** 2026-03-15
**Confidence:** HIGH (Notion image expiry, rate limits, webhook security verified via official docs and multiple community sources; Tailwind rebrand patterns verified via current docs)

---

## Critical Pitfalls

### Pitfall 1: Notion Image URLs Expire After 1 Hour

**What goes wrong:**
Notion hosts uploaded images on AWS S3 with presigned, time-limited URLs. Every image block returned by the Notion API includes a URL that is valid for approximately one hour. If you store that URL in a statically generated page (SSG/SSR), images will render as 403 Forbidden errors for any visitor arriving after the URL expires. The site "looks fine" immediately post-deploy and breaks invisibly afterward.

**Why it happens:**
The Notion documentation explicitly states: "Don't cache or statically reference these URLs." Developers miss this warning when skimming integration guides, or assume SSG builds happen frequently enough that freshness is maintained. With Netlify's trigger-on-publish model (rebuild takes minutes, not seconds), and deploys happening only when content changes, a page deployed at 9am will have broken images by 10am.

This project uses SSG (`output: 'export'` constraint from PROJECT.md). That means no runtime re-fetch — all image URLs are baked in at build time and go stale.

**How to avoid:**
Do not use Notion-hosted image URLs directly in rendered HTML. Choose one strategy at build time:

- **Preferred for this project:** Download images during the Netlify build and serve them as static assets from the repo or Netlify's CDN. Use the Notion block ID as the filename (block IDs are stable even as URLs rotate). This requires no external service.
- **Alternative:** Upload images to Cloudinary during the build using the `upload-notion-images-to-cloudinary` npm package. Gives a permanent CDN URL. Adds a Cloudinary dependency.
- **Do not use:** An API route proxy — this project uses static export, so API routes are not available at runtime.

Implement image download as a pre-build script (`scripts/fetch-notion-images.ts`) that runs before `next build` in the Netlify build command.

**Warning signs:**
- Images display correctly immediately after a Netlify deploy, then break within an hour
- Chrome DevTools shows 403 Forbidden on `amazonaws.com` image URLs
- Notion image URLs in your built HTML contain `X-Amz-Expires` query parameters

**Phase to address:**
Notion CMS integration phase — must be solved before any content with images is deployed. Do not defer to a "cleanup" phase.

---

### Pitfall 2: Next.js Build-Time Rate Limit Bursts (3 req/sec per integration)

**What goes wrong:**
The Notion API enforces an average of 3 requests per second per integration (verified via official docs). Next.js 15 with `generateStaticParams` runs build workers in parallel by default. When building a site with 20+ tips and 10+ blog posts, each page requiring multiple API calls (database query + block fetch + recursive child fetch), parallel workers can easily burst past the limit. The build fails mid-run with HTTP 429 errors. Because Next.js does not retry by default, the entire build fails.

**Why it happens:**
Developers write correct fetch logic, test it against a single page, and only discover the burst problem at full build scale. The issue is invisible in development where you typically regenerate one page at a time.

This project currently has 20 tips + 2 blog posts. Adding a "Projects" content type and growing the blog will push the request count high enough for this to matter, especially since projects will likely have more blocks (process documentation = more content depth).

**How to avoid:**
Implement request throttling in the Notion data access layer (`src/lib/notion.ts`) before it becomes a problem:

```typescript
// Enforce 300ms minimum between requests to stay safely under 3 req/sec
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
let lastRequestTime = 0;
async function notionRequest<T>(fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const gap = now - lastRequestTime;
  if (gap < 300) await sleep(300 - gap);
  lastRequestTime = Date.now();
  return fn();
}
```

Alternatively, configure Next.js build to limit parallelism in `next.config.ts`:
```typescript
experimental: { workerThreads: false, cpus: 1 }
```
This slows builds but prevents burst failures. Use the throttle approach first; fall back to CPU limiting if needed.

Implement retry logic with exponential backoff that respects the `Retry-After` header in 429 responses.

**Warning signs:**
- Build succeeds on a small content set, fails randomly on larger sets
- Build logs show `APIResponseError: rate_limited` or HTTP 429 errors
- Failures are non-deterministic (sometimes works, sometimes doesn't)

**Phase to address:**
Notion CMS integration phase — build the throttle wrapper into the initial data access layer, not as a later fix.

---

### Pitfall 3: Incomplete Block Type Coverage Causes Silent Content Loss

**What goes wrong:**
The Notion API returns dozens of block types: `paragraph`, `heading_1/2/3`, `bulleted_list_item`, `numbered_list_item`, `to_do`, `toggle`, `code`, `image`, `video`, `embed`, `divider`, `quote`, `callout`, `table`, `table_row`, `column_list`, `column`, `child_page`, `bookmark`, `link_preview`, and more. When the block renderer encounters an unsupported type, it typically returns `undefined` or `null` and silently drops the content. A complete blog post in Notion can render as a fragment on the site with no error thrown.

This project already has a documented bug for this pattern in CONCERNS.md: "Missing Fallback for renderBlock in Blog Posts — Function returns undefined for unknown types."

**Why it happens:**
Initial implementations typically handle the four or five most common block types seen in the developer's own test content. As Tommy writes real content in Notion using features he uses naturally (callouts for tips, toggle blocks for process steps, tables for comparisons), the renderer silently skips those blocks.

**How to avoid:**
Build the block renderer exhaustively from the start, not incrementally. Use the `@notionhq/client` TypeScript types to ensure every block type variant is handled — TypeScript's exhaustive switch will surface any missing cases at compile time:

```typescript
function renderBlock(block: BlockObjectResponse): React.ReactNode {
  switch (block.type) {
    case 'paragraph': return <p>...</p>;
    case 'heading_1': return <h1>...</h1>;
    // ... all supported types
    default:
      // Exhaustiveness check
      const _exhaustive: never = block;
      // Log unsupported type in dev, render visible warning
      console.warn(`Unsupported block type: ${(block as any).type}`);
      return process.env.NODE_ENV === 'development'
        ? <div style={{border:'1px solid red'}}>Unsupported: {(block as any).type}</div>
        : null;
  }
}
```

Priority block types to implement for this project's content:
- `callout` (tips naturally use these)
- `toggle` (process documentation)
- `image` (projects require many images)
- `code` (technical articles)
- `table` / `table_row` (comparisons)
- `divider`, `quote`, `bulleted_list_item`, `numbered_list_item`
- `column_list` / `column` (layout for project pages)

**Warning signs:**
- Content in Notion renders differently than on the site
- Sections of posts appear missing with no error in the browser
- Build completes with no errors but published content is incomplete

**Phase to address:**
Notion CMS integration phase — define the full block type matrix before writing any real content. Add dev-mode visual warnings for unsupported blocks that surface gaps immediately.

---

### Pitfall 4: Recursive Child Block Fetching Multiplies API Requests

**What goes wrong:**
The Notion API returns only the first level of block children per request. Blocks with `has_children: true` (toggle blocks, columns, synced blocks, nested lists) require separate API calls to fetch their children. A page with 10 toggle blocks requires 11 API calls minimum. A project page documenting a multi-step process with nested toggles could require 30–50 API calls. Combined with the 3 req/sec rate limit, this means a single complex page could take 10–15 seconds to fetch at build time — and multiple such pages will exhaust the rate limit.

**Why it happens:**
The Notion API is designed breadth-first by intent. Developers test with simple pages, the recursive case is only discovered when real content is structured deeply.

**How to avoid:**
Implement batched, parallel recursive fetching using `Promise.all` with rate-limit awareness:

```typescript
async function fetchBlocksRecursively(blockId: string): Promise<Block[]> {
  const blocks = await fetchAllBlockChildren(blockId); // handles pagination
  const childFetches = blocks
    .filter(b => b.has_children)
    .map(b => fetchBlocksRecursively(b.id));
  // Rate-limit: process in batches of 3, not all at once
  const children = await Promise.all(childFetches);
  // Merge children back into parent blocks
  return mergeChildBlocks(blocks, children);
}
```

Also handle pagination: the API returns max 100 blocks per request. Long pages require cursor-based pagination loops.

For this project, avoid deeply nested toggle structures in Notion content as a content authoring guideline. Document this in a `CONTENT_GUIDE.md` for Tommy.

**Warning signs:**
- Build time grows non-linearly as page count increases
- Pages with toggle blocks or column layouts are missing nested content
- Rate limit errors appear only on complex pages, not simple ones

**Phase to address:**
Notion CMS integration phase, specifically when implementing the data fetching layer for Projects (which will have the deepest nesting).

---

### Pitfall 5: Netlify Build Hook Exposed Without Signature Verification

**What goes wrong:**
Netlify build hooks are plain HTTPS URLs that trigger a rebuild when POSTed to. If the URL is known to anyone (from git history, a screenshot, a leaked `.env`), they can trigger unlimited Netlify builds, exhausting build minutes and potentially incurring costs. A bot that finds the URL will spam it.

Additionally, without Notion's HMAC-SHA256 webhook signature verification, the rebuild endpoint cannot distinguish a legitimate Notion event from a spoofed request.

**Why it happens:**
Build hooks feel like "internal infrastructure" so developers don't treat them as secrets. The Netlify hook URL is often committed to a `.env.example`, shared in documentation, or visible in Netlify's dashboard without access controls.

**How to avoid:**
For this project's SSG + Netlify architecture, the rebuild trigger is a Netlify build hook URL. Protect it:

1. Store the Netlify build hook URL only in Netlify's environment variables, never in git.
2. If routing via a middleware function (Netlify Function): verify Notion's `X-Notion-Signature` HMAC-SHA256 header before forwarding to the build hook. Use `crypto.timingSafeEqual` — not `===` — for comparison to prevent timing attacks.
3. Add rate limiting to the middleware function: reject more than 5 rebuild requests per 10 minutes from the same source.
4. Use `INCOMING_HOOK_BODY` in the Netlify build command to conditionally cancel builds for irrelevant Notion events (e.g., comment changes, non-published status).

Direct Notion → Netlify webhook (no middleware): acceptable for a personal portfolio where the attack surface is low. But do not commit the Netlify hook URL to git.

**Warning signs:**
- Netlify build history shows unexpected builds at odd hours
- Build minutes consumed faster than content changes explain
- Netlify Function logs show requests from unknown IPs

**Phase to address:**
Webhook pipeline phase — security must be built in from the start, not added later.

---

### Pitfall 6: SSG + Static Export Incompatibility With ISR

**What goes wrong:**
This project uses `output: 'export'` (confirmed in PROJECT.md constraints: "Garder l'approche SSG"). Next.js static export is incompatible with ISR (`revalidate`, `revalidatePath`, `revalidateTag`). Any documentation suggesting "use ISR + Notion webhooks for on-demand revalidation" does not apply here. The only way to update content is a full Netlify rebuild triggered by the webhook.

If the Notion webhook is not configured, or if Tommy publishes a page change without triggering a webhook (e.g., editing a draft that isn't hooked up), the site will show stale content indefinitely with no visual indication.

**Why it happens:**
ISR is the dominant recommendation for Notion + Next.js integrations. Most tutorials target Vercel-hosted Next.js apps. The static export constraint is specific to this project's Netlify/cost architecture and makes those tutorials inapplicable.

**How to avoid:**
Accept the tradeoff explicitly: SSG means content is as fresh as the last build. Make this operationally obvious:
- Configure Notion's automation to trigger the webhook on "Page published" status change (not on every edit).
- Add a "Last rebuilt" timestamp to the site footer (populated at build time via environment variable) so Tommy can verify freshness.
- Document the publish workflow: "Set page to Published in Notion → Netlify rebuild triggers → content live in ~2 min."
- Do not attempt to use `revalidate` or `unstable_cache` expecting ISR behavior on Netlify static export.

**Warning signs:**
- Site shows content that Tommy already updated in Notion
- `next.config.ts` has `output: 'export'` but code uses `revalidate` — this silently has no effect

**Phase to address:**
Webhook pipeline phase — explicit documentation of the publish workflow prevents operational confusion.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline Notion image URLs directly in HTML | Zero extra build steps | Images break hourly, 403 errors | Never |
| Skip pagination on block fetch (assume <100 blocks) | Simpler code | Long pages silently truncated | Never — paginate from the start |
| Use `==` instead of `crypto.timingSafeEqual` for webhook signature | Slightly simpler code | Timing attack vulnerability on signature verification | Never in any production context |
| Single-threaded Notion fetch (no throttle) | Simpler code | Random build failures as content grows | Only acceptable during initial prototype with <5 pages |
| Hardcode Tailwind color values in components (`bg-zinc-900`) instead of semantic tokens (`bg-surface`) | Faster initial build | Full-site color change requires touching every component | Only during initial prototype — extract tokens before any component reuse |
| Skip block type exhaustiveness (return null for unknown) | Less upfront code | Silent content loss that's invisible until Tommy notices | Never on content-heavy pages — always add dev-mode warning |
| Commit Netlify build hook URL to `.env.example` | Developer convenience | Anyone with repo access can trigger unlimited builds | Never |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Notion API → image blocks | Use `block.image.file.url` directly in `<img>` or `<Image>` | Download image at build time using block ID as filename; serve from local `/public/images/notion/` |
| Notion API → rich text | Render only `plain_text` and miss annotations | Map the `annotations` object (bold, italic, code, strikethrough, color) to HTML elements per block |
| Notion API → database query | Fetch all pages in one call and assume completeness | Always implement cursor pagination loop — databases return max 100 rows |
| Notion → Netlify webhook | Pass raw Netlify hook URL to Notion directly | Add middleware (Netlify Function) to verify Notion's HMAC signature before forwarding |
| Tailwind + rebrand | Change `gray` to `zinc` globally then hunt down overrides | Define semantic token layer (`surface`, `text-primary`, `accent`) in `tailwind.config.ts` first; map all grays to tokens before touching components |
| Tailwind dark mode removal | Delete all `dark:` classes manually | Use project-wide search for `dark:` prefix; remove the `darkMode` key from config to catch stragglers at compile time |
| Next.js `<Image>` + Notion | Pass Notion S3 URL to `src` prop | Download to local path or use `remotePatterns` with a proxy that re-fetches fresh URLs — never `remotePatterns: 'amazonaws.com'` with a cached URL |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Fetching all blocks sequentially (no parallelism) | Build time grows linearly with page count | Parallelize sibling block fetches with `Promise.all`, respect rate limit with batching | At ~15 pages with moderate content depth |
| No build-time image caching (re-downloading on every build) | Netlify build minutes spike; same images downloaded repeatedly | Cache images in git (small site) or use Netlify's build cache for the images directory | Immediately — Netlify charges per build minute |
| Full Tailwind purge misconfiguration after adding Notion content | Dynamically constructed Tailwind classes disappear in production | Never construct class names via string interpolation; use full class names in conditional expressions | First production deploy after using dynamic content-driven styling |
| Storing Notion page content in a global in-memory object during build | Works for small content, silently breaks for large databases | Use Next.js `cache()` or per-page fetch isolation | At ~50+ pages or parallel build workers |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Committing `NOTION_API_KEY` to git history | API key leaked, attacker can read/modify all content in workspace | Use Netlify environment variables; add `*.env*` to `.gitignore`; rotate key immediately if committed |
| Committing Netlify build hook URL to git | Unlimited rebuild spam, build minutes exhausted | Store only in Netlify dashboard; reference via env var `NETLIFY_BUILD_HOOK_URL` in scripts |
| JSON.stringify(notionContent) directly into dangerouslySetInnerHTML for Schema.org | XSS if Notion content contains `</script>` sequences | This project already has this bug (CONCERNS.md line 49). When Notion becomes the content source, the risk escalates significantly — sanitize or use a dedicated JSON-LD serializer |
| Notion webhook endpoint without signature verification | Anyone can trigger rebuilds or inject fake events | Always verify `X-Notion-Signature` HMAC-SHA256 in the receiving function |
| Logging full Notion API responses in production | API keys, page IDs, and internal content metadata leak to log aggregators | Log only error types and counts, never response bodies, in production |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No visual feedback for "content is being rebuilt" | Tommy publishes in Notion, visits site, sees old content, thinks something broke | Add a build status badge or "last updated" timestamp to the site; document the ~2 min rebuild delay |
| Broken image layout during image loading (no dimensions specified) | Layout shift as images pop in; CLS score drops | Always specify `width` and `height` on `<Image>` components; use `aspect-ratio` CSS on containers |
| Notion formatting artifacts in rendered content (e.g., stray `**` or `_` from rich text) | Ugly content artifacts visible to portfolio visitors | Test renderer against real Notion content, not toy content; include edge cases like bold-in-code |
| Industrial/maker aesthetic inconsistently applied during rebrand | Site feels mixed — some pages feel rebranded, others still "AI-generic" | Define a component inventory before rebrand; use Storybook or a simple `/design` route to audit all components at once |
| SEO metadata not updated for new Notion-sourced content | New projects and posts don't appear in search results correctly | Map Notion page properties (`title`, `description`, `cover`) to Next.js `generateMetadata` from day one; don't leave metadata as TODOs |

---

## "Looks Done But Isn't" Checklist

- [ ] **Notion image handling:** Images display in dev and immediately post-deploy — verify they still load 2 hours later. Check for `amazonaws.com` URLs in built HTML.
- [ ] **Block type coverage:** Blog post renders completely — test with a Notion page that uses callout, toggle, table, and code blocks, not just paragraphs.
- [ ] **Pagination:** All database items appear — verify with a database that has more than 100 rows (or test pagination logic with a mock).
- [ ] **Rate limit resilience:** Build succeeds with full content set — run a production build locally against the real Notion API with all pages populated.
- [ ] **Webhook security:** Rebuild endpoint rejects requests without valid Notion signature — test with `curl -X POST` without the header; should return 401.
- [ ] **Stale content pipeline:** Notion → Netlify pipeline actually fires — make a real content edit, verify rebuild triggers and content updates within 3 minutes.
- [ ] **Design token completeness:** No hardcoded color values in components — search for `bg-gray`, `text-gray`, `bg-white`, `bg-black` after rebrand; all should be gone.
- [ ] **SEO metadata for new content types:** Projects page and individual project pages have correct `<title>`, `<meta description>`, and Open Graph tags sourced from Notion properties.
- [ ] **Schema.org XSS fix:** JSON-LD in `<script type="application/ld+json">` is sanitized — test with a Notion page containing `</script>` in the title or description.
- [ ] **Date field validation:** Notion date properties with missing or malformed values don't render as "Invalid Date" — test with an unpublished draft that has no `publishedAt`.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Deployed site with expiring image URLs | HIGH | Add image download script; trigger full Netlify rebuild; all images fixed after next deploy |
| Build failing due to rate limits | MEDIUM | Add throttle wrapper to `src/lib/notion.ts`; re-trigger Netlify build |
| Content silently missing (unsupported block types) | MEDIUM | Identify missing block types from Notion content; add renderer cases; rebuild |
| Netlify build hook URL leaked | MEDIUM | Delete build hook in Netlify dashboard; create new one; update all references |
| Notion API key leaked to git | HIGH | Revoke in Notion integration settings; generate new key; rotate in Netlify env vars; rewrite git history if in recent commits |
| Design tokens not extracted (rebrand requires touching every component) | HIGH | Extract tokens to `tailwind.config.ts` first; global search-and-replace class names; visual regression test per page |
| XSS via unsanitized Schema.org JSON-LD | MEDIUM | Sanitize `<`, `>`, `&`, `/` in JSON strings before injection; redeploy |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Notion image URL expiry | Notion CMS integration — data fetching layer | Deploy to Netlify; check image URLs 2 hours later |
| Build-time rate limit burst | Notion CMS integration — data fetching layer | Run full build with throttle disabled; confirm it fails; re-enable and confirm it passes |
| Incomplete block type coverage | Notion CMS integration — block renderer | Create a test Notion page using every supported block type; verify full render |
| Recursive child block fetch | Notion CMS integration — data fetching layer | Test with a Project page using toggle + column blocks |
| Webhook endpoint security | Webhook pipeline phase | Send unsigned POST to endpoint; verify 401 response |
| SSG/ISR incompatibility | Webhook pipeline phase — documentation + build config | Verify no `revalidate` in codebase; verify rebuild triggers on Notion publish |
| Tailwind hardcoded colors | Visual rebrand phase — design token extraction | `grep -r "bg-gray\|text-gray\|bg-white\|bg-black" src/` should return zero results after token extraction |
| JSON-LD XSS (escalates with Notion as source) | Notion CMS integration — content rendering | Test Schema.org output with specially crafted Notion page content |
| Netlify build hook exposure | Webhook pipeline phase | Verify hook URL is not in any git-tracked file |
| Date validation for Notion fields | Notion CMS integration — data access layer | Test getAllPosts/getAllProjects with a draft page missing a date property |

---

## Sources

- Notion API official rate limits: https://developers.notion.com/reference/request-limits (verified 2026-03-15, 3 req/sec average)
- Notion image expiry: https://guillermodlpa.com/blog/how-to-render-images-from-the-notion-api-with-next-js-image-optimization
- Notion file object documentation: https://developers.notion.com/reference/file-object
- Image expiry community discussion: https://github.com/vercel/next.js/discussions/36503
- Fixing Notion 1-hour expiring images: https://snugl.dev/archive/fixing-notions-1-hour-expiring-image-problem
- Notion webhooks official docs: https://developers.notion.com/reference/webhooks
- Notion webhooks guide with security: https://hookdeck.com/webhooks/platforms/guide-to-notion-webhooks-features-and-best-practices
- Webhook signature verification security: https://www.catchhooks.com/blog/webhook-security-and-signature-verification
- Netlify conditional rebuild with INCOMING_HOOK_BODY: https://melanie-richards.com/blog/webhook-payloads/
- Notion block children API (pagination): https://developers.notion.com/reference/get-block-children
- Notion CMS + Next.js ISR stale content: https://nextjs.org/docs/app/guides/incremental-static-regeneration
- Tailwind v4 migration real-world pitfalls: https://dev.to/mridudixit15/real-world-migration-steps-from-tailwind-css-v3-to-v4-1nn3
- Tailwind design token best practices: https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns
- Tailwind v4 dark mode and rebrand issues: https://github.com/tailwindlabs/tailwindcss/discussions/16517
- Project codebase concerns (existing tech debt): .planning/codebase/CONCERNS.md

---
*Pitfalls research for: Notion CMS + Next.js 15 portfolio with Tailwind rebrand (debug-vault)*
*Researched: 2026-03-15*
