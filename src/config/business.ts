// ----------------------------------------------------------------------------
// Business details and commercial terms.
// Every value marked TBC is a placeholder. Replace it with the real detail;
// the site shows a visible "To be confirmed" label wherever `tbc` is true.
// Do not put invented figures here — leave `value` empty until it is real.
// ----------------------------------------------------------------------------

export interface Detail {
  value: string
  tbc: boolean
}

const TBC: Detail = { value: '', tbc: true }

export const business = {
  name: 'Aapnu Safar',
  tagline: 'Your Family. Our Responsibility.',
  contact: {
    whatsapp: TBC, // e.g. +91 98xxx xxxxx
    phone: TBC,
    email: TBC,
    baseCity: TBC, // e.g. Vadodara
    hours: TBC, // office / response hours (IST)
  },
  social: {
    instagram: '', // full URL; hidden when empty
    facebook: '',
  },
  /** Enquiry API base URL. Empty = clearly labelled mock submission. */
  apiBaseUrl: import.meta.env.VITE_ENQUIRY_API_URL ?? '',
} as const

/**
 * How each commercial term works. `how` is safe, non-numeric wording that is true
 * of the review-and-quote model. `detail` holds the real figure/policy once supplied.
 */
export const terms: { id: string; title: string; how: string; detail: Detail }[] = [
  {
    id: 'exclusive',
    title: 'Exclusive to your family',
    how: 'The vehicle and driver are reserved for one family for the agreed dates. We never add unrelated passengers.',
    detail: { value: '', tbc: false },
  },
  {
    id: 'dates-hours',
    title: 'Agreed service dates and hours',
    how: 'Your quotation states the service dates and the daily service hours. Travel outside these is discussed with you first.',
    detail: TBC,
  },
  {
    id: 'km-limits',
    title: 'Daily usage and kilometre allowance',
    how: 'Each quotation includes a daily kilometre allowance based on your itinerary.',
    detail: TBC,
  },
  {
    id: 'extras',
    title: 'Extra kilometres and hours',
    how: 'If the journey runs beyond the agreed allowance, extra kilometres and hours are charged at rates stated in your quotation — never at rates you have not seen.',
    detail: TBC,
  },
  {
    id: 'tolls',
    title: 'Tolls, parking, permits and accommodation',
    how: 'Your quotation lists clearly whether tolls, parking, state permits and the driver’s accommodation are included or paid separately.',
    detail: TBC,
  },
  {
    id: 'driver-rest',
    title: 'Driver rest and overnight stays',
    how: 'For overnight and multi-day journeys, driver rest and accommodation are planned into the itinerary for safety.',
    detail: TBC,
  },
  {
    id: 'changes',
    title: 'Changes to your itinerary',
    how: 'Plans change. Tell us as early as you can; we review the change and confirm any difference in cost before it applies.',
    detail: TBC,
  },
  {
    id: 'payment-cancellation',
    title: 'Payment and cancellation',
    how: 'Your booking is confirmed only after you accept the quotation and the agreed payment is received. Cancellation terms are shared with the quotation.',
    detail: TBC,
  },
]

/** Link targets for contact details (empty when not yet confirmed). */
export const contactLinks = {
  whatsapp: `https://wa.me/${business.contact.whatsapp.value.replace(/\D/g, '')}`,
  phone: `tel:${business.contact.phone.value.replace(/\s/g, '')}`,
  email: `mailto:${business.contact.email.value}`,
}
