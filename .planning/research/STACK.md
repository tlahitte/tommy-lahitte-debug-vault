# Stack Research

**Domain:** Maker portfolio — Notion CMS integration into existing Next.js 15 site
**Researched:** 2026-03-15
**Confidence:** HIGH (core stack verified against official docs and npm registry)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `@notionhq/client` | `^5.13.0` | Official Notion API SDK — query databases, fetch page blocks, retrieve page metadata | Official SDK maintained by Notion. v5+ aligns with the 2025-09-03 and 2026-03-11 API versions. Typed responses, handles pagination. 77k weekly downloads, actively maintained. |
| `notion-to-md` | `^3.1.9` | Convert Notion block tree to Markdown string | v3 is the current stable release. Handles all standard Notion block types (headings, images, callouts, code, embeds). v4 alpha exists but is not production-ready as of March 2026. |
| `react-markdown` | `^10.1.0` | Render Markdown string to React components | ESM-only, safe by default (no `dangerouslySetInnerHTML`), supports custom component overrides per tag (critical for styling), works as a Server Component in Next.js App Router. |
| `remark-gfm` | `^4.x` | GFM plugin for react-markdown | Required for GitHub Flavored Markdown: tables, strikethrough, task lists, autolinks. Notion's export format produces GFM-compatible markdown. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `rehype-highlight` | `^7.x` | Syntax highlighting for code blocks via `rehype` | Use when blog articles contain code snippets. Integrates as a `rehypePlugin` on `react-markdown`. Lighter than `react-syntax-highlighter`. |
| `gray-matter` | `^4.0.3` | Parse frontmatter from Notion-exported markdown | Only needed if you adopt a local markdown caching strategy. Skip if fetching live from API at build time. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `NOTION_API_KEY` env var | Authenticate the Notion client | Set in Netlify environment variables UI. Never commit to git. Use `.env.local` locally. |
| `NOTION_BLOG_DATABASE_ID` env var | Target blog database | Extract from the Notion database URL (the 32-char hex after the workspace slug). |
| `NOTION_PROJECTS_DATABASE_ID` env var | Target projects database | Same extraction method. One env var per database. |
| Netlify Build Hook URL | POST endpoint that triggers a rebuild | Generated in: Site configuration > Build & deploy > Continuous deployment > Build hooks. |

## Webhook Strategy: Notion → Netlify Rebuild

This is the most important architectural decision for the CMS pipeline.

### Recommended: Notion Database Automation + Netlify Build Hook

**How it works:**

1. In Netlify, generate a Build Hook URL (a unique POST endpoint per site/branch).
2. In Notion, on each content database (Blog, Projects), create an automation:
   - Trigger: "When page property changes" → Status = "Published"
   - Action: "Send webhook" → paste the Netlify Build Hook URL
3. When Tommy sets a page status to "Published" in Notion, the automation fires a POST to Netlify, triggering a full rebuild.

**Why this approach:**

- Zero infrastructure to maintain. No serverless function, no intermediary service.
- Notion's built-in webhook action sends a POST request — exactly what Netlify build hooks require.
- The rebuild picks up the newly published content via `@notionhq/client` during the build.

**Constraint to be aware of:**

Notion's "Send webhook" automation action requires a **paid Notion plan** (Plus or above). It is not available on the free plan. The Notion API itself (including programmatic webhook subscriptions for developer integrations) is available on all plans, but the no-code database automation trigger is paid-only.

If Tommy is on the free plan, the fallback is: manually trigger a Netlify rebuild via the Netlify UI, or use a scheduled GitHub Action that rebuilds every N hours.

### Fallback: Scheduled GitHub Actions Rebuild

```yaml
# .github/workflows/scheduled-rebuild.yml
on:
  schedule:
    - cron: '0 6 * * *'  # Once daily at 6am UTC
jobs:
  trigger-netlify:
    runs-on: ubuntu-latest
    steps:
      - run: curl -X POST -d {} "${{ secrets.NETLIFY_BUILD_HOOK_URL }}"
```

This costs 0 build minutes on Netlify's free tier (the GitHub Action triggers the hook, not the other way around). It does mean content is not live-immediately — max delay equals the schedule interval.

## ISR vs Full Rebuild

