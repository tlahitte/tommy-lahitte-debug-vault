import Link from 'next/link'

// Fast, scannable credibility signal: the shows and clients behind the work.
// Each tile shows a logo when a local file is provided, otherwise the name.
// To add a logo, drop an optimized SVG (or small PNG) under /public and set
// its path on the matching entry below. Keep files small for fast loading.
type Credit = { name: string; logo?: string }

const CREDITS: Credit[] = [
  { name: 'Cirque du Soleil' },
  { name: 'Roger Waters' },
  { name: 'Dragone' },
  { name: 'Balich Worldwide Shows' },
  { name: 'CCTV' },
  { name: 'Les 7 Doigts' },
  { name: 'Chimelong' },
  { name: 'VYV' },
  { name: 'Epic Games', logo: '/logos/epic-games.svg' },
  { name: 'Disney' },
]

export default function CreditsWall() {
  return (
    <div className="rounded-2xl bg-surface p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl">
          Shows and clients I have worked with.
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CREDITS.map((c) => (
          <div
            key={c.name}
            className="flex h-20 items-center justify-center rounded-xl border border-border bg-surface-raised px-3 text-center"
          >
            {c.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.logo}
                alt={c.name}
                loading="lazy"
                className="max-h-8 w-auto max-w-[80%] object-contain"
              />
            ) : (
              <span className="text-sm font-medium text-text-muted">{c.name}</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href="/about/"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-70"
        >
          See the full experience
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
