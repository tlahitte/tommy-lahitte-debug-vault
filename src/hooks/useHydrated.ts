'use client'

import { useSyncExternalStore } from 'react'

// Returns false during SSR and on the first client render (before hydration),
// then true after hydration completes. Used to skip Framer Motion `initial`
// states that would otherwise ship opacity:0 in the SSR HTML, blocking LCP.
const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export function useHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
