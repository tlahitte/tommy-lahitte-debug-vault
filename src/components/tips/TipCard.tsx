import Link from 'next/link'
import type { Tip } from '@/lib/types'
import CategoryBadge from './CategoryBadge'
import Tag from '@/components/ui/Tag'

interface TipCardProps {
  tip: Tip
}

export default function TipCard({ tip }: TipCardProps) {
  return (
    <Link
      href={`/tips/${tip.slug}/`}
      className="group flex flex-col rounded-xl bg-surface-raised p-6 hover:scale-[1.015] hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <CategoryBadge category={tip.category} />
        <time
          dateTime={tip.publishedAt}
          className="text-xs text-text-muted shrink-0 mt-0.5"
        >
          {new Date(tip.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </div>
      <h2 className="text-base font-semibold text-text-primary mb-2 leading-snug group-hover:text-accent transition-colors duration-300">
        {tip.title}
      </h2>
      <p className="text-sm text-text-muted leading-relaxed flex-1 mb-4">{tip.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        {tip.tags.slice(0, 4).map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
    </Link>
  )
}
