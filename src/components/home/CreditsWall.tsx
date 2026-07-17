import Link from 'next/link'

// Scannable credibility signal: the shows and clients behind the work. Each
// tile links to the partner's site and shows its brand mark. The mark is the
// company's own favicon, served live via Google's favicon endpoint (no assets
// rehosted, tiny and fast). Swap in a proper wordmark later by setting `logo`
// to a local file path.
type Credit = {
  name: string
  url: string
  /** Domain used to fetch the favicon mark. */
  domain: string
  /** Optional local logo path; overrides the favicon when set. */
  logo?: string
}

const CREDITS: Credit[] = [
  { name: 'Cirque du Soleil', url: 'https://www.cirquedusoleil.com', domain: 'cirquedusoleil.com' },
  { name: 'Roger Waters', url: 'https://www.rogerwaters.com', domain: 'rogerwaters.com' },
  { name: 'Dragone', url: 'https://www.dragone.com', domain: 'dragone.com' },
  { name: 'Balich Wonder Studio', url: 'https://www.balichwonderstudio.com', domain: 'balichwonderstudio.com' },
  { name: 'CCTV', url: 'https://www.cctv.com', domain: 'cctv.com' },
  { name: 'Les 7 Doigts', url: 'https://7doigts.com', domain: '7doigts.com' },
  { name: 'Chimelong', url: 'https://www.chimelong.com', domain: 'chimelong.com' },
  { name: 'VYV', url: 'https://www.vyv.ca', domain: 'vyv.ca' },
  { name: 'Epic Games', url: 'https://www.epicgames.com', domain: 'epicgames.com', logo: '/logos/epic-games.svg' },
  { name: 'The Walt Disney Company', url: 'https://thewaltdisneycompany.com', domain: 'disney.com' },
]

function markSrc(c: Credit): string {
  return c.logo ?? `https://www.google.com/s2/favicons?domain=${c.domain}&sz=64`
}

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
          <a
            key={c.name}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={c.name}
            className="group flex h-20 items-center justify-center gap-2.5 rounded-xl border border-border bg-surface-raised px-3 text-center transition-colors hover:border-accent/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={markSrc(c)}
              alt=""
              width={20}
              height={20}
              loading="lazy"
              className="h-5 w-5 shrink-0 object-contain"
            />
            <span className="text-sm font-medium leading-tight text-text-muted transition-colors group-hover:text-accent">
              {c.name}
            </span>
          </a>
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
