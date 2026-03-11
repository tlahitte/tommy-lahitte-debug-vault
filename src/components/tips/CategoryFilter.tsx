'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/lib/types'

const CATEGORIES: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'editor', label: 'Editor' },
  { value: 'debugging', label: 'Debugging' },
  { value: 'qa-workflow', label: 'QA Workflow' },
]

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('category') ?? 'all'

  function handleSelect(value: string) {
    const params = new URLSearchParams()
    if (value !== 'all') {
      params.set('category', value)
    }
    const query = params.toString()
    router.push(`/tips/${query ? `?${query}` : ''}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter tips by category">
      {CATEGORIES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleSelect(value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
            current === value
              ? 'bg-violet-600 border-violet-600 text-white'
              : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
          }`}
          aria-pressed={current === value}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
