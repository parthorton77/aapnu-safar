import type { EnquiryDraft } from '../../types/enquiry'
import { localISO } from '../../composables/useEnquiryDraft'

export type Errors = Record<string, string>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const digits = (s: string) => s.replace(/\D/g, '')
const today = () => localISO(new Date())

export const stepTitles = ['Who is arranging', 'Who will travel', 'Trip details', 'Day by day', 'Review & send'] as const

export function validateStep(step: number, d: EnquiryDraft): Errors {
  const e: Errors = {}
  if (step === 0) {
    if (!d.customer.name.trim()) e['customer.name'] = 'Please tell us your name.'
    if (!EMAIL.test(d.customer.email.trim())) e['customer.email'] = 'Please enter a valid email address.'
    if (digits(d.customer.phone).length < 7) e['customer.phone'] = 'Please enter a WhatsApp or phone number, including country code.'
    if (!d.customer.countryOfResidence.trim()) e['customer.countryOfResidence'] = 'Please choose the country you live in.'
  }
  if (step === 1) {
    if (!d.passengers.primaryName.trim()) e['passengers.primaryName'] = 'Please give the name of the main passenger.'
    const ph = digits(d.passengers.indianPhone)
    if (!(ph.length === 10 || (ph.length === 12 && ph.startsWith('91')))) e['passengers.indianPhone'] = 'Please enter a 10-digit Indian mobile number.'
    if (d.passengers.adults < 1) e['passengers.adults'] = 'At least one adult must be travelling.'
    if (d.passengers.children < 0) e['passengers.children'] = 'Number of children cannot be negative.'
  }
  if (step === 2) {
    if (!d.trip.startDate) e['trip.startDate'] = 'Please choose a start date.'
    else if (d.trip.startDate < today()) e['trip.startDate'] = 'The start date is in the past.'
    if (!d.trip.endDate) e['trip.endDate'] = 'Please choose an end date.'
    else if (d.trip.startDate && d.trip.endDate < d.trip.startDate) e['trip.endDate'] = 'The end date is before the start date.'
    if (!d.trip.pickupLocation.trim()) e['trip.pickupLocation'] = 'Where should the journey begin?'
    if (!d.trip.dropLocation.trim()) e['trip.dropLocation'] = 'Where should the journey end?'
  }
  if (step === 3) {
    const hasPlan = d.days.some(day => day.stops.some(s => s.place.trim()))
    if (!hasPlan && !d.attachment) e['days'] = 'Add at least one day with a place, or upload your existing itinerary.'
    d.days.forEach((day, i) => day.stops.forEach((s, j) => {
      if (!s.place.trim() && day.stops.length > 1) e[`days.${i}.stops.${j}`] = 'Add a place, or remove this stop.'
    }))
  }
  if (step === 4) {
    if (!d.consent) e['consent'] = 'Please confirm you understand this is an enquiry, not a booking.'
  }
  return e
}
