'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/lib/types'

const CATEGORIES: {
  value: Category | 'all'
  label: string
  activeClass: string
  hoverClass: string
}[] = [
  {
    value: 'all',
    label: 'All',
    activeClass: 'bg-accent/10 border-accent/30 text-accent',
    hoverClass: 'hover:bg-accent/10 hover:border-accent/30 hover:text-accent',
  },
  {
    value: 'editor',
    label: 'Editor',
    activeClass: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    hoverClass: 'hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400',
  },
  {
    value: 'debugging',
    label: 'Debugging',
    activeClass: 'bg-red-500/10 border-red-500/30 text-red-400',
    hoverClass: 'hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400',
  },
  {
    value: 'qa-workflow',
    label: 'QA Workflow',
    activeClass: 'bg-green-500/10 border-green-500/30 text-green-400',
    hoverClass: 'hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400',
  },
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
      {CATEGORIES.map(({ value, label, activeClass, hoverClass }) => (
        <button
          key={value}
          onClick={() => handleSelect(value)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-colors ${
            current === value
              ? activeClass
              : `bg-transparent border-border text-text-muted ${hoverClass}`
          }`}
          aria-pressed={current === value}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
