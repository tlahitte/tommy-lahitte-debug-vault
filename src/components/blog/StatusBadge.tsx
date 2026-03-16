import type { ProjectStatus } from '@/lib/blog-types'

const STATUS_STYLES: Record<ProjectStatus, string> = {
  'In Progress': 'bg-amber-100 text-amber-800 border-amber-300',
  'Complete': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'Archived': 'bg-zinc-100 text-zinc-600 border-zinc-300',
}

interface StatusBadgeProps {
  status: ProjectStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}
