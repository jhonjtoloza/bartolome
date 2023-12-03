import { user } from '@/database/connection'
import type { ObjectId } from 'mongodb'

export type Customer = {
  _id: ObjectId | null
  name: string
  phone: string
  has_debt?: boolean
}

export const CustomerCollection = user
  .mongoClient('mongodb-atlas')
  .db('db')
  .collection<Customer>('customers')
