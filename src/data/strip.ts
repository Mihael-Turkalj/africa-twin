import pinData from './pins.json'

// How each part leaves the bike. Offsets are % of the bike box (translate is relative to the layer's own
// size, which is the whole box), measured from each part layer's position on the 2360 x 1630 plate.
// A step can move several paper pieces; each turns about its own origin (% of the box, default 50/60).

export type Layer = {
  id: string
  dx: number
  dy: number
  rot: number
  // turning origin, % of the box (default 50 / 60)
  ox?: number
  oy?: number
  // wheels turn on a brass axle pin and need no strut
  axle?: boolean
}

// index = step 1..9; step 10 (the frame) has no layer, the bare frame is what remains.
export const layers: Record<number, Layer[]> = {
  1: [{ id: '01', dx: 9, dy: -22, rot: 4 }], // fairing: up and forward
  2: [{ id: '02', dx: -7, dy: -24, rot: -3 }], // tank & seat: straight up and back
  3: [{ id: '03', dx: -12, dy: -6, rot: -5 }], // exhaust: out to the rear
  4: [
    // the wheels roll apart along the shelf, each turning about its axle by the distance it travels
    { id: '04a', dx: -9, dy: 0, rot: -38, ox: 17.84, oy: 76.21, axle: true },
    { id: '04b', dx: 7, dy: 0, rot: 27, ox: 81.91, oy: 76.58, axle: true },
    { id: '04c', dx: 7, dy: -3, rot: 2 }, // the front fender slides off with its wheel
  ],
  5: [{ id: '05', dx: -6, dy: 11, rot: -6 }], // brakes: down and back
  6: [{ id: '06', dx: 12, dy: -9, rot: 6 }], // front fork: forward
  7: [{ id: '07', dx: -11, dy: 8, rot: -4 }], // Pro-Link: down and back
  8: [{ id: '08', dx: 3, dy: -17, rot: 3 }], // cooling: up
  9: [
    { id: '09a', dx: 0, dy: 13, rot: 0 }, // engine: lowered out of the frame onto the shelf
    { id: '09b', dx: 3, dy: -18, rot: 3 }, // airbox: out through the top
    { id: '09c', dx: -12, dy: -4, rot: -4 }, // battery box: out the back
  ],
}
export const MAX_LAYERS = 3

// What stood in front of a moving piece and stays put (the swingarm and fork over the wheels).
export const occluders: Record<number, string> = { 4: 'occ-04' }

// Where each piece is fastened: the top of its main piece at rest, % of the bike box
// (measured by flight-lab/split_strip_layers.py). The strut runs from here to the lifted piece.
export const pins = pinData as Record<string, { x: number; y: number }>

// The paper name strip pinned to the wall beside each lifted part (desktop), % of the bike box.
// side: which way the strip runs from its pin.
export const tagAnchors: Record<number, { x: number; y: number; side: 'left' | 'right' }> = {
  1: { x: 89, y: 16, side: 'right' },
  2: { x: 57, y: 9, side: 'right' },
  3: { x: 30, y: 34, side: 'right' },
  4: { x: 36, y: 86, side: 'right' },
  5: { x: 43, y: 86, side: 'right' },
  6: { x: 59, y: 9, side: 'left' },
  7: { x: 4, y: 66, side: 'right' },
  8: { x: 75, y: 29, side: 'right' },
  9: { x: 70, y: 58, side: 'right' },
}

export const STEPS = 10

const base = import.meta.env.BASE_URL
// Phones get the half-size strip (1180 px wide); the full 2360 px is only worth it on big, sharp screens.
// index.html preloads the first stage with the same rule.
const size = window.innerWidth * (window.devicePixelRatio || 1) <= 1400 ? '-m' : ''
export const stageUrl = (k: number) => `${base}strip/stage-${String(k).padStart(2, '0')}${size}.webp`
export const partUrl = (id: string) => `${base}strip/part-${id}${size}.webp`
/** The crimson card each piece is cut from, seen at its edge once it lifts off the wall. */
export const backUrl = (id: string) => `${base}strip/back-${id}${size}.webp`
export const occluderUrl = (name: string) => `${base}strip/${name}${size}.webp`

export const referencePhotos = [
  {
    file: '1993 Honda XRV750 Africa Twin RD07 with packbox',
    author: 'Mr.choppers',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:1993_Honda_XRV750_Africa_Twin_RD07_with_packbox.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  {
    file: 'Honda 750 Africa Twin Dakar',
    author: 'MotorideSA',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Honda_750_Africa_Twin_Dakar.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
]
