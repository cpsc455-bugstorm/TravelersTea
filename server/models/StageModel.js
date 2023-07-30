const mongoose = require('mongoose')

const stageSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  dayIndex: {
    type: Number,
    required: true,
  },
  stageIndex: {
    type: Number,
    required: true,
  },
  stageLatitude: Number,
  stageLongitude: Number,
  stageLocation: String,
  stageRating: Number,
  description: String,
  colorNumber: Number,
  emoji: String,
})

module.exports = mongoose.model('Stage', stageSchema)
