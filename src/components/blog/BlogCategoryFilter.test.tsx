import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import BlogCategoryFilter from './BlogCategoryFilter'
import BlogList from './BlogList'
import type { BlogPost, BlogBlock } from '@/lib/blog-types'

// Mock next/navigation
const mockPush = vi.fn()
let mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}))

beforeEach(() => {
  mockPush.mockClear()
  mockSearchParams = new URLSearchParams()
})

// Minimal BlogPost factory for tests
function makePost(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    slug: 'test-post',
    title: 'Test Post',
    date: '2025-01-01',
    excerpt: 'An excerpt',
    content: [] as BlogBlock[],
    ...overrides,
  }
}

// ─── BlogCategoryFilter ─────────────────────────────────────────────

describe('BlogCategoryFilter (PROJ-05)', () => {
  it('renders all four category pills', () => {
    render(<BlogCategoryFilter />)
    expect(screen.getByText('All')).toBeDefined()
    expect(screen.getByText('Projects')).toBeDefined()
    expect(screen.getByText('Articles')).toBeDefined()
    expect(screen.getByText('Recommendations')).toBeDefined()
  })

  it('marks "All" as pressed by default when no URL param', () => {
    render(<BlogCategoryFilter />)
    const allBtn = screen.getByText('All')
    expect(allBtn.getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByText('Projects').getAttribute('aria-pressed')).toBe('false')
  })

  it('marks the matching pill as pressed when ?category= is set', () => {
    mockSearchParams = new URLSearchParams('category=Project')
    render(<BlogCategoryFilter />)
    expect(screen.getByText('All').getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByText('Projects').getAttribute('aria-pressed')).toBe('true')
  })
})

// ─── BlogList filtering ─────────────────────────────────────────────

describe('BlogList filtering (PROJ-05)', () => {
  const posts: BlogPost[] = [
    makePost({ slug: 'proj-1', title: 'My Project', category: 'Project' }),
    makePost({ slug: 'art-1', title: 'My Article', category: 'Article' }),
    makePost({ slug: 'rec-1', title: 'My Rec', category: 'Recommendation' }),
  ]

  it('shows all posts when no category param', () => {
    render(<BlogList posts={posts} />)
    expect(screen.getByText('My Project')).toBeDefined()
    expect(screen.getByText('My Article')).toBeDefined()
    expect(screen.getByText('My Rec')).toBeDefined()
  })

  it('filters to projects only when ?category=Project', () => {
    mockSearchParams = new URLSearchParams('category=Project')
    render(<BlogList posts={posts} />)
    expect(screen.getByText('My Project')).toBeDefined()
    expect(screen.queryByText('My Article')).toBeNull()
    expect(screen.queryByText('My Rec')).toBeNull()
  })

  it('shows empty state when filter matches zero posts', () => {
    mockSearchParams = new URLSearchParams('category=Project')
    render(<BlogList posts={[makePost({ slug: 'art-1', title: 'Article Only', category: 'Article' })]} />)
    expect(screen.getByText('No entries found for this category.')).toBeDefined()
  })
})
