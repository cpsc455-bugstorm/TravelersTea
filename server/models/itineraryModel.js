const mongoose = require('mongoose')

const stageSchema = new mongoose.Schema({
  stage: Number,
  place: String,
  description: String,
  address: String,
  cost: Number,
})

const tripSchema = new mongoose.Schema({
  destination: String,
  budget: Number,
  days: Number,
  stages: Number,
  preferences: [String],
  plan: [stageSchema],
})

const Itinerary = mongoose.model('trip', tripSchema)

module.exports = Itinerary
