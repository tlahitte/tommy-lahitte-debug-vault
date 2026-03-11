'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import type { Tip, Category } from '@/lib/types'
import TipCard from './TipCard'
import CategoryFilter from './CategoryFilter'

const VALID_CATEGORIES: Category[] = ['editor', 'debugging', 'qa-workflow']

function TipsGridInner({ tips }: { tips: Tip[] }) {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  const isValidCategory = (v: string | null): v is Category =>
    VALID_CATEGORIES.includes(v as Category)

  const filtered = isValidCategory(category)
    ? tips.filter((t) => t.category === category)
    : tips

  return (
    <>
      <CategoryFilter />
      {filtered.length === 0 ? (
        <p className="text-zinc-500 text-sm mt-4">No tips in this category yet.</p>
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
