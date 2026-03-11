import Link from 'next/link'
import type { Tip } from '@/lib/types'
import CategoryBadge from './CategoryBadge'
import Tag from '@/components/ui/Tag'

interface TipCardProps {
  tip: Tip
}

export default function TipCard({ tip }: TipCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <CategoryBadge category={tip.category} />
        <time
          dateTime={tip.publishedAt}
          className="text-xs text-zinc-500 shrink-0 mt-0.5"
        >
          {new Date(tip.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </div>
      <h2 className="text-base font-semibold text-zinc-100 mb-2 leading-snug">
        <Link
          href={`/tips/${tip.slug}/`}
          className="hover:text-violet-400 transition-colors"
        >
          {tip.title}
        </Link>
      </h2>
      <p className="text-sm text-zinc-400 leading-relaxed flex-1 mb-4">{tip.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        {tip.tags.slice(0, 4).map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
    </article>
  )
}
