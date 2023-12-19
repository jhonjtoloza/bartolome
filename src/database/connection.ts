import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'

PouchDB.plugin(PouchDBFind)

// const DB_HOST = `http://localhost:5984`
const DB_HOST = `https://bartolome:BarTolome5984@jhondev.online`
export const getDb = <T>(name: string) => {
  const localDB = new PouchDB(name, {
    deterministic_revs: true,
    revs_limit: 100,
    name: name,
    fetch: (url, opts) => {
      return fetch(`${DB_HOST}/${url}`, opts)
    }
  })
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