**Decision: Full SSG rebuild, not ISR.**

Rationale from PROJECT.md:

> "Garder l'approche SSG — pages statiques générées au build, rapides"
> "Garder SSG (pas de SSR ou API routes pour le contenu)"

This is the correct call for this project. Here is why:

| Concern | Full Rebuild (SSG) | ISR |
|---------|-------------------|-----|
| Netlify compatibility | Native — Netlify is built for static output | Requires Netlify's Next.js runtime plugin with caveats |
| Notion image URL expiry | Solved at build time if images are proxied or downloaded | Images fetched at ISR time also expire; same problem, more complex |
| Content freshness | Fresh on every deploy (triggered by webhook) | Fresh after `revalidate` interval, but requires server infrastructure |
| Complexity | Simple: build runs, outputs HTML | Requires runtime server process on Netlify |
| Cost | Free tier (300 min/month) | Same free tier but requires Netlify's Next.js plugin |
| Debugging | Straightforward | Harder to reason about cache states |

**Conclusion:** SSG + webhook-triggered rebuild is simpler, cheaper, and better aligned with the existing pipeline. ISR adds complexity without meaningful benefit for a personal portfolio that publishes infrequently.

## Notion Image Handling Strategy

Notion image URLs expire after 1 hour. This is a critical pitfall for SSG.

**Recommended approach: Re-fetch images during build, proxy via Next.js `<Image>` with `remotePatterns`.**

Notion serves images from `prod-files-secure.s3.us-east-1.amazonaws.com`. Configure `next.config.ts` to allow this domain. Since the full rebuild is triggered by a webhook at publish time, the 1-hour expiry window is not an issue — images are fetched fresh at build time and the resulting static HTML uses the build-time URL. The static HTML is served immediately after build completion, well within the expiry window.

**For builds that take under 1 hour** (virtually guaranteed for a personal portfolio), this approach is safe.

**If images appear in the rendered HTML beyond 1 hour post-build**, they will break. The mitigation is to download images locally during the build script and rewrite URLs to `/public/images/notion/...`. This is only needed if Netlify's CDN caching does not re-serve the statically embedded URL before it expires (it does — Netlify serves pre-built HTML, not live-fetching URLs at serve time, so this is a non-issue for `<img>` tags in static HTML).

The actual risk is in Next.js `<Image>` optimization, which can re-fetch the source URL for on-demand optimization. Configure `images.remotePatterns` to match the Notion S3 domain, and consider disabling `unoptimized: false` if builds are frequent enough.

## Next.js 15 App Router SSG Pattern

The correct pattern for Notion-backed pages in the App Router:

```typescript
// app/blog/[slug]/page.tsx
export const dynamic = 'force-static'

export async function generateStaticParams() {
  // Query Notion DB for all published pages
  const response = await notion.databases.query({
    database_id: process.env.NOTION_BLOG_DATABASE_ID!,
    filter: { property: 'Status', status: { equals: 'Published' } },
  })
  return response.results.map((page) => ({ slug: page.id }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // Fetch at build time — no runtime server
  const page = await notion.pages.retrieve({ page_id: params.slug })
  const mdBlocks = await n2m.pageToMarkdown(params.slug)
  const mdString = n2m.toMarkdownString(mdBlocks)
  // render...
}
```

`force-static` ensures that if `generateStaticParams` doesn't enumerate a path, the build will error rather than silently falling back to SSR.

## Installation

