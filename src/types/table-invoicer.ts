import type { Invoice } from '@/database/invoice'

export type TableInvoicer = {
  _id: any
  name: string
  entered: boolean
  invoice: Invoice | null
}
