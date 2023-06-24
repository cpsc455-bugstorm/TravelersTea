const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
})

const Location = mongoose.model('Location', locationSchema)

module.exports = Location
