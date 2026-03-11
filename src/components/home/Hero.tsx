import Link from 'next/link'

export default function Hero() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100">
          Tommy Lahitte
        </h1>
        <p className="mt-4 text-xl text-zinc-400 font-medium">
          QA Engineer <span className="text-violet-500">·</span> Unreal Engine
        </p>
        <p className="mt-6 max-w-2xl text-base text-zinc-400 leading-relaxed">
          Field notes, debugging techniques, and QA workflows for Unreal Engine development.
          Hard-won lessons from shipping games at Epic Games.
        </p>
        <div className="mt-8">
          <Link
            href="/tips"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            Browse All Tips
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
        </div>
      </div>
    </section>
  )
}
