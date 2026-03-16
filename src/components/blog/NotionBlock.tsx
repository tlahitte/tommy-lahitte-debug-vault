import React from 'react'
import CodeBlock from '@/components/ui/CodeBlock'
import type { BlogBlock, RichTextItem } from '@/lib/blog-types'

// ─── Rich text renderer ───────────────────────────────────────────────────

export function renderRichText(items: RichTextItem[]): React.ReactNode[] {
  return items.map((item, i) => {
    const { bold, italic, code, strikethrough, underline } = item.annotations
    const text = item.plain_text
    const href = item.href

    let node: React.ReactNode = text

    if (code) {
      node = (
        <code key={i} className="font-mono text-sm bg-surface-raised px-1 rounded">
          {text}
        </code>
      )
    } else {
      const classes = [
        bold ? 'font-semibold' : '',
        italic ? 'italic' : '',
        strikethrough ? 'line-through' : '',
        underline ? 'underline' : '',
      ]
        .filter(Boolean)
        .join(' ')
      node = classes ? (
        <span key={i} className={classes}>
          {text}
        </span>
      ) : (
        text
      )
    }

    if (href) {
      return (
        <a
          key={i}
          href={href}
          className="text-accent underline hover:text-accent-hover"
          target="_blank"
          rel="noopener noreferrer"
        >
          {node}
        </a>
      )
    }

    return node
  })
}

// ─── Block renderer ───────────────────────────────────────────────────────

export function renderBlock(block: BlogBlock, index: number): React.ReactNode {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={index} className="text-base text-text-primary leading-relaxed">
          {renderRichText(block.richText)}
        </p>
      )

    case 'heading_1':
      return (
        <h1 key={index} className="text-3xl font-semibold text-text-primary mt-10 mb-3">
          {renderRichText(block.richText)}
        </h1>
      )

    case 'heading_2':
      return (
        <h2 key={index} className="text-lg font-semibold text-text-primary mt-8 mb-2">
          {renderRichText(block.richText)}
        </h2>
      )

    case 'heading_3':
      return (
        <h3 key={index} className="text-base font-semibold text-text-primary mt-6 mb-1">
          {renderRichText(block.richText)}
        </h3>
      )

    case 'code': {
      const codeText = block.richText.map((r) => r.plain_text).join('')
      return <CodeBlock key={index} code={codeText} language={block.language} />
    }

    case 'callout':
      return (
        <div
          key={index}
          className="bg-surface-raised border border-border rounded-lg px-4 py-3 text-text-primary flex gap-3 items-start"
        >
          {block.icon && (
            <span className="text-xl leading-none flex-shrink-0 pt-0.5">{block.icon}</span>
          )}
          <div>{renderRichText(block.richText)}</div>
        </div>
      )

    case 'bulleted_list_item':
      return (
        <ul key={index} className="list-disc list-outside ml-5 space-y-1 text-text-primary">
          <li>{renderRichText(block.richText)}</li>
        </ul>
      )

    case 'numbered_list_item':
      return (
        <ol key={index} className="list-decimal list-outside ml-5 space-y-1 text-text-primary">
          <li>{renderRichText(block.richText)}</li>
        </ol>
      )

    case 'image':
      return (
        <figure key={index} className="w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.url} alt={block.caption.length > 0 ? block.caption.map(c => c.plain_text).join('') : 'Blog post image'} className="w-full rounded-xl" />
          {block.caption.length > 0 && (
            <figcaption className="text-xs text-text-muted text-center mt-2">
              {renderRichText(block.caption)}
            </figcaption>
          )}
        </figure>
      )

    case 'toggle':
      return (
        <details key={index} className="group">
          <summary className="font-medium text-text-primary cursor-pointer list-none flex items-center gap-2">
            <span className="transition-transform group-open:rotate-90 text-text-muted">▶</span>
            {renderRichText(block.richText)}
          </summary>
          <div className="ml-4 mt-2 space-y-2">
            {block.children.map((child, i) => renderBlock(child, i))}
          </div>
        </details>
      )

    case 'divider':
      return <hr key={index} className="border-t border-border my-8" />

    default:
      // NOTI-03: silent fallback — unknown block types render nothing
      return null
  }
}
