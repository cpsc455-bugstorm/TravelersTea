const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
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
  isPublic: Boolean,
  tripNotes: String,
})

module.exports = mongoose.model('Trip', tripSchema)
