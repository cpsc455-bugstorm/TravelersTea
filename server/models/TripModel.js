const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  tripName: String,
  destination: String,
  stagesPerDay: Number,
  budget: Number,
  numberOfDays: Number,
  destinationLongitude: Number,
  destinationLatitude: Number,
})

module.exports = mongoose.model('Trip', tripSchema)
