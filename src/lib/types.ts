export type Category = 'editor' | 'debugging' | 'qa-workflow'

export interface TipContent {
  type: 'paragraph' | 'heading' | 'code' | 'callout' | 'list'
  text?: string
  language?: string
  items?: string[]
  level?: 1 | 2 | 3
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
