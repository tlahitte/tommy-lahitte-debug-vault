import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-[20px] backdrop-saturate-[180%]">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-8">
        <div className="flex h-14 items-center justify-between gap-2">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 shrink-0"
          >
            Tommy Lahitte
          </Link>
          <nav className="flex items-center gap-2 sm:gap-6" aria-label="Main navigation">
            {[
              { href: '/blog', label: 'Journal' },
              { href: '/tips', label: 'Unreal Tips' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors duration-250 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 whitespace-nowrap py-1 after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-white after:transition-all after:duration-250 after:ease-out hover:after:w-full"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
