export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  image?: string
  imageAlt?: string
  content: BlogBlock[]
  link?: {
    label: string
    url: string
  }
}

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
