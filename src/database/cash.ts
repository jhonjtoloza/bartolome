import type { ObjectId } from 'mongodb'
import { user } from '@/database/connection'

export type Cash = {
  _id: ObjectId | null
  description: string
  amount: number
  date: Date
  type: 'credit' | 'debit'
}

export const CashCollection = user.mongoClient('mongodb-atlas').db('db').collection<Cash>('cash')
