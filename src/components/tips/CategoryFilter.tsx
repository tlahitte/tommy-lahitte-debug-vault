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
    activeClass: 'bg-[#C85A3A]/15 border-[#C85A3A]/50 text-[#C85A3A]',
    hoverClass: 'hover:bg-[#C85A3A]/15 hover:border-[#C85A3A]/50 hover:text-[#C85A3A]',
  },
  {
    value: 'debugging',
    label: 'Debugging',
    activeClass: 'bg-[#B8860B]/15 border-[#B8860B]/50 text-[#B8860B]',
    hoverClass: 'hover:bg-[#B8860B]/15 hover:border-[#B8860B]/50 hover:text-[#B8860B]',
  },
  {
    value: 'qa-workflow',
    label: 'QA Workflow',
    activeClass: 'bg-[#6B7F3A]/15 border-[#6B7F3A]/50 text-[#6B7F3A]',
    hoverClass: 'hover:bg-[#6B7F3A]/15 hover:border-[#6B7F3A]/50 hover:text-[#6B7F3A]',
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
