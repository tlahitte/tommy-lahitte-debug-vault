import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-base font-bold text-zinc-100 hover:text-violet-400 transition-colors"
          >
            Tommy Lahitte <span className="text-violet-500">|</span> Debug Vault
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-semibold text-zinc-100 hover:text-violet-300 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/tips"
              className="text-sm font-semibold text-zinc-100 hover:text-violet-300 transition-colors"
            >
              Tips
            </Link>
            <Link
              href="/blog"
              className="text-sm font-semibold text-zinc-100 hover:text-violet-300 transition-colors"
            >
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
