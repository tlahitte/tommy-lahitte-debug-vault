import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold text-zinc-100 hover:text-violet-400 transition-colors"
          >
            Tommy Lahitte <span className="text-violet-500">|</span> Debug Vault
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/tips"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Tips
            </Link>
            <Link
              href="/blog"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
