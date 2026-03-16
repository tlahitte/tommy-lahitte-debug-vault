import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockQuery, mockBlocksList, mockDownload } = vi.hoisted(() => {
  return {
    mockQuery: vi.fn(),
    mockBlocksList: vi.fn(),
    mockDownload: vi.fn().mockResolvedValue('/notion-images/test-block-id.jpg'),
  }
})

vi.mock('@notionhq/client', () => {
  function MockClient() {
    return {
      databases: { query: mockQuery },
      blocks: { children: { list: mockBlocksList } },
    }
  }
  return { Client: MockClient }
})

vi.mock('server-only', () => ({}))
vi.mock('@/scripts/download-notion-images', () => ({
  downloadNotionImage: mockDownload,
}))

import { getAllPosts, getPostBySlug, getBlocksWithChildren } from './blog'

function makeMockPage(overrides: Record<string, unknown> = {}) {
  return {
    id: 'page-id-123',
    object: 'page',
    properties: {
      Title: {
        type: 'title',
        title: [{ plain_text: 'Test Post' }],
      },
      Slug: {
        type: 'rich_text',
        rich_text: [{ plain_text: 'test-post' }],
      },
      Status: {
        type: 'select',
        select: { name: 'Published' },
      },
      Date: {
        type: 'date',
        date: { start: '2025-01-15' },
      },
      Excerpt: {
        type: 'rich_text',
        rich_text: [{ plain_text: 'A test excerpt.' }],
      },
      Cover: {
        type: 'files',
        files: [],
      },
      ExternalLink: {
        type: 'url',
        url: null,
      },
      ExternalLinkLabel: {
        type: 'rich_text',
        rich_text: [],
      },
      ...overrides,
    },
  }
}

function makeSinglePageResponse(page = makeMockPage()) {
  return {
    results: [page],
    has_more: false,
    next_cursor: null,
  }
}

function makeEmptyResponse() {
  return { results: [], has_more: false, next_cursor: null }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('notion data layer', () => {
  describe('getAllPosts (NOTI-01)', () => {
    it('returns an array of BlogPost objects mapped from Notion pages', async () => {
      mockQuery.mockResolvedValueOnce(makeSinglePageResponse())

      const posts = await getAllPosts()

      expect(posts).toHaveLength(1)
      expect(posts[0].slug).toBe('test-post')
      expect(posts[0].title).toBe('Test Post')
      expect(posts[0].date).toBe('2025-01-15')
      expect(posts[0].excerpt).toBe('A test excerpt.')
      expect(posts[0].content).toEqual([])
    })

    it('fetches all pages when has_more is true (pagination cursor loop)', async () => {
      const page1 = makeMockPage()
      const page2 = {
        ...makeMockPage(),
        id: 'page-id-456',
        properties: {
          ...makeMockPage().properties,
          Slug: { type: 'rich_text', rich_text: [{ plain_text: 'second-post' }] },
        },
      }

      mockQuery
        .mockResolvedValueOnce({ results: [page1], has_more: true, next_cursor: 'cursor-abc' })
        .mockResolvedValueOnce({ results: [page2], has_more: false, next_cursor: null })

      const posts = await getAllPosts()

      expect(mockQuery).toHaveBeenCalledTimes(2)
      expect(posts).toHaveLength(2)
    })

    it('returns local /notion-images/ paths, never raw Notion file URLs, for cover images', async () => {
      const pageWithFileCover = makeMockPage({
        Cover: {
          type: 'files',
          files: [{
            type: 'file',
            file: { url: 'https://notion.so/image/expiring-url', expiry_time: '2025-01-01' },
          }],
        },
      })

      mockQuery.mockResolvedValueOnce(makeSinglePageResponse(pageWithFileCover))

      const posts = await getAllPosts()

      expect(posts[0].image).toBe('/notion-images/test-block-id.jpg')
      expect(posts[0].image).not.toContain('notion.so')
    })

    it('filters to Status === "Published" only', async () => {
      mockQuery.mockResolvedValueOnce(makeEmptyResponse())

      await getAllPosts()

      expect(mockQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: {
            property: 'Status',
            select: { equals: 'Published' },
          },
        })
      )
    })

    it('sorts posts by Date descending', async () => {
      mockQuery.mockResolvedValueOnce(makeEmptyResponse())

      await getAllPosts()

      expect(mockQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          sorts: [{ property: 'Date', direction: 'descending' }],
        })
      )
    })
  })

  describe('getPostBySlug (NOTI-01)', () => {
    it('returns the correct BlogPost for a matching slug', async () => {
      const page = makeMockPage()
      mockQuery
        .mockResolvedValueOnce(makeSinglePageResponse(page)) // getAllPosts call
        .mockResolvedValueOnce(makeSinglePageResponse(page)) // re-query for page id

      mockBlocksList.mockResolvedValueOnce({
        results: [],
        has_more: false,
        next_cursor: null,
      })

      const post = await getPostBySlug('test-post')

      expect(post).toBeDefined()
      expect(post?.slug).toBe('test-post')
      expect(post?.title).toBe('Test Post')
      expect(post?.content).toEqual([])
    })

    it('returns undefined for an unknown slug', async () => {
      mockQuery.mockResolvedValueOnce(makeEmptyResponse())

      const post = await getPostBySlug('non-existent-slug')

      expect(post).toBeUndefined()
    })

    it('fetches block children recursively (has_children toggle blocks)', async () => {
      const parentBlock = {
        id: 'toggle-parent',
        type: 'toggle',
        has_children: true,
        toggle: {
          rich_text: [{
            plain_text: 'Toggle title',
            href: null,
            annotations: { bold: false, italic: false, code: false, strikethrough: false, underline: false },
          }],
        },
        object: 'block',
      }
      const childBlock = {
        id: 'child-para',
        type: 'paragraph',
        has_children: false,
        paragraph: {
          rich_text: [{
            plain_text: 'Child text',
            href: null,
            annotations: { bold: false, italic: false, code: false, strikethrough: false, underline: false },
          }],
        },
        object: 'block',
      }

      mockBlocksList
        .mockResolvedValueOnce({ results: [parentBlock], has_more: false, next_cursor: null })
        .mockResolvedValueOnce({ results: [childBlock], has_more: false, next_cursor: null })

      const blocks = await getBlocksWithChildren('page-id')

      expect(mockBlocksList).toHaveBeenCalledTimes(2)
      expect(blocks).toHaveLength(1)
      expect(blocks[0].type).toBe('toggle')
      if (blocks[0].type === 'toggle') {
        expect(blocks[0].children).toHaveLength(1)
        expect(blocks[0].children[0].type).toBe('paragraph')
      }
    })
  })
})
