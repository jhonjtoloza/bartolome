import * as Realm from 'realm-web'
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
PouchDB.plugin(PouchDBFind)

export const app = Realm.App.getApp('application-0-mfxcy')

const credentials = Realm.Credentials.apiKey(
  'zw0JiXfeWQAOoSmxwWb4BnmRpe5wTIWCuRckLnYu8OM6RqNSG61fsmyzctnpnG9A'
)
export let user = await app.logIn(credentials)
const DB_HOST = `http://localhost:5984`
export const getDb = <T>(name: string) => {
  const localDB = new PouchDB(name)
  const remoteDB = new PouchDB(`${DB_HOST}/${name}`)
  localDB
    .sync(remoteDB, {
      live: true,
      retry: true
    })
    .on('complete', () => {
      console.log('sync complete')
    })
  return localDB as PouchDB.Database<T | any>
}

export const ObjectId = function () {
  var timestamp = ((new Date().getTime() / 1000) | 0).toString(16)
  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16)
      })
      .toLowerCase()
  )
}
