import type { Tip, TipContent } from '@/lib/types'
import CodeBlock from '@/components/ui/CodeBlock'
import Tag from '@/components/ui/Tag'
import CategoryBadge from './CategoryBadge'

function renderBlock(block: TipContent, index: number) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={index} className="text-text-primary leading-relaxed">
          {block.text}
        </p>
      )
    case 'heading': {
      const level = block.level ?? 2
      if (level === 1) {
        return (
          <h1 key={index} id={block.id} className="text-2xl font-bold text-text-primary mt-8 mb-3">
            {block.text}
          </h1>
        )
      }
      if (level === 2) {
        return (
          <h2 key={index} id={block.id} className="text-xl font-semibold text-text-primary mt-8 mb-3">
            {block.text}
          </h2>
        )
      }
      return (
        <h3 key={index} id={block.id} className="text-lg font-semibold text-text-primary mt-6 mb-2">
          {block.text}
        </h3>
      )
    }
    case 'code':
      return (
        <CodeBlock key={index} code={block.text ?? ''} language={block.language} />
      )
    case 'callout':
      return (
        <div
          key={index}
          className="my-4 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent"
        >
          {block.text}
        </div>
      )
    case 'list':
      return (
        <ul key={index} className="list-disc list-inside space-y-1.5 text-text-primary my-3">
          {(block.items ?? []).map((item, i) => {
            const href = block.itemLinks?.[i]
            return (
              <li key={i} className="leading-relaxed">
                {item}
                {href && (
                  <span className="text-text-muted"> (<a href={href} className="underline underline-offset-2 hover:text-accent transition-colors">{block.itemLinkLabels?.[i] ?? href}</a>)</span>
                )}
              </li>
            )
          })}
        </ul>
      )
    case 'overview':
      return (
        <div key={index} className="my-6 rounded-lg border border-border bg-surface-raised px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">Overview</p>
          <ul className="space-y-2 text-text-primary">
            {(block.items ?? []).map((item, i) => {
              const href = block.itemLinks?.[i]
              return (
                <li key={i} className="flex items-baseline gap-2 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    {item}
                    {href && (
                      <span className="text-text-muted"> (<a href={href} className="underline underline-offset-2 hover:text-accent transition-colors">{block.itemLinkLabels?.[i] ?? href}</a>)</span>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )
    default:
      return null
  }
}

interface TipDetailProps {
  tip: Tip
}

export default function TipDetail({ tip }: TipDetailProps) {
  return (
    <article>
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CategoryBadge category={tip.category} />
          <time dateTime={tip.publishedAt} className="text-sm text-text-muted">
            {new Date(tip.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-4">
          {tip.title}
        </h1>
        <p className="text-lg text-text-muted leading-relaxed">{tip.summary}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {tip.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </header>
      <div className="space-y-4 prose-custom">
        {tip.content.map((block, i) => renderBlock(block, i))}
      </div>
    </article>
  )
}
