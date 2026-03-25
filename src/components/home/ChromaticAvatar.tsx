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

const CA_OFFSET = 3 // px — chromatic aberration shift
const FRINGE_OPACITY = 0.35 // base opacity for color-fringe layers

export default function ChromaticAvatar({ src, alt, width, height, sizes }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [normX, setNormX] = useState(0.5)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setNormX(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)))
  }, [])

  /* Interactive hover: mouse X controls fringe layer visibility */
  const redFringeOp  = hovering ? FRINGE_OPACITY * Math.max(0, 1 - normX * 2)     : FRINGE_OPACITY
  const blueFringeOp = hovering ? FRINGE_OPACITY * Math.max(0, (normX - 0.5) * 2) : FRINGE_OPACITY

  const spring = { type: 'spring' as const, stiffness: 300, damping: 25 }

  return (
    <>
      {/* SVG filters — channel isolation for fringe layers */}
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <filter id="ca-red" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
          </filter>
          <filter id="ca-blue" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
          </filter>
        </defs>
      </svg>

      <div
        ref={containerRef}
        className="relative w-full aspect-square"
        style={{
          isolation: 'isolate',
          borderRadius: '9999px',
          overflow: 'hidden',
          cursor: 'crosshair',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Base layer — full-color image, no filter, transparent background */}
        <div className="absolute inset-0">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            className="w-full h-full object-cover"
            priority
            draggable={false}
          />
        </div>

        {/* Red fringe — offset left, low opacity, lighten blend */}
        <motion.div
          className="absolute inset-0"
          style={{ filter: 'url(#ca-red)', mixBlendMode: 'lighten' }}
          animate={{ opacity: redFringeOp, x: -CA_OFFSET }}
          transition={spring}
        >
          <Image
            src={src}
            alt=""
            aria-hidden
            width={width}
            height={height}
            sizes={sizes}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </motion.div>

        {/* Blue fringe — offset right, low opacity, lighten blend */}
        <motion.div
          className="absolute inset-0"
          style={{ filter: 'url(#ca-blue)', mixBlendMode: 'lighten' }}
          animate={{ opacity: blueFringeOp, x: CA_OFFSET }}
          transition={spring}
        >
          <Image
            src={src}
            alt=""
            aria-hidden
            width={width}
            height={height}
            sizes={sizes}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </motion.div>

        {/* Halftone dot grid overlay — subtle print texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.4) 0.8px, transparent 0.8px)',
            backgroundSize: '3px 3px',
            mixBlendMode: 'multiply',
          }}
        />
      </div>
    </>
  )
}
