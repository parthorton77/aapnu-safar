// Simple equirectangular projection centred on Gujarat, shared by the map geometry build and the map components.
const LON0 = 67.9
const LAT0 = 24.9
const K = 200
const COS = Math.cos((22.5 * Math.PI) / 180)

export const VIEW = { width: 1310, height: 1000 }

export function project(lon: number, lat: number): [number, number] {
  return [(lon - LON0) * K * COS, (LAT0 - lat) * K]
}
