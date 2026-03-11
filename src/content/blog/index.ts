import type { BlogPost } from '@/lib/blog-types'
import { post as peoplePersonShow } from './people-person-show'
import { post as elevenAppsPost } from './elevenlabs-elevenpapps-immersive-show'

export const allPosts: BlogPost[] = [
  elevenAppsPost,
  peoplePersonShow,
]
