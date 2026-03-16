import { describe, it } from 'vitest'

describe('notion data layer', () => {
  describe('getAllPosts (NOTI-01)', () => {
    it.todo('returns an array of BlogPost objects mapped from Notion pages')
    it.todo('fetches all pages when has_more is true (pagination cursor loop)')
    it.todo('returns local /notion-images/ paths, never raw Notion file URLs, for cover images')
    it.todo('filters to Status === "Published" only')
    it.todo('sorts posts by Date descending')
  })

  describe('getPostBySlug (NOTI-01)', () => {
    it.todo('returns the correct BlogPost for a matching slug')
    it.todo('returns undefined for an unknown slug')
    it.todo('fetches block children recursively (has_children toggle blocks)')
  })
})
