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
  tripLongitude: Number,
  tripLatitude: Number,
  preferences: [{ type: String }],
})

module.exports = mongoose.model('Trip', tripSchema)
