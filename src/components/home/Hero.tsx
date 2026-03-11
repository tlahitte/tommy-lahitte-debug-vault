import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <div>
      {/* Top row: text left, portrait right */}
      <div className="flex items-start gap-6 sm:gap-8">

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-100 font-display">
            Tommy Lahitte
          </h1>
          <p className="mt-2 sm:mt-3 text-xl font-medium">
            <span className="text-violet-400">Senior QA Engineer</span>
            <span className="text-zinc-500 mx-2">|</span>
            <em className="text-violet-300 not-italic">
              <span className="hidden sm:inline">Unreal Engine</span>
              <span className="sm:hidden">UE</span> Expert
            </em>
          </p>
          <hr className="my-4 border-zinc-700/50" />
          <p className="text-xl text-zinc-400 leading-relaxed sm:whitespace-nowrap">
            Engineering field notes, side projects, and the things worth sharing.
          </p>
        </div>

        {/* Portrait */}
        <div className="shrink-0 mt-1">
          <Image
            src="/tommy-lahitte-avatar-480.webp"
            alt="Tommy Lahitte"
            width={480}
            height={480}
            sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 160px"
            className="w-28 sm:w-36 lg:w-44 rounded-2xl ring-1 ring-violet-700/40"
            priority
          />
        </div>

      </div>

      {/* CTAs — full width below */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/tips"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 hover:scale-[1.03] active:scale-95 transition-all duration-300"
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
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:border-violet-500 hover:bg-violet-950/50 hover:text-violet-300 hover:scale-[1.03] active:scale-95 transition-all duration-300"
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
          href="https://github.com/tommy-lahitte"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:border-violet-500 hover:bg-violet-950/50 hover:text-violet-300 hover:scale-[1.03] active:scale-95 transition-all duration-300"
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
