import { places } from './places'

// Suggestions only — visitors may type any place; everything is reviewed by the team.
export const pickupSuggestions = [
  'Ahmedabad Airport (SVPI)',
  'Vadodara Airport',
  'Surat Airport',
  ...places.map(p => p.name),
]

export const stopSuggestions = [
  ...places.map(p => p.name),
  'Statue of Unity, Ekta Nagar',
  'Laxmi Vilas Palace, Vadodara',
  'Sabarmati Riverfront, Ahmedabad',
  'Adalaj Stepwell',
  'Ahmedabad Airport (SVPI)',
  'Vadodara Airport',
  'Surat Airport',
]
