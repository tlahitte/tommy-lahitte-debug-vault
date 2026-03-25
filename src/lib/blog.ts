import type { PageObjectResponse, BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { notion } from './notion'
import { downloadNotionImage } from '@/scripts/download-notion-images'
import type { BlogPost, BlogBlock, RichTextItem, PostCategory, ProjectStatus } from './blog-types'

// Notion client v5 moved databases.query to dataSources.query with a newer API version.
// The database may not be migrated yet, so we use a direct fetch as a compatible bridge.
async function queryNotionDatabase(databaseId: string, body: Record<string, unknown>) {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Notion query failed: ${res.status} ${await res.text()}`)
  return res.json() as Promise<{ results: PageObjectResponse[]; has_more: boolean; next_cursor: string | null }>
}

// ─── Rich text mapper ─────────────────────────────────────────────────────

function mapRichText(items: { plain_text: string; href?: string | null; annotations: { bold: boolean; italic: boolean; code: boolean; strikethrough: boolean; underline: boolean } }[]): RichTextItem[] {
  return items.map((item) => ({
    plain_text: item.plain_text,
    href: item.href ?? null,
    annotations: {
      bold: item.annotations.bold,
      italic: item.annotations.italic,
      code: item.annotations.code,
      strikethrough: item.annotations.strikethrough,
      underline: item.annotations.underline,
    },
  }))
}

// ─── Block mapper ─────────────────────────────────────────────────────────

async function mapNotionBlock(block: BlockObjectResponse & { children?: BlogBlock[] }): Promise<BlogBlock | null> {
  switch (block.type) {
    case 'paragraph':
      return { type: 'paragraph', richText: mapRichText(block.paragraph.rich_text) }
    case 'heading_1':
      return { type: 'heading_1', richText: mapRichText(block.heading_1.rich_text) }
    case 'heading_2':
      return { type: 'heading_2', richText: mapRichText(block.heading_2.rich_text) }
    case 'heading_3':
      return { type: 'heading_3', richText: mapRichText(block.heading_3.rich_text) }
    case 'code':
      return {
        type: 'code',
        richText: mapRichText(block.code.rich_text),
        language: block.code.language ?? 'plain text',
      }
    case 'callout': {
      const icon = block.callout.icon?.type === 'emoji' ? block.callout.icon.emoji : undefined
      return { type: 'callout', richText: mapRichText(block.callout.rich_text), icon }
    }
    case 'bulleted_list_item':
      return { type: 'bulleted_list_item', richText: mapRichText(block.bulleted_list_item.rich_text) }
    case 'numbered_list_item':
      return { type: 'numbered_list_item', richText: mapRichText(block.numbered_list_item.rich_text) }
    case 'image': {
      const img = block.image
      let url: string
      if (img.type === 'external') {
        url = img.external.url
      } else {
        // file.type === 'file' — download to /public/notion-images/
        url = await downloadNotionImage(img.file.url, block.id)
      }
      return {
        type: 'image',
        url,
        caption: mapRichText(img.caption),
      }
    }
    case 'toggle':
      return {
        type: 'toggle',
        richText: mapRichText(block.toggle.rich_text),
        children: block.children ?? [],
      }
    case 'divider':
      return { type: 'divider' }
    default:
      return null // NOTI-03: silent fallback for unsupported blocks
  }
}

// ─── Block children fetcher (recursive) ──────────────────────────────────

export async function getBlocksWithChildren(blockId: string): Promise<BlogBlock[]> {
  const allBlocks: (BlockObjectResponse & { children?: BlogBlock[] })[] = []
  let cursor: string | undefined = undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    })
    const blocks = response.results as BlockObjectResponse[]

    for (const block of blocks) {
      if (block.has_children) {
        const children = await getBlocksWithChildren(block.id)
        allBlocks.push({ ...block, children } as BlockObjectResponse & { children?: BlogBlock[] })
      } else {
        allBlocks.push(block as BlockObjectResponse & { children?: BlogBlock[] })
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  const mapped = await Promise.all(allBlocks.map((b) => mapNotionBlock(b)))
  return mapped.filter((b): b is BlogBlock => b !== null)
}

// ─── Page property mapper ─────────────────────────────────────────────────

async function mapNotionPageToBlogPost(page: PageObjectResponse): Promise<Omit<BlogPost, 'content'>> {
  const props = page.properties

  const title =
    props['Title']?.type === 'title'
      ? props['Title'].title.map((r) => r.plain_text).join('')
      : ''

  const slug =
    props['Slug']?.type === 'rich_text'
      ? props['Slug'].rich_text.map((r) => r.plain_text).join('')
      : page.id

  const date =
    props['Date']?.type === 'date' ? props['Date'].date?.start ?? '' : ''

  const excerpt =
    props['Excerpt']?.type === 'rich_text'
      ? props['Excerpt'].rich_text.map((r) => r.plain_text).join('')
      : ''

  // Cover image: download if Notion-hosted (file), use directly if external
  let image: string | undefined
  if (props['Cover']?.type === 'files' && props['Cover'].files.length > 0) {
    const file = props['Cover'].files[0]
    if (file.type === 'external') {
      image = file.external.url
    } else if (file.type === 'file') {
      image = await downloadNotionImage(file.file.url, `${page.id}-cover`)
    }
  }

  // Optional CTA link
  const linkUrl =
    props['ExternalLink']?.type === 'url' ? props['ExternalLink'].url ?? undefined : undefined
  const linkLabel =
    props['ExternalLinkLabel']?.type === 'rich_text'
      ? props['ExternalLinkLabel'].rich_text.map((r) => r.plain_text).join('')
      : undefined
  const link =
    linkUrl && linkLabel ? { url: linkUrl, label: linkLabel } : undefined

  // Category select (Project | Article | Recommendation)
  const category =
    props['Category']?.type === 'select'
      ? (props['Category'].select?.name as PostCategory | undefined)
      : undefined

  // ProjectStatus select — named 'ProjectStatus' in Notion to avoid collision with publish-gate 'Status'
  const status =
    props['ProjectStatus']?.type === 'select'
      ? (props['ProjectStatus'].select?.name as ProjectStatus | undefined)
      : undefined

  // Gallery files — download each at build time (Notion URLs expire in 1h)
  const gallery: string[] = []
  if (props['Gallery']?.type === 'files') {
    for (let i = 0; i < props['Gallery'].files.length; i++) {
      const file = props['Gallery'].files[i]
      if (file.type === 'external') {
        gallery.push(file.external.url)
      } else if (file.type === 'file') {
        const localPath = await downloadNotionImage(file.file.url, `${page.id}-gallery-${i}`)
        gallery.push(localPath)
      }
    }
  }

  return { slug, title, date, excerpt, image, link, category, status, gallery: gallery.length > 0 ? gallery : undefined }
}

// ─── Public DAL ──────────────────────────────────────────────────────────

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID ?? ''

// getAllPosts returns metadata only (content: []).
// Full content is fetched per-page by getPostBySlug at build time via generateStaticParams.
// This is a static export site — Notion is only queried during `next build`, never at runtime.
// Netlify rebuilds are triggered by a 6am cron that calls a build hook.
export async function getAllPosts(): Promise<BlogPost[]> {
  if (!NOTION_DATABASE_ID) return []

  try {
    const results: PageObjectResponse[] = []
    let cursor: string | undefined = undefined

    do {
      const response = await queryNotionDatabase(NOTION_DATABASE_ID, {
        filter: {
          property: 'Status',
          select: { equals: 'Published' },
        },
        sorts: [{ property: 'Date', direction: 'descending' }],
        start_cursor: cursor,
      })
      results.push(...response.results)
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
    } while (cursor)

    return Promise.all(
      results.map(async (page) => {
        const meta = await mapNotionPageToBlogPost(page)
        return { ...meta, content: [] as BlogBlock[] }
      })
    )
  } catch (err) {
    console.error('[blog] Failed to fetch posts from Notion:', err)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!NOTION_DATABASE_ID) return undefined

  try {
    const response = await queryNotionDatabase(NOTION_DATABASE_ID, {
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

    const meta = await mapNotionPageToBlogPost(page)
    const content = await getBlocksWithChildren(page.id)
    return { ...meta, content }
  } catch (err) {
    console.error(`[blog] Failed to fetch post "${slug}" from Notion:`, err)
    return undefined
  }
}
