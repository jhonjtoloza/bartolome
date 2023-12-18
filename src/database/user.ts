import { getDb } from '@/database/connection'

export type User = {
  _id?: string
  username: string
  password: string
  role: string
}

export const UserModel = {
  db: getDb<User>('users'),
  async insertOrUpdate(user: User) {
    return await UserModel.db.put({
      _id: user.username,
      ...user
    })
  },

  async findOne(filter: Partial<User>) {
    return UserModel.db
      .find({
        selector: {
          ...filter
        }
      })
      .then((data) => {
        return data.docs[0] as User
      })
  },

  async delete(user: User) {
    return await this.db.remove(user.username as any)
  },
  async count() {
    return UserModel.db.info().then((info) => {
      return info.doc_count
    })
  },
  async findAll() {
    return UserModel.db
      .find({
        selector: {},
        sort: [{ _id: 'desc' }]
      })
      .then((data) => {
        return data.docs as User[]
      })
  }
}
