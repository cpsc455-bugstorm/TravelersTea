const mongoose = require('mongoose')

const destinationSchema = new mongoose.Schema({
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  name: {
    // usually city/country; the destination user gives
    type: String,
    required: true,
  },
  alias: [String],
  rating: Number,
  description: String,
  emoji: String,
  tag: [String],
})

// Create a 2dsphere index on the location field
destinationSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Destination', destinationSchema)
