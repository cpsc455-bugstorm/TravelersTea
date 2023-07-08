const TripModel = require('../models/TripModel')
const uuid = require('uuid')

class TripController {
  constructor(stageController) {
    this.stageController = stageController
  }

  async getAll(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required to fetch trips.')
      }
      const trips = await TripModel.find({ userId }).lean()
      return trips
    } catch (error) {
      throw new Error(`Could not fetch all trips: ${error}`)
    }
  }

  async createTrip(userId, tripData) {
    try {
      const newTrip = await TripModel.create({
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...tripData,
        _id: uuid.v4(),
        userId,
      })
      return newTrip.toObject()
    } catch (error) {
      throw new Error(`Could not create trip: ${error}`)
    }
  }

  async updateTrip(id, tripData) {
    try {
      const updatedTrip = await TripModel.findByIdAndUpdate(id, tripData, {
        new: true,
      }).lean()
      return updatedTrip
    } catch (error) {
      throw new Error(`Could not edit trip: ${error}`)
    }
  }

  async deleteTrip(id) {
    try {
      await this.stageController.deleteStagesByTripId(id)
      const deletedTrip = await TripModel.findByIdAndDelete(id).lean()
      return deletedTrip
    } catch (error) {
      throw new Error(`Could not delete trip: ${error}`)
    }
  }

  async deleteTripsByUserId(userId) {
    try {
      const userTrips = await TripModel.find({ userId: userId }).lean()

      for (const trip of userTrips) {
        await this.stageController.deleteStagesByTripId(trip._id)
      }

      await TripModel.deleteMany({ userId: userId }).lean()
    } catch (error) {
      throw new Error(`Could not delete trip: ${error}`)
    }
  }
}

module.exports = TripController
