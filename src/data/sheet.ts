// Verified figures for the spec sheet and the sections below the strip-down; see research/xrv750-rd07.md.

export const specRows: { label: string; value: string; note?: string }[] = [
  { label: 'Engine', value: '742 cc liquid-cooled 52° V-twin', note: 'One overhead cam and three valves per cylinder' },
  { label: 'Bore × stroke', value: '81 × 72 mm', note: 'Compression 9.0:1' },
  { label: 'Carburettors', value: 'Two Keihin CV, 36 mm', note: 'MOTORRAD figure' },
  { label: 'Power', value: '60 PS at 7,500 rpm', note: 'European figure; Honda quoted 57 PS in Japan, 58 PS from 1996' },
  { label: 'Torque', value: '62 Nm at 6,000 rpm', note: 'European figure' },
  { label: 'Gearbox', value: 'Five speeds, chain drive' },
  { label: 'Frame', value: 'Steel box-section semi-double cradle' },
  { label: 'Front fork', value: '43 mm, 220 mm travel', note: 'Air-assisted 1993–95' },
  { label: 'Rear suspension', value: 'Pro-Link, about 214 mm travel', note: 'European figure' },
  { label: 'Brakes', value: '2 × 276 mm front, 256 mm rear' },
  { label: 'Tyres', value: '90/90-21 front, 140/80R17 rear' },
  { label: 'Wheelbase', value: '1,555 mm', note: 'Honda JDM figure; European tables give 1,565 mm' },
  { label: 'Seat height', value: '860 mm', note: 'RD07, European figure; 870 mm from 1996' },
  { label: 'Ground clearance', value: '195 mm' },
  { label: 'Fuel tank', value: '23 litres', note: 'About 5 litres reserve' },
  { label: 'Weight', value: '207 kg dry, 234 kg ready to ride', note: 'Honda JDM figures' },
]

export const dakar = [
  { year: '1986', rider: 'Cyril Neveu', note: 'Gilles Lalay second' },
  { year: '1987', rider: 'Cyril Neveu' },
  { year: '1988', rider: 'Edi Orioli' },
  { year: '1989', rider: 'Gilles Lalay' },
]

export const ownerNotes = [
  { title: 'The engine', body: 'Known for running to six-figure mileages with routine care.' },
  { title: 'The fuel pump', body: 'The best-known weak point; many owners fit an aftermarket pump.' },
  { title: 'The regulator', body: 'A failing regulator/rectifier can boil the battery; a MOSFET unit is the usual upgrade.' },
  { title: 'Corrosion', body: 'Worth checking: the fairing subframe, the frame, the rims at the spoke holes and the silencer.' },
]

export const sources = [
  { label: 'Honda Japan press releases, 1990, 1993 and 1995', href: 'https://global.honda/jp/news/1993/2930322.html' },
  { label: 'Honda: Africa Twin history', href: 'https://global.honda/en/AfricaTwin/history/stories/1993/' },
  { label: 'Honda Racing: the Dakar challenge', href: 'https://honda.racing/rally/post/hondas-dakar-challenge-vol-1' },
  { label: 'MOTORRAD buyer’s guide, 2003', href: 'https://www.motorradonline.de/ratgeber/gebrauchtberatung-honda-africa-twin-leidlose-leidenschaft/' },
  { label: 'MCN review', href: 'https://www.motorcyclenews.com/bike-reviews/honda/xrv750-africa-twin/1989/' },
  { label: 'Adventure Bike Rider: RD07 buyer’s guide', href: 'https://www.adventurebikerider.com/article/the-africa-twin-rd07-buyers-guide/' },
  { label: 'Wikipedia: Honda XRV750', href: 'https://en.wikipedia.org/wiki/Honda_XRV750' },
]
