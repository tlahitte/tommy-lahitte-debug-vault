import type { Category } from '@/lib/types'

interface CategoryBadgeProps {
  category: Category
}

const categoryConfig: Record<Category, { label: string; className: string }> = {
  editor: {
    label: 'Editor',
    className: 'bg-[#C85A3A]/15 text-[#C85A3A] border-[#C85A3A]/50',
  },
  debugging: {
    label: 'Debugging',
    className: 'bg-[#B8860B]/15 text-[#B8860B] border-[#B8860B]/50',
  },
  'qa-workflow': {
    label: 'QA Workflow',
    className: 'bg-[#6B7F3A]/15 text-[#6B7F3A] border-[#6B7F3A]/50',
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
