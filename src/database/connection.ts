import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'

PouchDB.plugin(PouchDBFind)

const DB_HOST = `http://bartolome:BarTolome5984@167.99.116.92:5984`
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
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16)
  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16)
      })
      .toLowerCase()
  )
}
