'use client'

import { useSyncExternalStore } from 'react'

// Hydration later than this (ms since navigation start) means the server HTML
// has already been on screen for a while; re-hiding it to play an entrance
// animation would read as a blink rather than a reveal.
const SLOW_HYDRATION_MS = 1800

interface NetworkInformation {
  saveData?: boolean
  effectiveType?: string
}

let slow: boolean | undefined

// Measured once, on the first client render after hydration, then cached so
// every component agrees and the answer never flips mid-session.
function detect(): boolean {
  if (slow === undefined) {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
    slow =
      performance.now() > SLOW_HYDRATION_MS ||
      Boolean(connection?.saveData) ||
      ['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '')
  }
  return slow
}

const subscribe = () => () => {}

// True on slow devices/connections (late hydration, Data Saver, 2G/3G), so
// entrance animations can be skipped there. False during SSR and hydration.
export function useSlowStart() {
  return useSyncExternalStore(subscribe, detect, () => false)
}
