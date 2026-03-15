import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-24 text-center">
      <p className="text-6xl font-bold text-accent mb-4">404</p>
      <h1 className="text-2xl font-semibold text-text-primary mb-3">Page not found</h1>
      <p className="text-text-muted mb-8">
        The debug log shows no trace of this page. It may have been moved or never existed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
      >
        Return home
      </Link>
    </div>
  )
}
