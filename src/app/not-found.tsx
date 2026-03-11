import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-24 text-center">
      <p className="text-6xl font-bold text-violet-500 mb-4">404</p>
      <h1 className="text-2xl font-semibold text-zinc-100 mb-3">Page not found</h1>
      <p className="text-zinc-400 mb-8">
        The debug log shows no trace of this page. It may have been moved or never existed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
      >
        Return home
      </Link>
    </div>
  )
}
