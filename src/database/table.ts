import { user } from '@/database/connection'
import type { ObjectId } from 'mongodb'

export type Table = {
  _id: ObjectId
  name: string
}

export const TableCollection = user
  .mongoClient('mongodb-atlas')
  .db('db')
  .collection<Table>('tables')
