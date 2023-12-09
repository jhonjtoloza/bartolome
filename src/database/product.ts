import { getDb, ObjectId } from '@/database/connection'

export type Product = {
  _id?: string
  code: string
  name: string
  cost: number
  price: number
  description: string
  image: string
  stock: number
}

const DB_NAME = 'products'
const DB = getDb(DB_NAME)

DB.changes().on('change', () => {
  console.log('changes')
})
export const ProductModel = {
  db: getDb<Product>(DB_NAME),

  async insertOne(product: Product) {
    return DB.put({
      _id: product._id ?? ObjectId(),
      ...product
    })
      .then(() => {
        return product
      })
      .catch((er) => {
        console.error(er)
      })
  },

  async findOne(id: string) {
    return DB.get(id)
  },

  async find() {
    const result = await DB.find({
      selector: {},
      sort: [
        {
          _id: 'asc'
        }
      ]
    })
    return result.docs as unknown as Product[]
  }
}
