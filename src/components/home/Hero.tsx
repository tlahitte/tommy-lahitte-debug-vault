'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { TextShimmer } from '@/components/ui/text-shimmer'

export default function Hero() {
  return (
    <div>
      {/* Top row: text left, portrait right */}
      <div className="flex items-center gap-6 sm:gap-10">

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary font-display">
            Hey, I&apos;m Tommy{' '}
            <motion.span
              className="inline-block origin-[70%_80%]"
              animate={{ rotate: [0, 20, -10, 20, -5, 0] }}
              transition={{
                repeat: Infinity,
                repeatDelay: 10,
                duration: 0.8,
                ease: 'easeInOut',
              }}
            >
              👋
            </motion.span>
          </h1>
          <p className="mt-2 sm:mt-3 text-xl font-medium">
            <TextShimmer
              as="em"
              duration={5}
              spread={6}
              className="not-italic [--base-color:var(--accent)] [--base-gradient-color:var(--accent-hover)]"
            >
              Maker &amp; Tinkerer
            </TextShimmer>
            <span className="text-text-muted mx-2">·</span>
            <span className="text-text-muted">Art meets Technology</span>
          </p>
          <hr className="my-4 border-border" />
          <p className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-xl">
            I bridge art and technology — building projects at the intersection of electronics, software, and creative experimentation.
            <br className="hidden sm:block" />
            Senior QA Engineer at Epic Games by day, maker by nature.
          </p>
        </div>

        {/* Portrait with rotating glow halo + frosted ring */}
        <div className="relative shrink-0 w-36 sm:w-48 lg:w-60">
          {/* Rotating arc — blurred glow behind everything */}
          <div
            className="absolute -inset-10 rounded-full animate-spin-slow"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, transparent 45%, rgba(200,90,58,0.7) 62%, rgba(168,67,42,0.85) 78%, rgba(200,90,58,0.9) 90%, transparent 100%)',
              filter: 'blur(18px)',
            }}
          />
          {/* Frosted ring — sits between glow and image, blurs the animation behind */}
          <div
            className="absolute -inset-3 rounded-full"
            style={{
              background: 'radial-gradient(circle, transparent 72%, rgba(250,250,247,0.4) 80%, rgba(250,250,247,0.7) 88%, rgba(240,235,224,0.85) 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />
          {/* Image */}
          <Image
            src="/avatar/tommy-lahitte-480.webp"
            alt="Tommy Lahitte"
            width={480}
            height={480}
            sizes="(max-width: 640px) 144px, (max-width: 1024px) 192px, 240px"
            className="relative w-full rounded-full block aspect-square object-cover"
            priority
          />
        </div>

      </div>

      {/* CTAs — full width below */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/blog?category=Project"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover hover:scale-[1.03] active:scale-95 transition-all duration-300"
        >
          See Projects
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
          Read Journal
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
