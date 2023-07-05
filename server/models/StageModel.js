const mongoose = require('mongoose')

const stageSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  dayId: {
    type: String,
    required: true,
  },
  tripId: {
    type: String,
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
  stageLongitude: Number,
  stageLatitude: Number,
  stageLocation: String,
  description: String,
  colourNumber: Number,
})

module.exports = mongoose.model('Stage', stageSchema)
