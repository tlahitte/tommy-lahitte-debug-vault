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
    <span className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold border bg-accent/15 text-accent border-accent/50 uppercase tracking-wide">
      Unreal Tip
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Vault row — vertical list item (similar to discipline cards)       */
/* ------------------------------------------------------------------ */

function VaultRow({ entry }: { entry: VaultEntry }) {
  const isJournal = entry.kind === 'journal'
  const href = isJournal ? `/blog/${entry.post.slug}/` : `/tips/${entry.tip.slug}/`
  const title = isJournal ? entry.post.title : entry.tip.title
  const summary = isJournal ? entry.post.excerpt : entry.tip.summary
  const dateStr = isJournal ? entry.post.date : entry.tip.publishedAt
  const tags = isJournal ? [] : entry.tip.tags.slice(0, 3)

  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-xl bg-surface p-4 sm:p-5 cursor-pointer"
    >
      {/* Date column */}
      <time
        dateTime={dateStr}
        className="text-xs text-text-muted shrink-0 pt-0.5 w-20 sm:w-24 text-right tabular-nums"
      >
        {new Date(dateStr).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </time>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <ContentTypeBadge kind={entry.kind === 'journal' ? 'journal' : 'tip'} />
        </div>
        <h3 className="text-base font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed mt-1 line-clamp-2">
          {summary}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 rounded bg-surface-raised border border-border text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Arrow */}
      <svg
        className="shrink-0 text-text-muted group-hover:text-accent transition-colors mt-1"
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
  )
}

/* ------------------------------------------------------------------ */
/*  Fresh from the Vault                                               */
/* ------------------------------------------------------------------ */

export default function FreshFromTheVault({ tips, posts }: Props) {
  const hydrated = useHydrated()
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
    <div className="rounded-2xl bg-surface-raised p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-6">
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

      {/* Vertical list */}
      <div className="flex flex-col gap-2">
        {entries.map((entry, i) => (
          <motion.div
            key={
              entry.kind === 'journal' ? entry.post.slug : entry.tip.slug
            }
            initial={hydrated ? { opacity: 0, y: 14 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.015, y: -2 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
              delay: i * 0.06,
            }}
          >
            <VaultRow entry={entry} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
