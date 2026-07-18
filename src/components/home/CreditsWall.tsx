import Link from 'next/link'

// Scannable credibility signal: the shows and clients behind the work,
// arranged as a honeycomb of hexagonal logo cells. Each cell links to the
// partner's site and reveals its name as a small tooltip above the mark.
// No background or border is drawn — the hexagon only shapes the hit area.
//
// Each mark is a local, pre-optimized PNG/SVG (96px, a few KB each) rather
// than a live cross-origin fetch, so it loads fast and displays reliably.
//
// To add a credit without a cached logo yet, set `domain` instead of `logo` —
// it renders via Google's favicon endpoint as a stopgap until cached locally.
type Credit = {
  name: string
  url: string
  /** Domain used to fetch a stopgap favicon mark (ignored when `logo` is set). */
  domain?: string
  /** Local logo path (public/logos/*). */
  logo?: string
}

const ROW_1: Credit[] = [
  { name: 'Cirque du Soleil', url: 'https://www.cirquedusoleil.com', logo: '/logos/cirque-du-soleil.png' },
  { name: 'Roger Waters', url: 'https://www.rogerwaters.com', logo: '/logos/roger-waters.png' },
  { name: 'Dragone', url: 'https://www.dragone.com', logo: '/logos/dragone.png' },
  { name: 'Balich Wonder Studio', url: 'https://www.balichwonderstudio.com', logo: '/logos/balich.png' },
  { name: 'CCTV', url: 'https://www.cctv.com', logo: '/logos/cctv.png' },
]

const ROW_2: Credit[] = [
  { name: 'Les 7 Doigts', url: 'https://7doigts.com', logo: '/logos/les-7-doigts.png' },
  { name: 'Chimelong', url: 'https://www.chimelong.com', logo: '/logos/chimelong.png' },
  { name: 'VYV', url: 'https://www.vyv.ca', logo: '/logos/vyv.png' },
  { name: 'Epic Games', url: 'https://www.epicgames.com', logo: '/logos/epic-games.svg' },
  { name: 'The Walt Disney Company', url: 'https://thewaltdisneycompany.com', logo: '/logos/disney.png' },
]

function markSrc(c: Credit): string {
  return c.logo ?? `https://www.google.com/s2/favicons?domain=${c.domain}&sz=128`
}

// Regular pointy-top hexagon geometry: height = width * 1.1547. Adjacent rows
// interlock when offset horizontally by half a cell and pulled up so row
// centers sit 0.866 * width apart (the standard honeycomb tessellation ratio).
const HEX_W = 'clamp(56px, 16vw, 100px)'
const HEX_GAP = 'clamp(6px, 2vw, 14px)'
const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

function HexCell({ credit }: { credit: Credit }) {
  const src = markSrc(credit)

  return (
    <a
      href={credit.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={credit.name}
      className="group/hex relative flex shrink-0 items-center justify-center"
      style={{ width: HEX_W, aspectRatio: '0.866', clipPath: HEX_CLIP }}
    >
      {/* Name — revealed above the mark on hover / keyboard focus */}
      <span
        className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 -translate-y-1 whitespace-nowrap rounded-md bg-surface px-2 py-1 text-xs font-medium text-text-primary opacity-0 shadow-md transition-all duration-200 group-hover/hex:translate-y-0 group-hover/hex:opacity-100 group-focus-visible/hex:translate-y-0 group-focus-visible/hex:opacity-100"
      >
        {credit.name}
      </span>

      {/* Logo — always grayscale, no hover colour change */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        className="h-auto object-contain grayscale"
        style={{ width: '72%' }}
      />
    </a>
  )
}

export default function CreditsWall() {
  return (
    <div className="rounded-2xl bg-surface p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl">
          Shows and clients I have worked with.
        </h2>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex justify-center" style={{ gap: HEX_GAP }}>
          {ROW_1.map((c) => (
            <HexCell key={c.name} credit={c} />
          ))}
        </div>
        <div
          className="flex justify-center"
          style={{
            gap: HEX_GAP,
            marginLeft: `calc(${HEX_W} / 2 + ${HEX_GAP} / 2)`,
            marginTop: `calc(-1 * ${HEX_W} * 0.29)`,
          }}
        >
          {ROW_2.map((c) => (
            <HexCell key={c.name} credit={c} />
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center sm:justify-start">
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
