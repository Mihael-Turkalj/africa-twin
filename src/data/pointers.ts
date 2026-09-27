// Pointers: a crimson thread from a spot on a separated piece to a paper label. x / y is the spot on the
// piece at rest and lx / ly the label's offset from where that spot ends up, all in % of the bike box.
// Keyed by piece id (see strip.ts); "frame" is the bare frame at step 10, which does not move.
// Labels name what the picture shows; figures come from research/xrv750-rd07.md.

export type Pointer = { x: number; y: number; lx: number; ly: number; text: string }

export const pointers: Record<string, Pointer[]> = {
  '01': [
    { x: 80, y: 33, lx: -3, ly: 20, text: 'Twin headlights' },
    { x: 72, y: 10, lx: -14, ly: -3, text: 'Windscreen' },
    { x: 67.5, y: 37, lx: -16, ly: 12, text: 'Air vent, new in 1993' },
  ],
  '02': [
    { x: 50, y: 34, lx: 20, ly: 10, text: '23 L tank' },
    { x: 27, y: 39, lx: -4, ly: -14, text: 'Seat, 860 mm high' },
    { x: 8, y: 31, lx: 3, ly: 27, text: 'Rack' },
  ],
  '03': [
    { x: 13, y: 55, lx: 4, ly: -16, text: 'One silencer' },
    { x: 31, y: 73, lx: 10, ly: 12, text: 'Exhaust pipe' },
  ],
  // the wheels turn as they roll: tyre spots start at the top of the tyre, disc spots at the axle
  '04a': [
    { x: 17.84, y: 57, lx: 6, ly: -26, text: '17 in rear, 140/80R17 radial' },
    { x: 17.84, y: 76.21, lx: 18, ly: -14, text: '256 mm rear disc' },
  ],
  '04b': [
    { x: 81.91, y: 55, lx: -8, ly: -24, text: '21 in front, 90/90-21' },
    { x: 81.91, y: 76.58, lx: -12, ly: -6, text: 'One of two 276 mm discs' },
  ],
  '05': [
    { x: 17, y: 70, lx: -4, ly: 18, text: 'Rear caliper' },
    { x: 25, y: 69, lx: 14, ly: 14, text: 'Brake hose' },
  ],
  '06': [
    { x: 49, y: 22, lx: -6, ly: -16, text: 'Wide bars' },
    { x: 73, y: 24, lx: -2, ly: -16, text: 'Instruments' },
    { x: 74, y: 70, lx: -14, ly: 24, text: '43 mm fork, 220 mm travel' },
  ],
  '07': [
    { x: 20, y: 76, lx: 4, ly: 12, text: 'Aluminium swingarm' },
    { x: 35, y: 79, lx: 18, ly: 4, text: 'Pro-Link linkage' },
  ],
  '08': [
    { x: 67, y: 51, lx: -8, ly: -18, text: 'Radiator, one each side' },
    { x: 54, y: 59, lx: -12, ly: 16, text: 'Coolant hose' },
  ],
  '09a': [
    { x: 55, y: 56, lx: 18, ly: 4, text: '742 cc 52° V-twin' },
    { x: 55, y: 73, lx: 16, ly: 8, text: 'Aluminium bash plate' },
  ],
  '09b': [{ x: 52, y: 40, lx: -14, ly: -8, text: 'Airbox, 7.0 L' }],
  '09c': [{ x: 31, y: 57, lx: -8, ly: 14, text: 'Battery, 12 V 14 Ah' }],
  frame: [
    { x: 68, y: 30, lx: 10, ly: -12, text: 'Steering head' },
    { x: 52, y: 44, lx: -10, ly: -22, text: 'Square-section steel' },
    { x: 50, y: 79, lx: 8, ly: 16, text: 'Semi-double cradle' },
    { x: 14, y: 45, lx: -4, ly: -18, text: 'Rear subframe' },
  ],
}

export const MAX_POINTERS = 4
