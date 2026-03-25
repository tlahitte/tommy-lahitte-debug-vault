import type { Category, Tip } from './types'
import { allTips } from '@/content/tips/index'

export function getAllTips(): Tip[] {
  return [...allTips].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getTipBySlug(slug: string): Tip | undefined {
  return allTips.find((tip) => tip.slug === slug)
}

export function getTipsByCategory(category: Category): Tip[] {
  return allTips.filter((tip) => tip.category === category)
}

export function getRelatedTips(currentSlug: string, limit = 3): Tip[] {
  const current = allTips.find((t) => t.slug === currentSlug)
  if (!current) return []

  const currentTags = new Set(current.tags)

  return allTips
    .filter((t) => t.slug !== currentSlug)
    .map((t) => ({
      tip: t,
      score:
        t.tags.filter((tag) => currentTags.has(tag)).length * 2 +
        (t.category === current.category ? 1 : 0),
    }))
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((t) => t.tip)
}
