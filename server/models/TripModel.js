const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
