const TripModel = require('../models/TripModel')
const uuid = require('uuid')

class TripController {
  constructor() {}

  async getAll() {
    try {
      const trips = await TripModel.find()
      return trips
    } catch (error) {
      console.error('Error while retrieving trips:', error)
      throw error
    }
  }

  async createTrip(tripData) {
    try {
      const newTrip = await TripModel.create({
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...tripData,
        _id: uuid.v4(),
      })
      return newTrip
    } catch (error) {
      console.error('Error while creating trip:', error)
      throw error
    }
  }

  async editTrip(id, tripData) {
    try {
      const updatedTrip = await TripModel.findByIdAndUpdate(id, tripData, {
        new: true,
      })
      return updatedTrip
    } catch (error) {
      console.error('Error while editing trip:', error)
      throw error
    }
  }
}

module.exports = TripController
