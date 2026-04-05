'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/* ------------------------------------------------------------------ */
/*  Palette definitions — Apple-inspired                               */
/* ------------------------------------------------------------------ */

interface Palette {
  id: string
  name: string
  swatches: [string, string, string]
  vars: Record<string, string>
}

const palettes: Palette[] = [
  {
    id: 'light',
    name: 'Light',
    swatches: ['#FBFBFD', '#0071E3', '#1D1D1F'],
    vars: {
      '--background': '#FBFBFD',
      '--foreground': '#1D1D1F',
      '--surface': '#FBFBFD',
      '--surface-raised': '#F5F5F7',
      '--text-primary': '#1D1D1F',
      '--text-muted': '#6E6E73',
      '--accent': '#0071E3',
      '--accent-hover': '#0077ED',
      '--border': '#D2D2D7',
      '--aurora-1': '#0071E3',
      '--aurora-2': '#2997FF',
      '--aurora-3': '#0077ED',
      '--aurora-4': '#147CE5',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    swatches: ['#000000', '#2997FF', '#F5F5F7'],
    vars: {
      '--background': '#000000',
      '--foreground': '#F5F5F7',
      '--surface': '#000000',
      '--surface-raised': '#1D1D1F',
      '--text-primary': '#F5F5F7',
      '--text-muted': '#86868B',
      '--accent': '#2997FF',
      '--accent-hover': '#0A84FF',
      '--border': '#424245',
      '--aurora-1': '#2997FF',
      '--aurora-2': '#0A84FF',
      '--aurora-3': '#147CE5',
      '--aurora-4': '#64B5F6',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    swatches: ['#001D3D', '#0A84FF', '#E0E8F0'],
    vars: {
      '--background': '#001D3D',
      '--foreground': '#E0E8F0',
      '--surface': '#001D3D',
      '--surface-raised': '#002B5C',
      '--text-primary': '#E0E8F0',
      '--text-muted': '#7A8DA0',
      '--accent': '#0A84FF',
      '--accent-hover': '#409CFF',
      '--border': '#1A3A5C',
      '--aurora-1': '#0A84FF',
      '--aurora-2': '#409CFF',
      '--aurora-3': '#0071E3',
      '--aurora-4': '#64B5F6',
    },
  },
  {
    id: 'warm',
    name: 'Warm',
    swatches: ['#F5F5F7', '#FF6723', '#1D1D1F'],
    vars: {
      '--background': '#F5F5F7',
      '--foreground': '#1D1D1F',
      '--surface': '#F5F5F7',
      '--surface-raised': '#EBEBED',
      '--text-primary': '#1D1D1F',
      '--text-muted': '#6E6E73',
      '--accent': '#FF6723',
      '--accent-hover': '#E85A1B',
      '--border': '#D2D2D7',
      '--aurora-1': '#FF6723',
      '--aurora-2': '#FF8A50',
      '--aurora-3': '#E85A1B',
      '--aurora-4': '#FF7A3D',
    },
  },
  {
    id: 'mono',
    name: 'Mono',
    swatches: ['#FFFFFF', '#000000', '#6E6E73'],
    vars: {
      '--background': '#FFFFFF',
      '--foreground': '#000000',
      '--surface': '#FFFFFF',
      '--surface-raised': '#F5F5F7',
      '--text-primary': '#000000',
      '--text-muted': '#6E6E73',
      '--accent': '#000000',
      '--accent-hover': '#333333',
      '--border': '#D2D2D7',
      '--aurora-1': '#000000',
      '--aurora-2': '#333333',
      '--aurora-3': '#1D1D1F',
      '--aurora-4': '#555555',
    },
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PaletteToggle() {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState('light')
  const panelRef = useRef<HTMLDivElement>(null)

  const applyPalette = useCallback((palette: Palette) => {
    const root = document.documentElement
    for (const [key, value] of Object.entries(palette.vars)) {
      root.style.setProperty(key, value)
    }
    setActiveId(palette.id)
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 right-0 w-52 rounded-xl border shadow-lg p-3 flex flex-col gap-1.5"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest px-2 pt-1 pb-1" style={{ color: 'var(--text-muted)' }}>
              Color Palette
            </p>
            {palettes.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPalette(p)}
                className="flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors duration-150 w-full text-left"
                style={{
                  backgroundColor: activeId === p.id ? 'var(--surface-raised)' : 'transparent',
                  color: 'var(--text-primary)',
                }}
              >
                <div className="flex -space-x-1">
                  {p.swatches.map((color, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border"
                      style={{
                        backgroundColor: color,
                        borderColor: 'rgba(128,128,128,0.25)',
                        zIndex: 3 - i,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{p.name}</span>
                {activeId === p.id && (
                  <svg className="ml-auto shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-11 h-11 rounded-full border shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          color: 'var(--accent)',
        }}
        aria-label="Toggle color palette"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="8" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="8" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="14" cy="14.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </button>
    </div>
  )
}
