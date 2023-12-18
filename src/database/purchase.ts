import type { Product } from '@/database/product'
import { getDb, ObjectId } from '@/database/connection'

export type PurchaseProduct = Product & {
  quantity: number
  total: number
}
export type Purchase = {
  _id?: string
  date: number
  products: PurchaseProduct[]
  total: number
  total_paid: number
}

export const PurchaseModel = {
  db: getDb<Purchase>('purchases'),
  async insertOrUpdate(purchase: Purchase) {
    return this.db.put({
      _id: purchase._id ?? ObjectId(),
      ...purchase
    })
  }
}
