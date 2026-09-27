// The ten assemblies in workshop order, as on the approved rail. Facts from research/xrv750-rd07.md;
// where Japanese (JDM) and European figures differ, both are named.

export type Assembly = {
  id: string
  label: string
  title: string
  facts: string[]
}

export const assemblies: Assembly[] = [
  {
    id: 'fairing',
    label: 'Fairing',
    title: 'Fairing',
    facts: [
      'Twin headlights in a tall fairing, carried on a steel front subframe.',
      'Redesigned for 1993 with vents that guide air around the engine; the 1996 cowl and screen cut wind on the rider.',
    ],
  },
  {
    id: 'tank-seat',
    label: 'Tank & seat',
    title: 'Tank & seat',
    facts: [
      '23 litres, about 5 of them reserve. The tank sits below the carburettors, so an electric pump lifts the fuel.',
      'The front of the tank hides the airbox, grown from 5.4 to 7.0 litres in 1993.',
      'Seat height 860 mm (European figure) on the RD07, 870 mm from 1996.',
    ],
  },
  {
    id: 'exhaust',
    label: 'Exhaust',
    title: 'Exhaust',
    facts: [
      'Two into one: a front header and a separate rear-cylinder pipe feed a single silencer.',
      'The 1993 silencer gained 1.5 litres of volume yet weighed less; 1996 made it larger again.',
    ],
  },
  {
    id: 'wheels',
    label: 'Wheels',
    title: 'Wheels',
    facts: [
      'Spoked aluminium rims: 21 inches at the front, 17 at the rear.',
      '90/90-21 front tyre and, from 1993, a 140/80R17 radial at the rear.',
    ],
  },
  {
    id: 'brakes',
    label: 'Brakes',
    title: 'Brakes',
    facts: [
      'Twin 276 mm front discs with twin-piston calipers.',
      'A single 256 mm disc at the rear with a single-piston caliper.',
    ],
  },
  {
    id: 'front-fork',
    label: 'Front fork',
    title: 'Front fork',
    facts: [
      '43 mm conventional telescopic fork with 220 mm of travel.',
      'Air-assisted from 1993 to 1995; the 1996 bike dropped the air assist.',
    ],
  },
  {
    id: 'pro-link',
    label: 'Pro-Link',
    title: 'Pro-Link rear suspension',
    facts: [
      'A single shock with a reservoir, worked through Honda’s Pro-Link linkage on an aluminium swingarm.',
      'Preload and compression adjustable until 1995, preload only from 1996. About 214 mm of travel (European figure).',
    ],
  },
  {
    id: 'cooling',
    label: 'Cooling',
    title: 'Cooling',
    facts: [
      'Two radiators, left and right, share one electric fan.',
      'A separate oil cooler has been fitted since 1990. Coolant capacity is 2.03 litres.',
    ],
  },
  {
    id: 'engine',
    label: 'Engine',
    title: 'Engine',
    facts: [
      '742 cc liquid-cooled 52° V-twin, 81 × 72 mm, one overhead cam and three valves per cylinder.',
      'About 60 PS at 7,500 rpm and 62 Nm at 6,000 rpm (European figures), through a five-speed gearbox and chain.',
      'Derived from the Transalp twin, not the NXR750 rally engine, and known to run to six-figure mileages.',
    ],
  },
  {
    id: 'frame',
    label: 'Frame',
    title: 'Frame',
    facts: [
      'A steel box-section semi-double cradle, new for 1993: lighter, with a lower centre of gravity.',
      'Rake 27°30′ and trail 108 mm (Honda figures); 195 mm of ground clearance.',
      '207 kg dry, 234 kg ready to ride (Honda JDM figures).',
    ],
  },
]

export const pad = (n: number) => String(n).padStart(2, '0')
