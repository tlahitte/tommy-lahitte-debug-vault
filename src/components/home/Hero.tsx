import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <div>
      {/* Top row: text left, portrait right */}
      <div className="flex items-start gap-6 sm:gap-8">

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary font-display">
            Senior QA Engineer
          </h1>
          <p className="mt-2 sm:mt-3 text-xl font-medium">
            <em className="text-accent not-italic">
              <span className="hidden sm:inline">Unreal Engine</span>
              <span className="sm:hidden">UE</span> Expert
            </em>
            <span className="text-text-muted mx-2">·</span>
            <span className="text-text-muted">Epic Games</span>
          </p>
          <hr className="my-4 border-border" />
          <p className="text-xl text-text-muted leading-relaxed sm:whitespace-nowrap">
            Engineering field notes, side projects, and the things worth sharing.
          </p>
        </div>

        {/* Portrait with rotating glow halo */}
        <div className="relative shrink-0 mt-1 w-28 sm:w-36 lg:w-44">
          {/* Rotating arc — blurred so the glow peaks at the ring edge and fades outward */}
          <div
            className="absolute -inset-8 rounded-full animate-spin-slow"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, transparent 45%, rgba(200,90,58,0.7) 62%, rgba(168,67,42,0.85) 78%, rgba(200,90,58,0.9) 90%, transparent 100%)',
              filter: 'blur(18px)',
            }}
          />
          {/* Image */}
          <Image
            src="/tommy-lahitte-avatar-480.webp"
            alt="Tommy Lahitte"
            width={480}
            height={480}
            sizes="(max-width: 640px) 112px, (max-width: 1024px) 144px, 176px"
            className="relative w-full rounded-2xl ring-1 ring-accent block"
            priority
          />
        </div>

      </div>

      {/* CTAs — full width below */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/tips"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover hover:scale-[1.03] active:scale-95 transition-all duration-300"
        >
          Unreal Tips
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text-muted hover:border-accent hover:bg-surface-raised hover:text-accent hover:scale-[1.03] active:scale-95 transition-all duration-300"
        >
          Read Blog
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <a
          href="https://github.com/tlahitte"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text-muted hover:border-accent hover:bg-surface-raised hover:text-accent hover:scale-[1.03] active:scale-95 transition-all duration-300"
        >
          GitHub
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>
        </a>
      </div>
    </div>
  )
}
