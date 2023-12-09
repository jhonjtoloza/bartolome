import { getDb, ObjectId } from '@/database/connection'

export type Cash = {
  _id?: string | null
  description: string
  amount: number
  date: number
  type: 'credit' | 'debit'
}

export const CashModel = {
  db: getDb<Cash>('cash'),

  async insertOrUpdate(cash: Cash) {
    return this.db.put({
      _id: cash._id ?? ObjectId(),
      ...cash
    })
  },
  findOne(param: { status: string }): Promise<Cash | null> {
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
