import type { Tip, TipContent } from '@/lib/types'
import CodeBlock from '@/components/ui/CodeBlock'
import Tag from '@/components/ui/Tag'
import CategoryBadge from './CategoryBadge'

function renderBlock(block: TipContent, index: number) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={index} className="text-zinc-300 leading-relaxed">
          {block.text}
        </p>
      )
    case 'heading': {
      const level = block.level ?? 2
      if (level === 1) {
        return (
          <h1 key={index} className="text-2xl font-bold text-zinc-100 mt-8 mb-3">
            {block.text}
          </h1>
        )
      }
      if (level === 2) {
        return (
          <h2 key={index} className="text-xl font-semibold text-zinc-100 mt-8 mb-3">
            {block.text}
          </h2>
        )
      }
      return (
        <h3 key={index} className="text-lg font-semibold text-zinc-200 mt-6 mb-2">
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
          className="my-4 rounded-lg border border-violet-500/30 bg-violet-500/5 px-4 py-3 text-sm text-violet-300"
        >
          {block.text}
        </div>
      )
    case 'list':
      return (
        <ul key={index} className="list-disc list-inside space-y-1.5 text-zinc-300 my-3">
          {(block.items ?? []).map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
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
          <time dateTime={tip.publishedAt} className="text-sm text-zinc-500">
            {new Date(tip.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 leading-tight mb-4">
          {tip.title}
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed">{tip.summary}</p>
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
