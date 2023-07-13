const mongoose = require('mongoose')

const stageSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  tripId: {
    type: String,
    required: true,
  },
  dayIndex: {
    // 1-indexed
    type: Number,
    required: true,
  },
  stageIndex: {
    // 1-indexed
    type: Number,
    required: true,
  },
  stageLatitude: Number,
  stageLongitude: Number,
  stageLocation: String,
  locationName: String,
  description: String,
  colorNumber: Number,
  emoji: String,
})

module.exports = mongoose.model('Stage', stageSchema)
