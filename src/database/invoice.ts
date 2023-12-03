import * as Realm from 'realm-web'
import { user } from '@/database/connection'
import type { Product } from '@/database/product'
import type { ObjectId } from 'mongodb'

export type InvoiceProduct = Product & {
  quantity: number
  total: number
}

export type Invoice = {
  _id?: ObjectId
  number: number
  date: Date
  customer: {
    _id: ObjectId | null
    name: string
    phone: string
  } | null
  products: InvoiceProduct[]
  total: number
  total_paid: number
  table?: {
    _id: ObjectId
    name: string
  } | null
  is_done: boolean
  location: 'table' | 'bar'
}

export const InvoiceCollection = user.mongoClient('mongodb-atlas').db('db').collection('invoices')
