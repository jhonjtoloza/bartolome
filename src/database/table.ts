import { getDb, ObjectId } from '@/database/connection'

export type Table = {
  _id?: string
  name: string
}

const DB_NAME = 'tables'
export const TableModel = {
  db: getDb<Table>(DB_NAME),

  async insertOne(table: Table) {
    return this.db.put({
      _id: table._id ?? ObjectId(),
      ...table
    })
  },

  async findAll(): Promise<Table[]> {
    return this.db
      .find({
        selector: {},
        sort: [
          {
            _id: 'asc'
          }
        ]
      })
      .then((data) => {
        return data.docs
      })
  }
}
