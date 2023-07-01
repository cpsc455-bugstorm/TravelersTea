const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  tripName: String,
  tripLocation: String,
  stagesPerDay: Number,
  budget: Number,
  numberOfDays: Number,
  tripLongitude: Number,
  tripLatitude: Number,
})

module.exports = mongoose.model('Trip', tripSchema)
