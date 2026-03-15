import type { Category } from '@/lib/types'

interface CategoryBadgeProps {
  category: Category
}

const categoryConfig: Record<Category, { label: string; className: string }> = {
  editor: {
    label: 'Editor',
    className: 'bg-accent/10 text-accent border-accent/30',
  },
  debugging: {
    label: 'Debugging',
    className: 'bg-accent/15 text-accent-hover border-accent/40',
  },
  'qa-workflow': {
    label: 'QA Workflow',
    className: 'bg-surface-raised text-text-muted border-border',
  },
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const { label, className } = categoryConfig[category]
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold border ${className}`}
    >
      {label}
    </span>
  )
}
