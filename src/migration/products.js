const { MongoClient } = require('mongodb')
// const PouchDB = require('pouchdb')

const connection = new MongoClient('mongodb+srv://admin:21hJPLXPfErJbd2m@jhon.bbmwiba.mongodb.net/')
const DB_HOST = `http://localhost:5984`

const main = async () => {
  await connection.connect()
  const db = connection.db('db')
  const collection = db.collection('products')
  //
  const docs = await collection.find({}).toArray()
  for (const doc of docs) {
    await fetch(`http://localhost:5984/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...doc,
        _id: doc._id.toString()
      })
    })
  }
}

main().then(() => {
  connection.close()
})
