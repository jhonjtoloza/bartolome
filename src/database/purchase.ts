import type { Product } from '@/database/product'
import { user } from '@/database/connection'
import type { ObjectId } from 'mongodb'

export type PurchaseProducto = Product & {
  quantity: number
  total: number
}
export type Purchase = {
  date: Date
  products: PurchaseProducto[]
  total: number
  total_paid: number
}

export const PurchaseCollection = user
  .mongoClient('mongodb-atlas')
  .db('db')
  .collection<Purchase & { _id: ObjectId }>('purchases')
