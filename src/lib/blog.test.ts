import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockQuery, mockDownload } = vi.hoisted(() => {
  return {
    mockQuery: vi.fn(),
    mockDownload: vi.fn().mockResolvedValue('/notion-images/cover-id.jpg'),
  }
})

vi.mock('@notionhq/client', () => {
  function MockClient() {
    return {
      databases: { query: mockQuery },
      blocks: { children: { list: vi.fn() } },
    }
  }
  return { Client: MockClient }
})

vi.mock('server-only', () => ({}))
vi.mock('@/scripts/download-notion-images', () => ({
  downloadNotionImage: mockDownload,
}))

import { getAllPosts } from './blog'

function makeMockPage(props: Record<string, unknown> = {}) {
  return {
    id: 'page-id-abc',
    object: 'page',
    properties: {
      Title: { type: 'title', title: [{ plain_text: 'My Article' }] },
      Slug: { type: 'rich_text', rich_text: [{ plain_text: 'my-article' }] },
      Status: { type: 'select', select: { name: 'Published' } },
      Date: { type: 'date', date: { start: '2024-06-10' } },
      Excerpt: { type: 'rich_text', rich_text: [{ plain_text: 'Short excerpt.' }] },
      Cover: { type: 'files', files: [] },
      ExternalLink: { type: 'url', url: null },
      ExternalLinkLabel: { type: 'rich_text', rich_text: [] },
      ...props,
    },
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('mapNotionPageToBlogPost (NOTI-04)', () => {
  it('extracts slug from Slug rich_text property', async () => {
    const page = makeMockPage({ Slug: { type: 'rich_text', rich_text: [{ plain_text: 'my-custom-slug' }] } })
    mockQuery.mockResolvedValueOnce({ results: [page], has_more: false, next_cursor: null })

    const posts = await getAllPosts()

    expect(posts[0].slug).toBe('my-custom-slug')
  })

  it('extracts title from Title title property', async () => {
    const page = makeMockPage({ Title: { type: 'title', title: [{ plain_text: 'Great Article' }] } })
    mockQuery.mockResolvedValueOnce({ results: [page], has_more: false, next_cursor: null })

    const posts = await getAllPosts()

    expect(posts[0].title).toBe('Great Article')
  })

  it('extracts date from Date date property', async () => {
    const page = makeMockPage({ Date: { type: 'date', date: { start: '2024-12-01' } } })
    mockQuery.mockResolvedValueOnce({ results: [page], has_more: false, next_cursor: null })

    const posts = await getAllPosts()

    expect(posts[0].date).toBe('2024-12-01')
  })

  it('extracts excerpt from Excerpt rich_text property', async () => {
    const page = makeMockPage({ Excerpt: { type: 'rich_text', rich_text: [{ plain_text: 'Detailed excerpt here.' }] } })
    mockQuery.mockResolvedValueOnce({ results: [page], has_more: false, next_cursor: null })

    const posts = await getAllPosts()

    expect(posts[0].excerpt).toBe('Detailed excerpt here.')
  })

  it('maps external cover image URL directly (type: external)', async () => {
    const page = makeMockPage({
      Cover: {
        type: 'files',
        files: [{ type: 'external', external: { url: 'https://example.com/image.jpg' } }],
      },
    })
    mockQuery.mockResolvedValueOnce({ results: [page], has_more: false, next_cursor: null })

    const posts = await getAllPosts()

    expect(posts[0].image).toBe('https://example.com/image.jpg')
  })

  it('downloads Notion-hosted file cover images and returns local path', async () => {
    const page = makeMockPage({
      Cover: {
        type: 'files',
        files: [{ type: 'file', file: { url: 'https://notion.so/expiring-cover', expiry_time: '2025-01-01' } }],
      },
    })
    mockQuery.mockResolvedValueOnce({ results: [page], has_more: false, next_cursor: null })

    const posts = await getAllPosts()

    expect(posts[0].image).toBe('/notion-images/cover-id.jpg')
    expect(posts[0].image).not.toContain('notion.so')
  })
})

describe('slug preservation (BLOG-02)', () => {
  it('"elevenapps-immersive-show-swift" slug is returned when present in Notion DB', async () => {
    const page = makeMockPage({
      Slug: { type: 'rich_text', rich_text: [{ plain_text: 'elevenapps-immersive-show-swift' }] },
      Title: { type: 'title', title: [{ plain_text: 'ElevenApps Immersive Show' }] },
    })
    mockQuery.mockResolvedValueOnce({ results: [page], has_more: false, next_cursor: null })

    const posts = await getAllPosts()

    expect(posts.some((p) => p.slug === 'elevenapps-immersive-show-swift')).toBe(true)
  })

  it('"technical-director-people-person-show" slug is returned when present in Notion DB', async () => {
    const page = makeMockPage({
      Slug: { type: 'rich_text', rich_text: [{ plain_text: 'technical-director-people-person-show' }] },
      Title: { type: 'title', title: [{ plain_text: 'Technical Director' }] },
    })
    mockQuery.mockResolvedValueOnce({ results: [page], has_more: false, next_cursor: null })

    const posts = await getAllPosts()

    expect(posts.some((p) => p.slug === 'technical-director-people-person-show')).toBe(true)
  })
})
