import type { Category, Tip } from './types'
import { allTips } from '@/content/tips/index'

export function getAllTips(): Tip[] {
  return allTips
}

export function getTipBySlug(slug: string): Tip | undefined {
  return allTips.find((tip) => tip.slug === slug)
}

export function getTipsByCategory(category: Category): Tip[] {
  return allTips.filter((tip) => tip.category === category)
}
