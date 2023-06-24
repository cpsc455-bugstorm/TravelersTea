const mongoose = require('mongoose')

const itineraryStageSchema = new mongoose.Schema({
  stage: Number,
  locationName: String,
  description: String,
  address: String,
  cost: Number,
})

const itinerarySchema = new mongoose.Schema({
  destination: String,
  budget: Number,
  days: Number,
  stages: Number,
  preferences: [String],
  plan: [itineraryStageSchema],
})

const Itinerary = mongoose.model('Itinerary', itinerarySchema)

module.exports = Itinerary
