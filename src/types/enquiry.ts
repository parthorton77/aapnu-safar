// Domain types shaped for a future Laravel REST API + PostgreSQL backend.
// Field names are camelCase here; the API layer maps them to snake_case.

export type ContactMethod = 'whatsapp' | 'email' | 'phone'
export type DayType = 'local' | 'intercity' | 'standby'
export type StopKind = 'pickup' | 'destination' | 'sightseeing' | 'overnight' | 'drop'

/** The person arranging the trip — often overseas. */
export interface CustomerDetails {
  name: string
  email: string
  phone: string // WhatsApp / phone, international format
  countryOfResidence: string
  preferredContact: ContactMethod
}

/** The people actually travelling in Gujarat. */
export interface PassengerDetails {
  primaryName: string
  indianPhone: string
  adults: number
  children: number
  luggage: string
  assistance: string // special assistance or family requirements
}

export interface TripDetails {
  startDate: string // ISO date (YYYY-MM-DD)
  endDate: string
  pickupLocation: string
  pickupAddress: string // airport, terminal or address
  arrivalTime: string // HH:mm, approximate
  dropLocation: string
}

export interface ItineraryStop {
  id: string
  kind: StopKind
  place: string
  time: string // approximate, HH:mm or free text
  note: string
}

export interface ItineraryDay {
  id: string
  date: string // derived from trip start where possible
  type: DayType
  stops: ItineraryStop[]
  overnightAt: string
  notes: string
}

export interface ItineraryAttachment {
  name: string
  size: number
  type: string
  /** Uploaded later by the service layer; the File itself is never persisted in drafts. */
  file?: File
}

export interface EnquiryDraft {
  customer: CustomerDetails
  passengers: PassengerDetails
  trip: TripDetails
  days: ItineraryDay[]
  attachment: ItineraryAttachment | null
  additionalNotes: string
  consent: boolean
}

/** Lifecycle — no step is automatic; every transition is a human decision. */
export type EnquiryStatus =
  | 'enquiry'
  | 'itinerary_review'
  | 'quotation_sent'
  | 'accepted'
  | 'payment'
  | 'booking_confirmed'
  | 'trip_completed'
  | 'cancelled'

export interface EnquirySubmission extends Omit<EnquiryDraft, 'attachment'> {
  attachment: Omit<ItineraryAttachment, 'file'> | null
  submittedAt: string
  source: 'website'
}

export interface EnquiryReceipt {
  reference: string
  status: EnquiryStatus // always 'enquiry' on submission
  receivedAt: string
  /** True when no real backend received this — the UI must say so. */
  isMock: boolean
}

// ---- Future backend entities (not used by the first frontend release) ----

export interface QuoteLine {
  label: string // e.g. "Vehicle & driver, 5 days"
  amount: number
}

export interface Quote {
  id: string
  enquiryReference: string
  currency: 'INR'
  lines: QuoteLine[]
  includedKmPerDay: number
  includedHoursPerDay: number
  extraKmRate: number
  extraHourRate: number
  inclusions: string[] // e.g. tolls, parking, driver allowance
  exclusions: string[]
  validUntil: string
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
}

export interface Booking {
  id: string
  quoteId: string
  status: Extract<EnquiryStatus, 'accepted' | 'payment' | 'booking_confirmed' | 'trip_completed' | 'cancelled'>
  vehicle: { model: string; registration: string } | null // shared with the family before travel
  driver: { name: string; phone: string } | null
  payments: { amount: number; paidAt: string; method: string }[]
}
