import * as Realm from 'realm-web'

export const {
  BSON: { ObjectId }
} = Realm
export const app = Realm.App.getApp('application-0-mfxcy')

const credentials = Realm.Credentials.apiKey(
  'zw0JiXfeWQAOoSmxwWb4BnmRpe5wTIWCuRckLnYu8OM6RqNSG61fsmyzctnpnG9A'
)
export const user = await app.logIn(credentials)
//
// const url = 'mongodb+srv://admin:21hJPLXPfErJbd2m@jhon.bbmwiba.mongodb.net/'
//
// const connection = new MongoClient(url)
// await connection.connect()
