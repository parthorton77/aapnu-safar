import { project } from './projection'
import { places, placeById, legs, spur } from '../../data/places'

type Pt = [number, number]

/** Smooth path through points (Catmull–Rom converted to cubic Béziers). */
export function smoothPath(pts: Pt[], tension = 0.5): string {
  if (pts.length < 2) return ''
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3]
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3]
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

const P = (id: string): Pt => project(placeById[id].lon, placeById[id].lat)
const LL = (lon: number, lat: number): Pt => project(lon, lat)

export const markers = places.map(p => ({ ...p, xy: project(p.lon, p.lat) }))

// Main corridor, Ahmedabad → Surat, with a few shaping points so the road reads hand-drawn.
export const corridorPath = smoothPath([
  P('ahmedabad'), LL(72.7, 22.86), P('nadiad'), P('anand'), LL(73.06, 22.42), P('vadodara'),
  LL(73.09, 22.0), P('bharuch'), P('ankleshwar'), LL(72.93, 21.4), P('surat'),
])

export const spurPath = smoothPath([P('vadodara'), LL(73.4, 22.15), LL(73.58, 21.98), P('ekta-nagar')])

/** Shield positions: midpoint of each road group */
export const shields = [
  { label: 'NE 1', xy: LL(72.74, 22.74) },
  { label: 'NH 48', xy: LL(73.12, 21.95) },
  { label: 'via Dabhoi', xy: LL(73.62, 22.16), small: true },
]

export const legLabels = [...legs, spur].map(l => {
  const a = P(l.from), b = P(l.to)
  return { km: l.km, xy: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as Pt, id: `${l.from}-${l.to}` }
})

// Illustrative river courses (hand-placed, approximate — an atlas drawing, not survey data).
export const rivers = [
  { name: 'Narmada', label: LL(73.38, 21.72), d: smoothPath([LL(74.35, 22.02), LL(73.95, 21.92), LL(73.69, 21.83), LL(73.42, 21.79), LL(73.2, 21.74), LL(73.0, 21.68), LL(72.78, 21.64), LL(72.55, 21.62)]) },
  { name: 'Tapi', label: LL(73.45, 21.17), d: smoothPath([LL(74.3, 21.27), LL(73.9, 21.21), LL(73.5, 21.23), LL(73.12, 21.25), LL(72.83, 21.2), LL(72.62, 21.12)]) },
  { name: 'Mahi', label: LL(73.42, 22.78), d: smoothPath([LL(74.05, 23.35), LL(73.7, 23.0), LL(73.4, 22.68), LL(73.1, 22.42), LL(72.85, 22.3), LL(72.62, 22.22)]) },
  { name: 'Sabarmati', label: LL(72.5, 23.45), d: smoothPath([LL(72.95, 24.1), LL(72.75, 23.6), LL(72.6, 23.2), LL(72.56, 22.98), LL(72.45, 22.62), LL(72.32, 22.28)]) },
]

export const seaLabels = [
  { text: 'Arabian Sea', xy: LL(69.6, 21.0), size: 26 },
  { text: 'Gulf of Khambhat', xy: LL(72.05, 21.75), size: 15, rotate: -62 },
  { text: 'Gulf of Kachchh', xy: LL(69.55, 22.62), size: 15 },
]

/** Graticule every degree */
export const graticule = {
  lons: [68, 69, 70, 71, 72, 73, 74].map(lon => ({ lon, x: LL(lon, 0)[0] })),
  lats: [21, 22, 23, 24].map(lat => ({ lat, y: LL(0, lat)[1] })),
}

/** 50 km scale bar length in map units (1° latitude ≈ 111 km) */
export const SCALE_50KM = (50 / 111) * (LL(0, 0)[1] - LL(0, 1)[1])

/** ViewBox framing the service corridor (used for the zoom-in) */
const [x0, y0] = LL(71.95, 23.3)
const [x1, y1] = LL(74.05, 20.95)
export const CORRIDOR_BOX = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