```bash
# Core Notion integration
npm install @notionhq/client notion-to-md

# Markdown rendering
npm install react-markdown remark-gfm

# Optional: syntax highlighting for code blocks
npm install rehype-highlight
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| `notion-to-md` v3 stable | `notion-to-md` v4 alpha | Once v4 reaches stable release — it promises a more flexible AST-based transform pipeline, but breaking changes are ongoing |
| `react-markdown` v10 | `markdown-to-jsx` | If you need simpler API and don't need remark/rehype plugin ecosystem |
| `react-markdown` v10 | `@notion-render/client` (unofficial) | If you want direct Notion-block-to-React rendering without the markdown intermediate step. More fidelity to Notion UI, but tighter coupling to Notion's block schema |
| Netlify Build Hook + Notion automation | n8n / Zapier / Make | If you need conditional logic before triggering rebuild (e.g., only rebuild for specific categories). Adds a third-party service dependency. |
| Full SSG rebuild | ISR with `revalidate` | If content update latency matters (e.g., breaking news site). Not relevant for a maker portfolio. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `notion-client` (unofficial) | Undocumented reverse-engineered API, not stable, breaks without warning | `@notionhq/client` — official, versioned, supported |
| `react-notion-x` | Built on the unofficial `notion-client`, same fragility. High GitHub stars but depends on internal Notion API | `@notionhq/client` + `notion-to-md` + `react-markdown` |
| `notion-to-md` v4 alpha | Not production-stable as of March 2026. API surface is changing between alpha releases | `notion-to-md` v3.1.9 stable |
| SSR (`dynamic = 'force-dynamic'`) for content pages | Increases Netlify function invocations, adds latency, violates the project's explicit SSG constraint, and doesn't help with Notion image expiry | `force-static` + build-time fetch |
| Committing `NOTION_API_KEY` to git | Obvious security violation — Notion integration key grants read access to the shared workspace | Netlify environment variables + `.env.local` for local dev (gitignored) |

## Stack Patterns by Variant

**If Tommy is on Notion Free plan:**
- Use scheduled GitHub Actions rebuild (daily cron) instead of Notion database automation webhook
- Content will be live with up to 24h delay — acceptable for a personal portfolio
- Zero additional cost

**If Tommy is on Notion Plus or above:**
- Use Notion database automation "Send webhook" action pointing directly to Netlify Build Hook URL
- Content is live within minutes of setting Status = "Published"
- No intermediary service needed

**If image handling becomes problematic (build takes >1h or image CDN URLs break):**
- Add a build script that downloads all Notion images to `public/images/notion/` and rewrites URLs in the markdown before rendering
- This makes builds slightly slower but makes images permanently available

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `@notionhq/client@^5.13.0` | `notion-to-md@^3.1.9` | notion-to-md accepts a `Client` instance. No known compatibility issues. |
| `react-markdown@^10.1.0` | `remark-gfm@^4.x` | Both are ESM-only. Next.js 15 handles ESM correctly. No `require()` wrappers needed. |
| `react-markdown@^10.1.0` | `rehype-highlight@^7.x` | Pass as `rehypePlugins={[rehypeHighlight]}`. Compatible. |
| `next@15.2.3` | All of the above | Next.js 15 App Router with React Server Components is compatible with all listed packages used as server-side data fetching utilities. |

## Sources

- [github.com/makenotion/notion-sdk-js/releases](https://github.com/makenotion/notion-sdk-js/releases) — confirmed v5.13.0 as latest stable (verified March 2026), HIGH confidence
- [npmjs.com/package/notion-to-md](https://www.npmjs.com/package/notion-to-md/v/4.0.0-alpha.5) — confirmed v3.1.9 stable, v4 alpha, HIGH confidence
- [npmjs.com/package/react-markdown](https://www.npmjs.com/package/react-markdown) — confirmed v10.1.0 latest, HIGH confidence
- [developers.notion.com/reference/webhooks](https://developers.notion.com/reference/webhooks) — webhook event types and limitations, HIGH confidence
- [notion.com/help/webhook-actions](https://www.notion.com/help/webhook-actions) — paid plan requirement for automation webhook actions, HIGH confidence
- [docs.netlify.com/build/configure-builds/build-hooks/](https://docs.netlify.com/build/configure-builds/build-hooks/) — build hook POST trigger, HIGH confidence
- [nextjs.org/docs/app/api-reference/functions/generate-static-params](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — SSG pattern in App Router, HIGH confidence
- [ppaanngggg.medium.com — Notion as Headless CMS for Next.js 15](https://ppaanngggg.medium.com/notion-as-a-headless-cms-for-next-js-15-in-2025-f08207280e67) — community validation of notion-to-md + react-markdown pattern, MEDIUM confidence
- [snugl.dev — Fixing Notion's 1-Hour Expiring Image Problem](https://snugl.dev/archive/fixing-notions-1-hour-expiring-image-problem) — image expiry analysis, MEDIUM confidence

---
*Stack research for: Notion CMS integration into Next.js 15 maker portfolio*
*Researched: 2026-03-15*
