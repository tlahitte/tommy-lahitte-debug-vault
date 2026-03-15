# Technology Stack

**Analysis Date:** 2026-03-15

## Languages

**Primary:**
- TypeScript 5 - Strict mode enabled for all source code and configuration
- JSX/TSX - React component syntax throughout

## Runtime

**Environment:**
- Node.js 22 - Specified in Netlify build configuration
- NPM - Package manager with lockfile present (`package-lock.json`)

**Package Manager:**
- npm (version in lockfile)
- Lockfile: `package-lock.json` present and committed

## Frameworks

**Core:**
- Next.js 15.2.3 - App Router with static export (`output: 'export'`)
- React 19.0.0 - UI library
- React DOM 19.0.0 - DOM rendering

**Styling:**
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- PostCSS 8.5.3 - CSS transformation pipeline
- Autoprefixer 10.4.20 - Vendor prefix handling

**Build/Dev:**
- TypeScript 5 - Language compiler
- ESLint 9 - Code linting with Next.js config
- Next.js built-in lint command

## Key Dependencies

**Critical:**
- next/font/google - Google Fonts integration (Inter font loaded)
- next/link - Client-side navigation component
- next/image - Image optimization (disabled: `unoptimized: true` for static export)

**Infrastructure:**
- None - Pure static generation, no server-side runtime dependencies

## Configuration

**Environment:**
- No external `.env` files required for core functionality
- Static generation at build time (no runtime secrets needed)
- Build environment specifies `NODE_VERSION = "22"` in `netlify.toml`

**Build:**
- `tsconfig.json` - TypeScript compiler options:
  - Strict type checking enabled
  - Target: ES2017
  - Module resolution: bundler
  - Path alias: `@/*` → `./src/*`
  - Incremental compilation enabled
- `next.config.ts` - Next.js configuration:
  - Static export mode: `output: 'export'`
  - Trailing slashes: enabled
  - Image optimization: disabled for static export
- `tailwind.config.ts` - Tailwind CSS configuration:
  - Content paths: `src/pages/**`, `src/components/**`, `src/app/**`
  - Custom colors: background and foreground (CSS variables)
  - Custom fonts: display font using CSS variable
  - Custom animations: `spin-slow` (6s rotation)
- `postcss.config.mjs` - PostCSS pipeline:
  - Tailwind CSS plugin
  - Autoprefixer plugin
- `.eslintrc` - ESLint config (extends Next.js defaults)

## Platform Requirements

**Development:**
- Node.js 22
- npm 10+ (inferred from lockfile format)
- TypeScript 5
- No additional system dependencies

**Production:**
- Deployment target: Netlify
- Build command: `npm run build` (outputs to `/out`)
- Publish directory: `/out` (static export)
- Trailing slashes required in URLs
- CDN/Static hosting (no server runtime)

## Build & Runtime Scripts

```bash
npm run dev       # Next.js dev server (port 3000)
npm run build     # Static export to /out directory
npm start         # Start production server (not used in static export)
npm run lint      # Run ESLint checks
```

---

*Stack analysis: 2026-03-15*
