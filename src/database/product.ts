import { user } from '@/database/connection'
import type { ObjectId } from 'mongodb'

export type Product = {
  _id?: ObjectId
  code: string
  name: string
  cost: number
  price: number
  description: string
  image: string
  stock: number
}

export const ProductCollection = user
  .mongoClient('mongodb-atlas')
  .db('db')
  .collection<Product & { _id: ObjectId }>('products')
