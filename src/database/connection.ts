import * as Realm from 'realm-web'

export const {
  BSON: { ObjectId }
} = Realm
export const app = Realm.App.getApp('application-0-mfxcy')

const credentials = Realm.Credentials.apiKey(
  'zw0JiXfeWQAOoSmxwWb4BnmRpe5wTIWCuRckLnYu8OM6RqNSG61fsmyzctnpnG9A'
)
export let user = await app.logIn(credentials)
