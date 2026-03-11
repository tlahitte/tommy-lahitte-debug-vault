import type { Category } from '@/lib/types'

interface CategoryBadgeProps {
  category: Category
}

const categoryConfig: Record<Category, { label: string; className: string }> = {
  editor: {
    label: 'Editor',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  debugging: {
    label: 'Debugging',
    className: 'bg-red-500/10 text-red-400 border-red-500/30',
  },
  'qa-workflow': {
    label: 'QA Workflow',
    className: 'bg-green-500/10 text-green-400 border-green-500/30',
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
