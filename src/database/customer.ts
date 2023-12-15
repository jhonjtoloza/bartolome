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
  async insertOrUpdate(customer: Customer) {
    const result = await this.db.put({
      _id: customer._id ?? ObjectId(),
      ...customer
    })
    return {
      ...customer,
      _rev: result.rev,
      _id: result.id
    }
  },

  async findOne(id: string) {
    return this.db.get(id)
  },

  async find(filter: Partial<Customer> = {}) {
    const result = await this.db.find({
      selector: filter,
      sort: [
        {
          _id: 'asc'
        }
      ]
    })
  }
}
