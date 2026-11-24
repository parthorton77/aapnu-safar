// Enquiry submission. One interface, two implementations:
//  - HttpEnquiryService: posts to the future Laravel API (POST {base}/enquiries, multipart).
//  - MockEnquiryService: used when no API URL is configured. It stores the enquiry in this
//    browser only and returns isMock: true so the UI can say plainly that nothing was sent.
import { business } from '../config/business'
import type { EnquiryReceipt, EnquirySubmission } from '../types/enquiry'

export interface EnquiryService {
  readonly isMock: boolean
  submit(submission: EnquirySubmission, file?: File): Promise<EnquiryReceipt>
}

const toSnake = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(toSnake)
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, val]) => [k.replace(/[A-Z]/g, m => '_' + m.toLowerCase()), toSnake(val)]))
  }
  return v
}

export class HttpEnquiryService implements EnquiryService {
  readonly isMock = false
  private baseUrl: string
  constructor(baseUrl: string) { this.baseUrl = baseUrl }

  async submit(submission: EnquirySubmission, file?: File): Promise<EnquiryReceipt> {
    const body = new FormData()
    body.append('enquiry', JSON.stringify(toSnake(submission)))
    if (file) body.append('itinerary_file', file)
    const res = await fetch(`${this.baseUrl.replace(/\/$/, '')}/enquiries`, {
      method: 'POST', body, headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`Enquiry could not be sent (HTTP ${res.status}).`)
    const data = await res.json() as { reference: string; status: EnquiryReceipt['status']; received_at: string }
    return { reference: data.reference, status: data.status, receivedAt: data.received_at, isMock: false }
  }
}

export class MockEnquiryService implements EnquiryService {
  readonly isMock = true
  async submit(submission: EnquirySubmission): Promise<EnquiryReceipt> {
    await new Promise(r => setTimeout(r, 900))
    const reference = 'DEMO-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    try {
      const key = 'aapnu-safar:demo-outbox'
      const box = JSON.parse(localStorage.getItem(key) ?? '[]') as unknown[]
      box.push({ reference, submission })
      localStorage.setItem(key, JSON.stringify(box.slice(-10)))
    } catch { /* storage unavailable — fine for a demo */ }
    return { reference, status: 'enquiry', receivedAt: new Date().toISOString(), isMock: true }
  }
}

export const enquiryService: EnquiryService = business.apiBaseUrl
  ? new HttpEnquiryService(business.apiBaseUrl)
  : new MockEnquiryService()
