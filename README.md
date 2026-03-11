# Tommy Lahitte — Debug Vault

> QA & debugging field notes for Unreal Engine — by Tommy Lahitte

A personal site collecting QA techniques, debugging workflows, and Unreal Engine tips.
Built with Next.js 15, Tailwind CSS, deployed as a static export on Netlify.

**Live site:** https://tommylahitte.com

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, static export) |
| Styling | Tailwind CSS v3 |
| Language | TypeScript (strict) |
| Deployment | Netlify |
| Font | Inter (next/font/google) |

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

## Adding Tips

1. Create `src/content/tips/<category>-<slug>.ts` exporting a `Tip` object
2. Import and add it to `allTips` in `src/content/tips/index.ts`
3. Update `public/sitemap.xml` with the new URL entry

Tip categories: `editor` · `debugging` · `qa-workflow`

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
- `public/sitemap.xml` and `public/robots.txt` included

---

*Tommy Lahitte · QA Engineer at Epic Games*
