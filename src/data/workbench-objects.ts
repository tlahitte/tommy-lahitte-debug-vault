import type { CSSProperties } from 'react'

export type WorkbenchItem = {
  id: string
  name: string
  type: 'tool' | 'paper' | 'component' | 'decoration'
  imageSrc: string
  description: string
  side: 'left' | 'right'
  /** Direct CSS position properties — all in vw/vh for viewport-relative placement */
  css: CSSProperties
  rotation: number
  zIndex?: number
}

// Content column is ~600px wide, centered.
// At 1440px viewport: content left edge ≈ 29vw, right edge ≈ 71vw.
// Left items extend past 29vw to overlap; right items start before 71vw.
// Items are fixed-position relative to the viewport.

export const workbenchItems: WorkbenchItem[] = [
  // ─── LEFT SIDE ──────────────────────────────────────────────────────────────
  {
    id: 'jumper-wire-left',
    name: 'Jumper Wires',
    type: 'decoration',
    imageSrc: '/workbench_assets/JumperWire.png',
    description: 'Connecting everything to everything else. The chaos is load-bearing.',
    side: 'left',
    css: { left: '-2vw', top: '3vh', width: '36vw' },
    rotation: -8,
    zIndex: 31,
  },
  {
    id: 'fnirsi-iron',
    name: 'FNIRSI Soldering Pen',
    type: 'tool',
    imageSrc: '/workbench_assets/FNIRSI_Iron.png',
    description: 'USB-C powered. Goes anywhere. Surprisingly capable for its size.',
    side: 'left',
    css: { left: '20vw', top: '5vh', width: '5vw' },
    rotation: 14,
    zIndex: 33,
  },
  {
    id: 'camera',
    name: 'Film Camera',
    type: 'tool',
    imageSrc: '/workbench_assets/Camera.png',
    description: 'Analog photography, the deliberate counterpoint to everything digital.',
    side: 'left',
    css: { left: '2vw', top: '28vh', width: '26vw' },
    rotation: -6,
    zIndex: 32,
  },
  {
    id: 'esp32',
    name: 'ESP32',
    type: 'component',
    imageSrc: '/workbench_assets/ESP32.png',
    description: 'WiFi + Bluetooth in a 5€ package. My go-to for IoT prototypes.',
    side: 'left',
    css: { left: '0vw', top: '55vh', width: '22vw' },
    rotation: 9,
    zIndex: 34,
  },
  {
    id: 'hakko-iron',
    name: 'Hakko Soldering Station',
    type: 'tool',
    imageSrc: '/workbench_assets/HakkoIron_justifyLeft.png',
    description: 'Temperature-controlled. The smell of flux is the smell of problem-solving.',
    side: 'left',
    css: { left: '-1vw', bottom: '4vh', width: '32vw' },
    rotation: -4,
    zIndex: 31,
  },
  {
    id: 'jbod',
    name: 'JBOD Storage',
    type: 'component',
    imageSrc: '/workbench_assets/JBOD.png',
    description: 'Just a Bunch Of Disks. Redundancy is not optional when you have data worth keeping.',
    side: 'left',
    css: { left: '4vw', top: '72vh', width: '24vw' },
    rotation: 4,
    zIndex: 30,
  },

  // ─── RIGHT SIDE ─────────────────────────────────────────────────────────────
  {
    id: 'jumper-wire-corner',
    name: 'Jumper Wires',
    type: 'decoration',
    imageSrc: '/workbench_assets/JumperWire_TopRightCorner.png',
    description: 'Always tangled. Always necessary. There is a second bag somewhere.',
    side: 'right',
    css: { right: '-3vw', top: '-2vh', width: '30vw' },
    rotation: 0,
    zIndex: 31,
  },
  {
    id: '18650-cells',
    name: '18650 Cells',
    type: 'decoration',
    imageSrc: '/workbench_assets/18650Cells.png',
    description: 'High-drain lithium cells. Useful for everything from flashlights to DIY power walls.',
    side: 'right',
    css: { right: '18vw', top: '6vh', width: '11vw' },
    rotation: -14,
    zIndex: 32,
  },
  {
    id: 'camera-rz67',
    name: 'Mamiya RZ67',
    type: 'tool',
    imageSrc: '/workbench_assets/Camera_RZ67.png',
    description: 'Medium format film. Every frame costs something, so you think before you shoot.',
    side: 'right',
    css: { right: '3vw', top: '12vh', width: '16vw' },
    rotation: 9,
    zIndex: 34,
  },
  {
    id: 'raspberry-pi',
    name: 'Raspberry Pi',
    type: 'component',
    imageSrc: '/workbench_assets/RaspberryPi.png',
    description: 'Running a custom media server script. The LED blinks whenever a build passes.',
    side: 'right',
    css: { right: '1vw', top: '42vh', width: '24vw' },
    rotation: -7,
    zIndex: 33,
  },
  {
    id: 'pcb-module',
    name: 'PCB Module',
    type: 'component',
    imageSrc: '/workbench_assets/PCB_module.png',
    description: 'Custom board from a half-finished project. The fun kind of unfinished.',
    side: 'right',
    css: { right: '6vw', top: '64vh', width: '18vw' },
    rotation: 13,
    zIndex: 32,
  },
  {
    id: 'flipper-zero',
    name: 'Flipper Zero',
    type: 'tool',
    imageSrc: '/workbench_assets/FlipperZero.png',
    description: 'Multi-tool for hardware hackers. Reads everything, writes everything.',
    side: 'right',
    css: { right: '-2vw', bottom: '3vh', width: '32vw' },
    rotation: -5,
    zIndex: 31,
  },
]
