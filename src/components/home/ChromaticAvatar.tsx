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
      {/*
        SVG filter chain per channel:
        1. feColorMatrix  — isolate R/G/B channel (all others zeroed)
        2. feTurbulence   — organic noise grid (different freq + seed per channel
                            mimics offset CMYK halftone screens)
        3. feColorMatrix  — desaturate noise to greyscale
        4. feComponentTransfer — threshold alpha to 0|1 (binary halftone dots)
        5. feComposite(in) — mask the channel through the dot grid

        Binary alpha eliminates pre-multiplied-alpha fringing that causes
        the black outline: every pixel is now either fully opaque or fully
        transparent, so mix-blend-mode: screen composites cleanly.
        The dot grid also produces a stippled circular edge as a design bonus.
      */}
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          {/* Red — larger blobs, seed 2 */}
          <filter id="ca-red" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="chan"/>
            <feTurbulence type="turbulence" baseFrequency="0.15 0.15" numOctaves="1" seed="2" stitchTiles="stitch" result="ht"/>
            <feColorMatrix type="saturate" values="0" in="ht" result="ht-grey"/>
            <feComponentTransfer in="ht-grey" result="ht-mask">
              <feFuncR type="discrete" tableValues="1 1"/>
              <feFuncG type="discrete" tableValues="1 1"/>
              <feFuncB type="discrete" tableValues="1 1"/>
              <feFuncA type="discrete" tableValues="0 1"/>
            </feComponentTransfer>
            <feComposite in="chan" in2="ht-mask" operator="in"/>
          </filter>

          {/* Green — medium blobs, seed 7 */}
          <filter id="ca-green" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="chan"/>
            <feTurbulence type="turbulence" baseFrequency="0.20 0.20" numOctaves="1" seed="7" stitchTiles="stitch" result="ht"/>
            <feColorMatrix type="saturate" values="0" in="ht" result="ht-grey"/>
            <feComponentTransfer in="ht-grey" result="ht-mask">
              <feFuncR type="discrete" tableValues="1 1"/>
              <feFuncG type="discrete" tableValues="1 1"/>
              <feFuncB type="discrete" tableValues="1 1"/>
              <feFuncA type="discrete" tableValues="0 1"/>
            </feComponentTransfer>
            <feComposite in="chan" in2="ht-mask" operator="in"/>
          </filter>

          {/* Blue — smaller blobs, seed 13 */}
          <filter id="ca-blue" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="chan"/>
            <feTurbulence type="turbulence" baseFrequency="0.25 0.25" numOctaves="1" seed="13" stitchTiles="stitch" result="ht"/>
            <feColorMatrix type="saturate" values="0" in="ht" result="ht-grey"/>
            <feComponentTransfer in="ht-grey" result="ht-mask">
              <feFuncR type="discrete" tableValues="1 1"/>
              <feFuncG type="discrete" tableValues="1 1"/>
              <feFuncB type="discrete" tableValues="1 1"/>
              <feFuncA type="discrete" tableValues="0 1"/>
            </feComponentTransfer>
            <feComposite in="chan" in2="ht-mask" operator="in"/>
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
