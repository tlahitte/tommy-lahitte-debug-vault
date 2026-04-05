import Image from 'next/image'

interface Props {
  src: string
  alt: string
  width: number
  height: number
  sizes: string
}

export default function ChromaticAvatar({ src, alt, width, height, sizes }: Props) {
  return (
    <div
      className="relative w-full aspect-square rounded-full overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className="w-full h-full object-cover grayscale brightness-[1.2] contrast-[0.9]"
        priority
        draggable={false}
      />
    </div>
  )
}
