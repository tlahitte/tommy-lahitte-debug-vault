import Link from 'next/link'
import type { Tip } from '@/lib/types'

interface Props {
  tips: Tip[]
}

export default function RelatedTips({ tips }: Props) {
  if (tips.length === 0) return null

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h2 className="text-lg font-bold text-text-primary mb-4 font-display">
        Related Tips
      </h2>
      <div className="grid gap-3">
        {tips.map((tip) => (
          <Link
            key={tip.slug}
            href={`/tips/${tip.slug}/`}
            className="group flex items-start gap-3 rounded-lg border border-border p-4 hover:border-accent/40 hover:bg-surface-raised transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                {tip.title}
              </p>
              <p className="text-xs text-text-muted mt-1 line-clamp-2">
                {tip.summary}
              </p>
            </div>
            <svg
              className="shrink-0 mt-0.5 text-text-muted group-hover:text-accent transition-colors"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  )
}
