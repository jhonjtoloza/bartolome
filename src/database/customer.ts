import { getDb, ObjectId } from '@/database/connection'

export type Customer = {
  _id?: string
  name: string
  phone: string
  has_debt?: boolean
}

const DB_NAME = 'customers'
export const CustomerModel = {
  db: getDb<Customer>(DB_NAME),
  async insertOne(customer: Customer) {
    return this.db.put({
      _id: customer._id ?? ObjectId(),
      ...customer
    })
  },

  async findOne(id: string) {
    return this.db.get(id)
  },

  async find(filter: Partial<Customer> = {}) {
    const result = await this.db.find({
      selector: {},
      sort: [
        {
          _id: 'asc'
        }
      ]
    })
  }
}
