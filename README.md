# Tommy Lahitte — Debug Vault

> Maker & tinkerer who bridges art and technology — projects, field notes, and things worth building.

A personal site collecting Unreal Engine tips, journal posts (via Notion), and a portfolio of disciplines spanning virtual production, electronics, film photography, software engineering, and AI.
Built with Next.js 15, Tailwind CSS, and deployed as a static export on Netlify.

**Live site:** https://tommylahitte.com

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, static export) |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion (motion/react) |
| Language | TypeScript (strict) |
| CMS | Notion (journal posts fetched at build time) |
| Deployment | Netlify |
| Font | Denim VF (local, next/font/local) |

---

## Local Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build & Preview

```bash
npm run build        # Outputs to /out
npx serve out        # Preview static build locally
```

---

## Content

### Unreal Tips

1. Create `src/content/tips/<category>-<slug>.ts` exporting a `Tip` object
2. Import and add it to `allTips` in `src/content/tips/index.ts`

Tip categories: `editor` · `debugging` · `qa-workflow`

### Journal Posts

Journal posts are authored in Notion and fetched at build time. No local files needed — just publish in the connected Notion database and rebuild.

---

## Sitemap & Robots

- `src/app/sitemap.ts` dynamically generates the sitemap from all tips and blog posts
- `public/robots.txt` allows all crawlers and points to the sitemap
- No manual sitemap updates needed — new content is picked up automatically at build time

---

## Netlify Deployment

1. Push to `main` on GitHub
2. In Netlify: **Add new site → Import an existing project → GitHub**
3. Build settings (auto-populated from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `out`
4. Deploy and customize the subdomain under Site Settings → Domain

---

## SEO

- Per-page metadata via `generateMetadata()`
- JSON-LD structured data (Person schema on home, TechArticle on each tip)
- Dynamic sitemap and static `robots.txt`

---

*Tommy Lahitte · Senior QA Engineer at Epic Games*
