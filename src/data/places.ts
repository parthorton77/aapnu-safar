import type { PhotoKey } from './photos'

export interface Place {
  id: string
  name: string
  gujarati: string
  lon: number
  lat: number
  /** Which side of the marker the label sits on in the atlas */
  label: 'left' | 'right'
  landmark?: 'statue' | 'palace' | 'arch'
  airport?: boolean
  summary: string
  photo: PhotoKey
  /** Short atlas annotation */
  note: string
}

// Only places inside the stated service corridor. Every journey is still reviewed individually.
export const places: Place[] = [
  {
    id: 'ahmedabad', name: 'Ahmedabad', gujarati: 'અમદાવાદ', lon: 72.5714, lat: 23.0225, label: 'left', landmark: 'arch', airport: true,
    summary: 'India’s first UNESCO World Heritage City. Carved pol houses, the stone jali of Sidi Saiyyed, the Sabarmati riverfront, and for many families, the first hug at the airport.',
    photo: 'ahmedabad-jali', note: 'Arrivals · old city · riverfront',
  },
  {
    id: 'nadiad', name: 'Nadiad', gujarati: 'નડિયાદ', lon: 72.8634, lat: 22.6916, label: 'right',
    summary: 'A town of temples and family homes in Kheda district, and the birthplace of Sardar Vallabhbhai Patel.',
    photo: 'countryside-road', note: 'Kheda district',
  },
  {
    id: 'anand', name: 'Anand', gujarati: 'આણંદ', lon: 72.9289, lat: 22.5645, label: 'left',
    summary: 'The heart of Charotar, home of the Amul cooperative, and of many families who now live overseas.',
    photo: 'countryside-road', note: 'Charotar',
  },
  {
    id: 'vadodara', name: 'Vadodara', gujarati: 'વડોદરા', lon: 73.1812, lat: 22.3072, label: 'right', landmark: 'palace', airport: true,
    summary: 'The former Gaekwad capital, Laxmi Vilas Palace, and the crossroads of the corridor, where the road turns east towards Ekta Nagar.',
    photo: 'vadodara-palace', note: 'Palace city · junction',
  },
  {
    id: 'ekta-nagar', name: 'Ekta Nagar', gujarati: 'એકતા નગર', lon: 73.7191, lat: 21.838, label: 'right', landmark: 'statue',
    summary: 'The Statue of Unity stands on the Narmada near the Sardar Sarovar Dam. It makes a full day out from Vadodara, and is planned around your family’s pace.',
    photo: 'ekta-sunrise', note: 'Statue of Unity · detour',
  },
  {
    id: 'bharuch', name: 'Bharuch', gujarati: 'ભરૂચ', lon: 72.9959, lat: 21.7051, label: 'left',
    summary: 'One of India’s oldest towns, set on the broad Narmada estuary.',
    photo: 'bharuch-narmada', note: 'On the Narmada',
  },
  {
    id: 'ankleshwar', name: 'Ankleshwar', gujarati: 'અંકલેશ્વર', lon: 73.0152, lat: 21.6264, label: 'right',
    summary: 'Just across the Narmada bridges from Bharuch, a busy town on the national highway.',
    photo: 'ankleshwar-bridge', note: 'Across the bridges',
  },
  {
    id: 'surat', name: 'Surat', gujarati: 'સુરત', lon: 72.8311, lat: 21.1702, label: 'left', airport: true,
    summary: 'The city of diamonds and textiles on the Tapi, and the southern end of the corridor.',
    photo: 'surat-skyline', note: 'On the Tapi',
  },
]

export const placeById = Object.fromEntries(places.map(p => [p.id, p])) as Record<string, Place>

/** Road legs drawn on the atlas. Distances are approximate road kilometres, for orientation only. */
export const legs = [
  { from: 'ahmedabad', to: 'nadiad', road: 'NE 1', km: 55 },
  { from: 'nadiad', to: 'anand', road: 'NE 1', km: 20 },
  { from: 'anand', to: 'vadodara', road: 'NE 1', km: 40 },
  { from: 'vadodara', to: 'bharuch', road: 'NH 48', km: 75 },
  { from: 'bharuch', to: 'ankleshwar', road: 'NH 48', km: 10 },
  { from: 'ankleshwar', to: 'surat', road: 'NH 48', km: 65 },
] as const

export const spur = { from: 'vadodara', to: 'ekta-nagar', km: 90 } as const
