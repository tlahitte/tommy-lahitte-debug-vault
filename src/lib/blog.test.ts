import { describe, it } from 'vitest'

describe('mapNotionPageToBlogPost (NOTI-04)', () => {
  it.todo('extracts slug from Slug rich_text property')
  it.todo('extracts title from Title title property')
  it.todo('extracts date from Date date property')
  it.todo('extracts excerpt from Excerpt rich_text property')
  it.todo('maps external cover image URL directly (type: external)')
  it.todo('returns undefined image for file-type cover (handled separately by image downloader)')
})

describe('slug preservation (BLOG-02)', () => {
  it.todo('"elevenapps-immersive-show-swift" slug is preserved in getAllPosts output')
  it.todo('"technical-director-people-person-show" slug is preserved in getAllPosts output')
})
