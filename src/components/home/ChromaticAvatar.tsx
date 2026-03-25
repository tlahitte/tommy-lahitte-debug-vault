'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'

interface Props {
  src: string
  alt: string
  width: number
  height: number
  sizes: string
}

const CA_OFFSET = 2 // px

export default function ChromaticAvatar({ src, alt, width, height, sizes }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [normX, setNormX] = useState(0.5)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setNormX(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)))
  }, [])

  const redOp   = hovering ? Math.max(0, 1 - normX * 2)                    : 1
  const greenOp = hovering ? Math.max(0, 1 - Math.abs(normX - 0.5) * 2)    : 1
  const blueOp  = hovering ? Math.max(0, (normX - 0.5) * 2)                : 1

  const layers = [
    { id: 'ca-red',   opacity: redOp,   x: -CA_OFFSET, ariaAlt: '' },
    { id: 'ca-green', opacity: greenOp, x: 0,           ariaAlt: alt },
    { id: 'ca-blue',  opacity: blueOp,  x: CA_OFFSET,  ariaAlt: '' },
  ]

  const spring = { type: 'spring' as const, stiffness: 300, damping: 25 }

  return (
    <>
      {/* SVG color-matrix filter definitions */}
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <filter id="ca-red">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <filter id="ca-green">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <filter id="ca-blue">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      <div
        ref={containerRef}
        className="relative w-full aspect-square"
        style={{ isolation: 'isolate', borderRadius: '9999px', overflow: 'hidden', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {layers.map(({ id, opacity, x, ariaAlt }) => (
          <motion.div
            key={id}
            className="absolute inset-0"
            style={{ filter: `url(#${id})`, mixBlendMode: 'screen' }}
            animate={{ opacity, x }}
            transition={spring}
          >
            <Image
              src={src}
              alt={ariaAlt}
              aria-hidden={ariaAlt === ''}
              width={width}
              height={height}
              sizes={sizes}
              className="w-full h-full object-cover"
              priority={ariaAlt !== ''}
              draggable={false}
            />
          </motion.div>
        ))}
      </div>
    </>
  )
}
