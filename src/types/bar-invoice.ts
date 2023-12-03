import type { Invoice } from '@/database/invoice'

export type BarInvoice = {
  entered: boolean
  invoice: Invoice
}
