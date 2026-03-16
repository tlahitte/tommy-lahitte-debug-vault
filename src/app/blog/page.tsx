import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'What Tommy Lahitte is currently working on, from stage tech to game QA.',
  alternates: {
    canonical: 'https://tommylahitte.com/blog/',
  },
  openGraph: {
    title: 'Blog | Tommy Lahitte',
    description: 'What Tommy Lahitte is currently working on, from stage tech to game QA.',
    url: 'https://tommylahitte.com/blog/',
    type: 'website',
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <>
      {/* Page header — kraft visual identity */}
      <section className="relative overflow-hidden bg-surface-raised border-b border-border -mt-14">
        <div
          className="absolute top-0 inset-x-0 h-96 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,90,58,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-[5.5rem] sm:pt-[6.5rem] pb-16">
          <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">Writing</h1>
          <p className="text-text-muted">Things I am currently working on.</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-32 pt-8">
        <div className="divide-y divide-border flex flex-col">
          {posts.map((post) => (
            <article key={post.slug} className="py-8 first:pt-0">
              <a href={`/blog/${post.slug}`} className="group block">
                {post.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image}
                    alt={post.imageAlt ?? post.title}
                    className="w-full rounded-lg mb-4 aspect-[16/6] object-cover"
                  />
                )}
                <p className="text-sm text-text-muted mb-1">{post.date}</p>
                <h2 className="text-xl font-semibold text-text-primary group-hover:text-accent transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-base text-text-muted leading-relaxed">{post.excerpt}</p>
                {post.link && (
                  <span className="inline-block mt-3 text-sm text-accent underline">
                    {post.link.label}
                  </span>
                )}
              </a>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
