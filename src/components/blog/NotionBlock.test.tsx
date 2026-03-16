import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { renderBlock, renderRichText } from './NotionBlock'
import type { BlogBlock, RichTextItem } from '@/lib/blog-types'

// Helper: wrap renderBlock output in a div and render
function renderBlogBlock(block: BlogBlock) {
  const node = renderBlock(block, 0)
  return render(<div>{node}</div>)
}

// ─── Rich text ────────────────────────────────────────────────────────────

describe('renderRichText', () => {
  it('renders plain text without markup', () => {
    const items: RichTextItem[] = [
      { plain_text: 'Hello', href: null, annotations: { bold: false, italic: false, code: false, strikethrough: false, underline: false } },
    ]
    const result = renderRichText(items)
    expect(result[0]).toBe('Hello')
  })

  it('wraps bold text in a span with font-semibold', () => {
    const items: RichTextItem[] = [
      { plain_text: 'Bold', href: null, annotations: { bold: true, italic: false, code: false, strikethrough: false, underline: false } },
    ]
    const { container } = render(<span>{renderRichText(items)}</span>)
    expect(container.querySelector('span.font-semibold')?.textContent).toBe('Bold')
  })

  it('wraps link text in an anchor tag', () => {
    const items: RichTextItem[] = [
      { plain_text: 'Click', href: 'https://example.com', annotations: { bold: false, italic: false, code: false, strikethrough: false, underline: false } },
    ]
    const { container } = render(<span>{renderRichText(items)}</span>)
    const a = container.querySelector('a')
    expect(a?.getAttribute('href')).toBe('https://example.com')
    expect(a?.textContent).toBe('Click')
  })

  it('wraps inline code in a <code> tag with font-mono', () => {
    const items: RichTextItem[] = [
      { plain_text: 'code', href: null, annotations: { bold: false, italic: false, code: true, strikethrough: false, underline: false } },
    ]
    const { container } = render(<span>{renderRichText(items)}</span>)
    expect(container.querySelector('code')?.textContent).toBe('code')
  })
})

// ─── Block types ──────────────────────────────────────────────────────────

describe('NotionBlock renderer (NOTI-02)', () => {
  const rt = (text: string): RichTextItem[] => [
    { plain_text: text, href: null, annotations: { bold: false, italic: false, code: false, strikethrough: false, underline: false } },
  ]

  it('renders paragraph block as <p> with text-text-primary leading-relaxed', () => {
    const { container } = renderBlogBlock({ type: 'paragraph', richText: rt('Hello world') })
    const p = container.querySelector('p')
    expect(p?.classList).toContain('leading-relaxed')
    expect(p?.classList).toContain('text-text-primary')
    expect(p?.textContent).toBe('Hello world')
  })

  it('renders heading_1 as <h1> with text-3xl font-semibold mt-10 mb-3', () => {
    const { container } = renderBlogBlock({ type: 'heading_1', richText: rt('Big heading') })
    const h1 = container.querySelector('h1')
    expect(h1).not.toBeNull()
    expect(h1?.classList).toContain('text-3xl')
    expect(h1?.classList).toContain('font-semibold')
    expect(h1?.classList).toContain('mt-10')
  })

  it('renders heading_2 as <h2> with text-lg font-semibold mt-8 mb-2', () => {
    const { container } = renderBlogBlock({ type: 'heading_2', richText: rt('Section') })
    const h2 = container.querySelector('h2')
    expect(h2).not.toBeNull()
    expect(h2?.classList).toContain('text-lg')
    expect(h2?.classList).toContain('mt-8')
  })

  it('renders heading_3 as <h3> with text-base font-semibold mt-6 mb-1', () => {
    const { container } = renderBlogBlock({ type: 'heading_3', richText: rt('Sub-section') })
    const h3 = container.querySelector('h3')
    expect(h3).not.toBeNull()
    expect(h3?.classList).toContain('text-base')
    expect(h3?.classList).toContain('mt-6')
  })

  it('renders code block with bg-zinc-900 pre element', () => {
    const { container } = renderBlogBlock({ type: 'code', richText: rt('const x = 1'), language: 'typescript' })
    const pre = container.querySelector('pre')
    expect(pre?.classList).toContain('bg-zinc-900')
  })

  it('renders callout with bg-surface-raised border border-border rounded-lg', () => {
    const { container } = renderBlogBlock({ type: 'callout', richText: rt('Note'), icon: '💡' })
    const div = container.querySelector('div.bg-surface-raised')
    expect(div).not.toBeNull()
    expect(div?.classList).toContain('border-border')
    expect(div?.classList).toContain('rounded-lg')
    expect(div?.textContent).toContain('💡')
  })

  it('renders bulleted_list_item as <li> inside <ul class="list-disc list-outside ml-5">', () => {
    const { container } = renderBlogBlock({ type: 'bulleted_list_item', richText: rt('Item') })
    const ul = container.querySelector('ul')
    expect(ul?.classList).toContain('list-disc')
    expect(ul?.classList).toContain('ml-5')
    expect(ul?.querySelector('li')?.textContent).toBe('Item')
  })

  it('renders numbered_list_item as <li> inside <ol class="list-decimal list-outside ml-5">', () => {
    const { container } = renderBlogBlock({ type: 'numbered_list_item', richText: rt('First') })
    const ol = container.querySelector('ol')
    expect(ol?.classList).toContain('list-decimal')
    expect(ol?.classList).toContain('ml-5')
    expect(ol?.querySelector('li')?.textContent).toBe('First')
  })

  it('renders image block with w-full rounded-xl', () => {
    const { container } = renderBlogBlock({ type: 'image', url: '/notion-images/test.jpg', caption: [] })
    const img = container.querySelector('img')
    expect(img?.getAttribute('src')).toBe('/notion-images/test.jpg')
    expect(img?.classList).toContain('rounded-xl')
  })

  it('renders image caption when caption is present', () => {
    const { container } = renderBlogBlock({ type: 'image', url: '/notion-images/test.jpg', caption: rt('A caption') })
    const figcaption = container.querySelector('figcaption')
    expect(figcaption?.textContent).toBe('A caption')
    expect(figcaption?.classList).toContain('text-xs')
    expect(figcaption?.classList).toContain('text-text-muted')
  })

  it('renders toggle as <details>/<summary> with font-medium text-text-primary cursor-pointer', () => {
    const { container } = renderBlogBlock({ type: 'toggle', richText: rt('Toggle title'), children: [] })
    const details = container.querySelector('details')
    const summary = container.querySelector('summary')
    expect(details).not.toBeNull()
    expect(summary?.classList).toContain('cursor-pointer')
    expect(summary?.textContent).toContain('Toggle title')
  })

  it('renders divider as <hr class="border-t border-border my-8">', () => {
    const { container } = renderBlogBlock({ type: 'divider' })
    const hr = container.querySelector('hr')
    expect(hr?.classList).toContain('border-t')
    expect(hr?.classList).toContain('border-border')
    expect(hr?.classList).toContain('my-8')
  })
})

describe('NotionBlock silent fallback (NOTI-03)', () => {
  it('renders null for an unknown block type without throwing', () => {
    const unknown = { type: 'unsupported_type' } as unknown as BlogBlock
    const result = renderBlock(unknown, 0)
    expect(result).toBeNull()
  })

  it('does not throw for a block with empty richText', () => {
    expect(() => renderBlogBlock({ type: 'paragraph', richText: [] })).not.toThrow()
  })
})
