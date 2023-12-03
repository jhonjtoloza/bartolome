import { user } from '@/database/connection'
import type { ObjectId } from 'mongodb'

export type CashSession = {
  _id?: ObjectId
  user_id?: ObjectId
  start: Date
  end: Date
  cash_opened: number // opening balance
  cash_closed: number // closing balance
  total_debt: number // total debt from invoices pending
  total_paid: number // total cash received from invoices and bill's payments
  total_invoices: number // total invoices
  total_purchases: number // total purchases
  total_dept_paid: number
  status: 'open' | 'closed'
}

export const CashSessionCollection = user
  .mongoClient('mongodb-atlas')
  .db('db')
  .collection<CashSession & { _id: ObjectId }>('cash-sessions')
