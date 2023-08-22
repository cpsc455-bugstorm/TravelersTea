const mongoose = require('mongoose')
const config = require('../config/config')

const resetDB = async () => {
  if (config.mongo.flag !== 'BugStorm_PROD') {
    try {
      const conn = await mongoose.connect(config.mongo.uri)
      console.log('Connected to database...')

      const collections = await conn.connection.db.listCollections().toArray()

      for (let collection of collections) {
        try {
          await conn.connection.db.dropCollection(collection.name)
          console.log(`Dropped collection: ${collection.name}`)
        } catch (error) {
          if (error.message === 'ns not found') return
          if (
            error.message.includes(
              'a background operation is currently running',
            )
          )
            return
          console.log(error.message)
        }
      }

      console.log('Database reset complete.')
    } catch (err) {
      console.error(err)
    } finally {
      await mongoose.connection.close()
    }
  } else {
    console.log('Not resetting PROD DB')
  }
}

resetDB()
