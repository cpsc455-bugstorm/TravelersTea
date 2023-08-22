const mongoose = require('mongoose')
const User = require('../models/UserModel')
const Trip = require('../models/TripModel')
const Stage = require('../models/StageModel')
const config = require('../config/config')

const cleanDB = async () => {
  try {
    await mongoose.connect(config.mongo.uri)
    console.log('Connected to database...')

    // Delete trips without associated users
    const userIds = await User.find({}, '_id')
    await Trip.deleteMany({ userId: { $nin: userIds } })
    console.log('Deleted trips without associated users.')

    // Delete stages without associated trips
    const tripIds = await Trip.find({}, '_id')
    await Stage.deleteMany({ tripId: { $nin: tripIds } })
    console.log('Deleted stages without associated trips.')

    console.log('Database cleanup complete.')
  } catch (err) {
    console.error(err)
  } finally {
    await mongoose.connection.close()
  }
}

cleanDB()
