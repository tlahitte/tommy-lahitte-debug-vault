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

  return <BlogCategoryButtons current={current} onSelect={handleSelect} />
}

// The button row itself, without reading the URL, so the static (pre-JS)
// render of /blog can show it too.
export function BlogCategoryButtons({
  current,
  onSelect,
}: {
  current: string
  onSelect?: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter journal by category">
      {BLOG_CATEGORIES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onSelect?.(value)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-colors ${
            current === value
              ? 'text-accent'
              : 'bg-transparent border-border text-text-muted hover:text-accent'
          }`}
          aria-pressed={current === value}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
