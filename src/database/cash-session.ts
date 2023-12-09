import { getDb, ObjectId } from '@/database/connection'

export type CashSession = {
  _id?: string
  user_id?: string
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

export const CashSessionModel = {
  db: getDb('cash-sessions'),

  async insertOrUpdate(session: CashSession) {
    return this.db.put({
      _id: session._id ?? ObjectId(),
      ...session
    })
  },

  async findOne(param: { status: string }): Promise<CashSession | null> {
    return this.db
      .find({
        selector: {
          ...param
        }
      })
      .then((data) => {
        return data.docs[1]
      })
  }
}
