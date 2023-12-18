import type { Invoice } from '@/database/invoice'

export type TableInvoicer = {
  _id?: string
  name: string
  entered: boolean
  invoice: Invoice | null
}
