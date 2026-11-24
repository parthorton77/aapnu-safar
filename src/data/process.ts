export const processSteps = [
  { title: 'Tell us your plans', text: 'Share your travel dates, who is travelling and your day-by-day itinerary. A rough plan is fine.', tag: 'You' },
  { title: 'We review your journey', text: 'We check route distances, service hours, overnight stays and vehicle availability for your dates.', tag: 'Our team' },
  { title: 'Receive your personal quote', text: 'You get a clear quotation based on your actual travel requirements, with nothing hidden.', tag: 'Quotation' },
  { title: 'Confirm your booking', text: 'Once you accept the terms and the agreed payment is made, your booking is confirmed.', tag: 'Agreement' },
  { title: 'Travel with peace of mind', text: 'You receive the vehicle and driver details before the journey, and we stay in touch throughout.', tag: 'On the road' },
]

/** Booking lifecycle, mirrored in EnquiryStatus. */
export const lifecycle = ['Enquiry', 'Itinerary review', 'Quotation sent', 'Accepted', 'Payment', 'Booking confirmed', 'Trip completed']
