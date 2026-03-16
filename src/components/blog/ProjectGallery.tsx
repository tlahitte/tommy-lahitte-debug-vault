interface ProjectGalleryProps {
  images: string[]
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  if (images.length === 0) return null

  return (
    <section className="my-10" aria-label="Project gallery">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt={`Project photo ${i + 1}`}
            className="w-full rounded-lg aspect-square object-cover border border-border"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  )
}
