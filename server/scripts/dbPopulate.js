const mongoose = require('mongoose')
const tripSchema = require('../models/TripModel')
const stageSchema = require('../models/StageModel')
const userSchema = require('../models/UserModel')
const { ObjectId } = require('mongodb')

const conString =
  'mongodb+srv://bugstorm1000:GqHIshuc7OuDPDd1@cluster0.4bflh41.mongodb.net/BugStormDEV_Rithin?retryWrites=true&w=majority'

// Connect to Mongo DB
mongoose.connect(conString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Create models
const Trip = mongoose.model('Trip', tripSchema.schema)
const Stage = mongoose.model('Stage', stageSchema.schema)
const User = mongoose.model('User', userSchema.schema)

async function manageData() {
  // Delete all records from trips, stages and users collections
  await Trip.deleteMany({})
  await Stage.deleteMany({})
  await User.deleteMany({})

  // Insert a user
  const user = new User({
    username: 'test',
    email: 'passwordis@pass.com',
    password: 'pass',
  })
  const savedUser = await user.save()

  // Insert a trip
  const trip = new Trip({
    _id: new ObjectId(),
    userId: savedUser._id,
    tripName: 'Test Trip',
    tripLocation: 'Vancouver',
    stagesPerDay: 1,
    budget: 1000,
    numberOfDays: 1,
    tripLongitude: -123.0,
    tripLatitude: 49,
  })
  const savedTrip = await trip.save()

  // Insert a stage
  const stage = new Stage({
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
  })
  await stage.save()
}

manageData()
  .catch(console.error)
  .finally(() => mongoose.connection.close())
