const mongoose = require('mongoose')

const stageSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
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
  description: String,
  colorNumber: Number,
  emoji: String,
})

module.exports = mongoose.model('Stage', stageSchema)
