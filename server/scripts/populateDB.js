// to run script:
// 1. cd server
// 2. yarn populate:db
const mongoose = require('mongoose')
const tripSchema = require('../models/TripModel')
const stageSchema = require('../models/StageModel')
const userSchema = require('../models/UserModel')
const { ObjectId } = require('mongodb')
const config = require('../config/config')
const bcrypt = require('bcrypt')

const Trip = mongoose.model('Trip', tripSchema.schema)
const Stage = mongoose.model('Stage', stageSchema.schema)
const User = mongoose.model('User', userSchema.schema)

const populateDB = async () => {
  try {
    const conString = config.mongo.uri

    await mongoose.connect(conString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to database...')

    await Trip.deleteMany({})
    await Stage.deleteMany({})
    await User.deleteMany({})

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash('pass', saltRounds)

    const savedUser = await new User({
      username: 'test',
      email: 'passwordis@pass.com',
      password: hashedPassword,
    }).save()

    const trips = [
      {
        _id: new ObjectId(),
        userId: savedUser._id,
        tripName: 'Test Trip 1',
        tripLocation: 'Vancouver',
        stagesPerDay: 1,
        budget: 1000,
        numberOfDays: 1,
        tripLongitude: -123.0,
        tripLatitude: 49,
      },
      {
        _id: new ObjectId(),
        userId: savedUser._id,
        tripName: 'Test Trip 2',
        tripLocation: 'Seattle',
        stagesPerDay: 1,
        budget: 1500,
        numberOfDays: 1,
        tripLongitude: -122.33,
        tripLatitude: 47.61,
      },
    ]
    const savedTrips = await Trip.insertMany(trips)
    console.log('Trips has been added.')

    const stages = [
      {
        _id: new ObjectId(),
        tripId: savedTrips[0]._id,
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
        tripId: savedTrips[0]._id,
        dayIndex: 1,
        stageIndex: 2,
        stageLatitude: 49.0,
        stageLongitude: -123.0,
        stageLocation: 'Stanley Park',
        description: 'Amazing Park',
        colorNumber: 2,
        emoji: '🌲',
      },
      {
        _id: new ObjectId(),
        tripId: savedTrips[1]._id,
        dayIndex: 1,
        stageIndex: 1,
        stageLatitude: 47.61,
        stageLongitude: -122.33,
        stageLocation: 'Pike Place Market',
        description: 'Historic Market',
        colorNumber: 3,
        emoji: '🏪',
      },
    ]
    await Stage.insertMany(stages)
    console.log('Stages has been added.')
  } catch (err) {
    console.error(err)
  } finally {
    await mongoose.connection.close()
  }
}

populateDB()
