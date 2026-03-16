'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { TextShimmer } from '@/components/ui/text-shimmer'

export default function Hero() {
  return (
    <div>
      {/* Stacked on mobile, side-by-side on sm+ */}
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-10">

        {/* Portrait — centered above text on mobile, right side on sm+ */}
        <div className="relative shrink-0 w-32 sm:w-48 lg:w-60 order-first sm:order-last">
          {/* Rotating arc — blurred glow behind everything */}
          <div
            className="absolute -inset-10 rounded-full animate-spin-slow"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, transparent 45%, rgba(200,90,58,0.35) 62%, rgba(168,67,42,0.45) 78%, rgba(200,90,58,0.4) 90%, transparent 100%)',
              filter: 'blur(24px)',
            }}
          />
          {/* Animated concentric circles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 bg-gradient-to-br to-transparent"
              style={{
                inset: `${-12 - i * 8}px`,
                borderColor: [
                  'rgba(200, 90, 58, 0.5)',
                  'rgba(232, 132, 94, 0.35)',
                  'rgba(168, 67, 42, 0.2)',
                ][i],
                backgroundImage: `radial-gradient(ellipse at center, rgba(200, 90, 58, ${0.08 - i * 0.02}) 0%, transparent 70%)`,
              }}
              animate={{
                rotate: i % 2 === 0 ? 360 : -360,
                scale: [1, 1.05 + i * 0.03, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                rotate: {
                  duration: 20 + i * 5,
                  ease: 'linear',
                  repeat: Infinity,
                },
                scale: {
                  duration: 4 + i,
                  ease: 'easeInOut',
                  repeat: Infinity,
                },
                opacity: {
                  duration: 4 + i,
                  ease: 'easeInOut',
                  repeat: Infinity,
                },
              }}
            />
          ))}
          {/* Soft glow */}
          <div
            className="absolute -inset-10 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(200, 90, 58, 0.15) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
          {/* Frosted ring */}
          <div
            className="absolute -inset-3 rounded-full"
            style={{
              background: 'radial-gradient(circle, transparent 72%, rgba(250,250,247,0.4) 80%, rgba(250,250,247,0.7) 88%, rgba(240,235,224,0.85) 100%)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />
          {/* Image */}
          <Image
            src="/avatar/tommy-lahitte-480.webp"
            alt="Tommy Lahitte"
            width={480}
            height={480}
            sizes="(max-width: 640px) 128px, (max-width: 1024px) 192px, 240px"
            className="relative w-full rounded-full block aspect-square object-cover"
            priority
          />
        </div>

        {/* Text — centered on mobile, left-aligned on sm+ */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
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
          <p className="mt-2 sm:mt-3 text-lg sm:text-xl font-medium">
            <TextShimmer
              as="em"
              duration={5}
              spread={6}
              className="not-italic [--base-color:var(--accent)] [--base-gradient-color:#E8845E]"
            >
              Senior QA Engineer
            </TextShimmer>
            <span className="text-text-muted mx-2">·</span>
            <span className="text-text-muted">Epic Games</span>
          </p>
          <hr className="my-4 border-border" />
          <p className="text-base sm:text-xl text-text-muted leading-relaxed max-w-xl mx-auto sm:mx-0">
            On this website you&apos;ll find engineering field notes, side projects,
            and the things I think are worth sharing.
            <br className="hidden sm:block" />
            Welcome aboard.
          </p>
        </div>

      </div>

      {/* CTAs — centered on mobile, left-aligned on sm+ */}
      <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
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
