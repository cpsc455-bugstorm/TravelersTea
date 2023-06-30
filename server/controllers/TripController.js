const TripModel = require('../models/TripModel')
const uuid = require('uuid')

class TripController {
  constructor() {}

  async getAll() {
    try {
      const trips = await TripModel.find().lean()
      return trips
    } catch (error) {
      throw new Error('Could not fetch all trips', error)
    }
  }

  async createTrip(tripData) {
    try {
      const newTrip = await TripModel.create({
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...tripData,
        _id: uuid.v4(),
      })
      return newTrip.toObject()
    } catch (error) {
      throw new Error('Could not create trip', error)
    }
  }

  async updateTrip(id, tripData) {
    try {
      const updatedTrip = await TripModel.findByIdAndUpdate(id, tripData, {
        new: true,
      }).lean()
      return updatedTrip
    } catch (error) {
      throw new Error('Could not edit trip', error)
    }
  }

  async deleteTrip(id) {
    try {
      const deletedTrip = await TripModel.findByIdAndDelete(id).lean()
      return deletedTrip
    } catch (error) {
      throw new Error('Could not delete trip', error)
    }
  }
}

module.exports = TripController
