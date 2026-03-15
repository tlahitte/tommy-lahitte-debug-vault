'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface border-b border-border'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold text-text-primary hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Tommy Lahitte
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6" aria-label="Main navigation">
            <Link
              href="/blog"
              className="text-sm font-medium text-text-muted hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Blog
            </Link>
            <Link
              href="/projects"
              className="text-sm font-medium text-text-muted hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-text-muted hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
