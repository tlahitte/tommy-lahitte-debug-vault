'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useMemo } from 'react'
import type { Tip, Category } from '@/lib/types'
import TipCard from './TipCard'
import CategoryFilter from './CategoryFilter'

const VALID_CATEGORIES: Category[] = ['editor', 'debugging', 'qa-workflow']

function TipsGridInner({ tips }: { tips: Tip[] }) {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const [query, setQuery] = useState('')

  const isValidCategory = (v: string | null): v is Category =>
    VALID_CATEGORIES.includes(v as Category)

  const filtered = useMemo(() => {
    let result = isValidCategory(category)
      ? tips.filter((t) => t.category === category)
      : tips

    if (query.trim()) {
      const q = query.toLowerCase().trim()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    }

    return result
  }, [tips, category, query])

  return (
    <>
      {/* Search + Category filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tips..."
            className="w-full rounded-full bg-surface-raised pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow duration-200"
            aria-label="Search tips"
          />
        </div>
        <CategoryFilter />
      </div>

      {filtered.length === 0 ? (
        <p className="text-text-muted text-sm">
          {query.trim()
            ? `No tips matching "${query.trim()}".`
            : 'No tips in this category yet.'}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tip) => (
            <TipCard key={tip.slug} tip={tip} />
          ))}
        </div>
      )}
    </>
  )
}

export default function TipsGrid({ tips }: { tips: Tip[] }) {
  return (
    <Suspense fallback={
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip) => (
          <TipCard key={tip.slug} tip={tip} />
        ))}
      </div>
    }>
      <TipsGridInner tips={tips} />
    </Suspense>
  )
}
