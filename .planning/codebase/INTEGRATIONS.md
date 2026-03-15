# External Integrations

**Analysis Date:** 2026-03-15

## APIs & External Services

**No External APIs Used** - This is a static content site with no API integrations

## Data Storage

**Databases:**
- None - All content is static, defined in TypeScript source files

**File Storage:**
- Local filesystem only
  - Static content stored in: `src/content/tips/` and `src/content/blog/`
  - Static assets (images, fonts) in: `public/`
  - Built as static HTML files during `npm run build`

**Caching:**
- Browser caching via HTTP headers from Netlify
- No application-level caching

## Authentication & Identity

**Auth Provider:**
- None - Public site with no authentication

## Monitoring & Observability

**Error Tracking:**
- None configured

**Logs:**
- Build logs from Netlify CI/CD
- No application-level logging

## CI/CD & Deployment

**Hosting:**
- Netlify (static site hosting)
  - Build command: `npm run build`
  - Publish directory: `out/`
  - Node version: 22

**CI Pipeline:**
- Netlify auto-deployment on push to `main` branch
- Manual site deployment available via Netlify dashboard

**Deployment Flow:**
1. Push to GitHub `main` branch
2. Netlify webhook triggers automatic build
3. `npm run build` generates static HTML to `/out`
4. Files published to `https://tommylahitte.com`

## Environment Configuration

**Required env vars:**
- None - Static site requires no environment variables at build or runtime

**Secrets location:**
- Not applicable - No secrets or API keys used

## Social & External Links

**Outbound Links:**
- LinkedIn: `https://uk.linkedin.com/in/tlahitte`
- Instagram: `https://www.instagram.com/1day.snap/`
- ArtStation: `https://www.artstation.com/tlahitte`
- Telegram: `https://t.me/tlahitte`
- GitHub: `https://github.com/tlahitte`
- MakerWorld: `https://makerworld.com/en/@Toasty_x`
- Email: `tlahitte@gmail.com`

All social links are hardcoded in `src/components/layout/Footer.tsx` as simple `<a>` elements.

## Webhooks & Callbacks

**Incoming:**
- None - No webhook endpoints

**Outgoing:**
- None - No outbound webhooks

## Font Delivery

**Google Fonts:**
- Inter font loaded via `next/font/google`
- Variable CSS custom property: `--font-inter`
- Subset: Latin characters only
- Display strategy: `swap` (show system font while loading)

Integration point: `src/app/layout.tsx` line 4

## SEO & Metadata

**Sitemap:**
- Dynamic sitemap generation at `src/app/sitemap.ts`
- Uses Next.js `MetadataRoute.Sitemap` type
- Generated from content data at build time
- Includes all tips and blog posts with URLs, last modified dates, and priority scores

**Robots.txt:**
- Static file at `public/robots.txt`
- Allows all indexing

**Open Graph & Structured Data:**
- Per-page metadata via Next.js `generateMetadata()` function
- JSON-LD schema (Person and WebSite) embedded in layout
- Location: `src/app/layout.tsx` lines 41-61
- OG image: `public/og-image.png` (1200×630px)

---

*Integration audit: 2026-03-15*
