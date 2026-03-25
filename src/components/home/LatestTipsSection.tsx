'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { useHydrated } from '@/hooks/useHydrated'
import type { Tip } from '@/lib/types'
import type { BlogPost } from '@/lib/blog-types'

/* ------------------------------------------------------------------ */
/*  Unified entry type                                                 */
/* ------------------------------------------------------------------ */

type VaultEntry =
  | { kind: 'tip'; tip: Tip }
  | { kind: 'journal'; post: BlogPost }

interface Props {
  tips: Tip[]
  posts: BlogPost[]
}

/* ------------------------------------------------------------------ */
/*  Content-type badge                                                 */
/* ------------------------------------------------------------------ */

function ContentTypeBadge({ kind }: { kind: 'tip' | 'journal' }) {
  if (kind === 'journal') {
    return (
      <span className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold border bg-[#5B8DB8]/15 text-[#5B8DB8] border-[#5B8DB8]/50 uppercase tracking-wide">
        Journal
      </span>
    )
  }
  return (
    <span className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold border bg-[#C85A3A]/15 text-[#C85A3A] border-[#C85A3A]/50 uppercase tracking-wide">
      Unreal Tip
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Vault card                                                         */
/* ------------------------------------------------------------------ */

function VaultCard({ entry }: { entry: VaultEntry }) {
  if (entry.kind === 'journal') {
    const { post } = entry
    return (
      <Link
        href={`/blog/${post.slug}/`}
        className="group flex flex-col rounded-xl border border-border bg-surface-raised p-5 card-elevated hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <ContentTypeBadge kind="journal" />
          <time
            dateTime={post.date}
            className="text-xs text-text-muted shrink-0 mt-0.5"
          >
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-2 leading-snug group-hover:text-accent transition-colors duration-300">
          {post.title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed flex-1">
          {post.excerpt}
        </p>
      </Link>
    )
  }

  const { tip } = entry
  return (
    <Link
      href={`/tips/${tip.slug}/`}
      className="group flex flex-col rounded-xl border border-border bg-surface-raised p-5 card-elevated hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <ContentTypeBadge kind="tip" />
        <time
          dateTime={tip.publishedAt}
          className="text-xs text-text-muted shrink-0 mt-0.5"
        >
          {new Date(tip.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-2 leading-snug group-hover:text-accent transition-colors duration-300">
        {tip.title}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed flex-1 mb-3">
        {tip.summary}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tip.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-medium px-2 py-0.5 rounded bg-surface border border-border text-text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Fresh from the Vault                                               */
/* ------------------------------------------------------------------ */

export default function FreshFromTheVault({ tips, posts }: Props) {
  const hydrated = useHydrated()
  // Merge and sort by date, then take the 4 most recent
  const entries: VaultEntry[] = [
    ...posts.map((post): VaultEntry => ({ kind: 'journal', post })),
    ...tips.map((tip): VaultEntry => ({ kind: 'tip', tip })),
  ]
    .sort((a, b) => {
      const dateA = a.kind === 'journal' ? a.post.date : a.tip.publishedAt
      const dateB = b.kind === 'journal' ? b.post.date : b.tip.publishedAt
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })
    .slice(0, 4)

  if (entries.length === 0) return null

  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background:
          'linear-gradient(150deg, #F0EBE0 0%, #EAE2D4 60%, #F2EDE3 100%)',
      }}
    >
      {/* Accent glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top right, rgba(200,90,58,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p
              className="text-xs font-medium tracking-widest uppercase mb-3"
              style={{ color: 'var(--accent)' }}
            >
              Latest
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary font-display">
              Fresh from the vault.
            </h2>
          </div>
          <Link
            href="/tips"
            className="shrink-0 text-sm font-medium text-accent hover:text-accent-hover flex items-center gap-1.5 transition-colors pb-1"
          >
            Browse all
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Cards grid: 2x2 on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {entries.map((entry, i) => (
            <motion.div
              key={
                entry.kind === 'journal' ? entry.post.slug : entry.tip.slug
              }
              initial={hydrated ? { opacity: 0, y: 14 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.08,
              }}
            >
              <VaultCard entry={entry} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
