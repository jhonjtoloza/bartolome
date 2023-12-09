import type { Product } from '@/database/product'
import type { Customer } from '@/database/customer'
import { getDb, ObjectId } from '@/database/connection'

export type InvoiceProduct = Product & {
  quantity: number
  total: number
}

export type Invoice = {
  _id?: string
  number: number
  date: number
  customer: Customer | null
  products: InvoiceProduct[]
  total: number
  total_paid: number
  has_debt: boolean
  table?: {
    _id: string
    name: string
  } | null
  is_done: boolean
  location: 'table' | 'bar'
}

const DB_NAME = 'invoices'
export const InvoiceModel = {
  db: getDb<Invoice>(DB_NAME),

  async insertOne(invoice: Invoice) {
    return this.db.put({
      _id: invoice._id ?? ObjectId(),
      ...invoice
    })
  },

  async findOne(id: string) {
    return this.db.get<Invoice>(id)
  },

  async deleteOne(doc: Invoice) {
    return this.db.remove(doc as any)
  },

  async getInvoicesCredits(customer_id: string) {
    return this.db.find({
      selector: {
        customer: {
          _id: customer_id
        }
      }
    })
  },

  async pending() {
    await this.db.createIndex({
      index: {
        fields: ['is_done']
      }
    })
    return this.db.find({
      selector: {
        is_done: false
      }
    })
  }
}
