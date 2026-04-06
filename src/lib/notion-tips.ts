import 'server-only'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Category, Tip, TipContent } from './types'
import type { BlogBlock } from './blog-types'
import { getBlocksWithChildren } from './blog'

const NOTION_TIPS_DATABASE_ID = process.env.NOTION_TIPS_DATABASE_ID ?? ''

// ─── Notion query (same pattern as blog.ts) ──────────────────────────────

async function queryNotionTipsDatabase(body: Record<string, unknown>) {
  const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_TIPS_DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Notion tips query failed: ${res.status} ${await res.text()}`)
  return res.json() as Promise<{ results: PageObjectResponse[]; has_more: boolean; next_cursor: string | null }>
}

// ─── Rich text flattener ─────────────────────────────────────────────────

function flattenRichText(richText: { plain_text: string }[]): string {
  return richText.map((r) => r.plain_text).join('')
}

// ─── Notion blocks → TipContent[] ───────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function mapNotionBlocksToTipContent(blocks: BlogBlock[]): TipContent[] {
  const result: TipContent[] = []
  let pendingListItems: string[] = []
  let pendingListType: 'bulleted' | 'numbered' | null = null

  function flushList() {
    if (pendingListItems.length > 0) {
      result.push(
        pendingListType === 'numbered'
          ? { type: 'overview', items: [...pendingListItems] }
          : { type: 'list', items: [...pendingListItems] }
      )
      pendingListItems = []
      pendingListType = null
    }
  }

  for (const block of blocks) {
    if (block.type === 'bulleted_list_item') {
      if (pendingListType === 'numbered') flushList()
      pendingListType = 'bulleted'
      pendingListItems.push(flattenRichText(block.richText))
      continue
    }

    if (block.type === 'numbered_list_item') {
      if (pendingListType === 'bulleted') flushList()
      pendingListType = 'numbered'
      pendingListItems.push(flattenRichText(block.richText))
      continue
    }

    flushList()

    switch (block.type) {
      case 'paragraph': {
        const text = flattenRichText(block.richText)
        if (text) result.push({ type: 'paragraph', text })
        break
      }
      case 'heading_1':
        result.push({ type: 'heading', level: 1, text: flattenRichText(block.richText), id: slugify(flattenRichText(block.richText)) })
        break
      case 'heading_2':
        result.push({ type: 'heading', level: 2, text: flattenRichText(block.richText), id: slugify(flattenRichText(block.richText)) })
        break
      case 'heading_3':
        result.push({ type: 'heading', level: 3, text: flattenRichText(block.richText), id: slugify(flattenRichText(block.richText)) })
        break
      case 'code':
        result.push({ type: 'code', language: block.language, text: flattenRichText(block.richText) })
        break
      case 'callout':
        result.push({ type: 'callout', text: flattenRichText(block.richText) })
        break
      case 'toggle': {
        const text = flattenRichText(block.richText)
        if (text) result.push({ type: 'paragraph', text })
        if (block.children.length > 0) {
          result.push(...mapNotionBlocksToTipContent(block.children))
        }
        break
      }
      // image, divider — skip (not part of TipContent)
    }
  }

  flushList()
  return result
}

// ─── Page property mapper ────────────────────────────────────────────────

const VALID_CATEGORIES = new Set<Category>(['editor', 'debugging', 'qa-workflow', 'performance'])

function mapNotionPageToTip(page: PageObjectResponse): Omit<Tip, 'content'> {
  const props = page.properties

  const title =
    props['Title']?.type === 'title'
      ? props['Title'].title.map((r) => r.plain_text).join('')
      : ''

  const slug =
    props['Slug']?.type === 'rich_text'
      ? props['Slug'].rich_text.map((r) => r.plain_text).join('')
      : page.id

  const rawCategory =
    props['Category']?.type === 'select'
      ? props['Category'].select?.name ?? 'editor'
      : 'editor'
  const category: Category = VALID_CATEGORIES.has(rawCategory as Category)
    ? (rawCategory as Category)
    : 'editor'

  const summary =
    props['Summary']?.type === 'rich_text'
      ? props['Summary'].rich_text.map((r) => r.plain_text).join('')
      : ''

  const tags =
    props['Tags']?.type === 'multi_select'
      ? props['Tags'].multi_select.map((t) => t.name)
      : []

  const publishedAt =
    props['Published At']?.type === 'date'
      ? props['Published At'].date?.start ?? ''
      : ''

  return { slug, title, category, summary, tags, publishedAt }
}

// ─── Public DAL ──────────────────────────────────────────────────────────

export async function getAllNotionTips(): Promise<Tip[]> {
  if (!NOTION_TIPS_DATABASE_ID) return []

  try {
    const results: PageObjectResponse[] = []
    let cursor: string | undefined = undefined

    do {
      const response = await queryNotionTipsDatabase({
        filter: {
          property: 'Status',
          select: { equals: 'Published' },
        },
        sorts: [{ property: 'Published At', direction: 'descending' }],
        start_cursor: cursor,
      })
      results.push(...response.results)
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
    } while (cursor)

    return results.map((page) => {
      const meta = mapNotionPageToTip(page)
      return { ...meta, content: [] as TipContent[] }
    })
  } catch (err) {
    console.error('[notion-tips] Failed to fetch tips from Notion:', err)
    return []
  }
}

export async function getNotionTipBySlug(slug: string): Promise<Tip | undefined> {
  if (!NOTION_TIPS_DATABASE_ID) return undefined

  try {
    const response = await queryNotionTipsDatabase({
      filter: {
        and: [
          { property: 'Status', select: { equals: 'Published' } },
          { property: 'Slug', rich_text: { equals: slug } },
        ],
      },
      page_size: 1,
    })

    const page = response.results[0]
    if (!page) return undefined

    const meta = mapNotionPageToTip(page)
    const blocks = await getBlocksWithChildren(page.id)
    const content = mapNotionBlocksToTipContent(blocks)
    return { ...meta, content }
  } catch (err) {
    console.error(`[notion-tips] Failed to fetch tip "${slug}" from Notion:`, err)
    return undefined
  }
}
