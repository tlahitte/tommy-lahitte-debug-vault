export type Category = 'editor' | 'debugging' | 'qa-workflow' | 'performance'

export interface TipContent {
  type: 'paragraph' | 'heading' | 'code' | 'callout' | 'list' | 'overview'
  text?: string
  language?: string
  items?: string[]
  itemLinks?: (string | null)[]
  itemLinkLabels?: (string | null)[]
  level?: 1 | 2 | 3
  id?: string
}

export interface Tip {
  slug: string
  title: string
  category: Category
  summary: string
  tags: string[]
  content: TipContent[]
  publishedAt: string
}
