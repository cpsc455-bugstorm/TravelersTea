const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const tripSchema = require('../models/TripModel')
const stageSchema = require('../models/StageModel')
const userSchema = require('../models/UserModel')
const config = require('../config/config')
const resetDB = require('./resetDB')

// Create models
const Trip = mongoose.model('Trip', tripSchema.schema)
const Stage = mongoose.model('Stage', stageSchema.schema)
const User = mongoose.model('User', userSchema.schema)

const populateDB = async () => {
  try {
    await mongoose.connect(config.mongo.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to database...')

    // Call resetDB to clean collections
    await resetDB()

    // Insert a user
    const savedUser = await new User({
      username: 'test',
      email: 'passwordis@pass.com',
      password: 'pass',
    }).save()

    // Insert a trip
    const savedTrip = await new Trip({
      _id: new ObjectId(),
      userId: savedUser._id,
      tripName: 'Test Trip',
      tripLocation: 'Vancouver',
      stagesPerDay: 1,
      budget: 1000,
      numberOfDays: 1,
      tripLongitude: -123.0,
      tripLatitude: 49,
    }).save()

    // Insert stages
    const stages = [
      {
        _id: new ObjectId(),
        tripId: savedTrip._id,
        dayIndex: 1,
        stageIndex: 1,
        stageLatitude: 49.0,
        stageLongitude: -123.0,
        stageLocation: 'Medina Cafe',
        description: 'Wonderful Cafe',
        colorNumber: 1,
        emoji: '😊',
      },
      {
        _id: new ObjectId(),
        tripId: savedTrip._id,
        dayIndex: 1,
        stageIndex: 2,
        stageLatitude: 49.0,
        stageLongitude: -123.0,
        stageLocation: 'Stanley Park',
        description: 'Amazing Park',
        colorNumber: 2,
        emoji: '🌲',
      },
    ]
    await Stage.insertMany(stages)
    console.log('Data has been populated.')
  } catch (err) {
    console.error(err)
  } finally {
    await mongoose.connection.close()
  }
}

populateDB()
