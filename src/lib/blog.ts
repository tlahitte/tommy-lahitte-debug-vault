import type { BlogPost } from './blog-types'
import { allPosts } from '@/content/blog/index'

export function getAllPosts(): BlogPost[] {
  return allPosts
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((post) => post.slug === slug)
}
