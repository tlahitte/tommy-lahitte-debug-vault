'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const BLOG_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'Project', label: 'Projects' },
  { value: 'Article', label: 'Articles' },
  { value: 'Recommendation', label: 'Recommendations' },
] as const

export default function BlogCategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('category') ?? 'all'

  function handleSelect(value: string) {
    const params = new URLSearchParams()
    if (value !== 'all') params.set('category', value)
    const query = params.toString()
    router.push(`/blog${query ? `?${query}` : ''}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter journal by category">
      {BLOG_CATEGORIES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleSelect(value)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-colors ${
            current === value
              ? 'bg-accent/10 border-accent/30 text-accent'
              : 'bg-transparent border-border text-text-muted hover:bg-accent/10 hover:border-accent/30 hover:text-accent'
          }`}
          aria-pressed={current === value}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
