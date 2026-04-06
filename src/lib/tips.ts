import type { Category, Tip } from './types'
import { getAllNotionTips, getNotionTipBySlug } from './notion-tips'

export async function getAllTips(): Promise<Tip[]> {
  const tips = await getAllNotionTips()
  return tips.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export async function getTipBySlug(slug: string): Promise<Tip | undefined> {
  return getNotionTipBySlug(slug)
}

export async function getTipsByCategory(category: Category): Promise<Tip[]> {
  const tips = await getAllNotionTips()
  return tips.filter((t) => t.category === category)
}

export async function getRelatedTips(currentSlug: string, limit = 3): Promise<Tip[]> {
  const all = await getAllNotionTips()
  const current = all.find((t) => t.slug === currentSlug)
  if (!current) return []

  const currentTags = new Set(current.tags)

  return all
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
