const { MongoClient } = require('mongodb')
const config = require('../config/config')

const backupDB = async () => {
  let sourceClient
  let targetClient

  try {
    // Connect to the source database
    sourceClient = new MongoClient(config.mongo.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    await sourceClient.connect()
    const sourceDb = sourceClient.db()
    console.log('Connected to source database...')

    // Connect to the target database
    targetClient = new MongoClient(config.mongo.backupuri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    await targetClient.connect()
    const targetDb = targetClient.db()
    console.log('Connected to target database...')

    // Get all the collections from the source database
    const collections = await sourceDb.listCollections().toArray()

    // Copy all the documents from each collection in the source database to the target database
    for (let collection of collections) {
      const docs = await sourceDb.collection(collection.name).find().toArray()
      await targetDb.collection(collection.name).insertMany(docs)
      console.log(`Copied collection: ${collection.name}`)
    }

    console.log('Database duplication complete.')
  } catch (err) {
    console.error(err)
  } finally {
    if (sourceClient) await sourceClient.close()
    if (targetClient) await targetClient.close()
  }
}

backupDB()
