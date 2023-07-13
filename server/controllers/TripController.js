const TripModel = require('../models/TripModel')

class TripController {
  constructor(stageController) {
    this.stageController = stageController
  }

  async getTrip(id) {
    try {
      const trip = await TripModel.findById(id)
      return trip
    } catch (error) {
      throw new Error(`Could not fetch trip: ${error}`)
    }
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
        userId,
      })
      return newTrip.toObject()
    } catch (error) {
      throw new Error(`Could not create trip: ${error}`)
    }
  }

  async updateTrip(id, tripData) {
    try {
      return await TripModel.findByIdAndUpdate(id, tripData, {
        new: true,
      }).lean()
    } catch (error) {
      throw new Error(`Could not edit trip: ${error}`)
    }
  }

  async deleteTrip(id) {
    try {
      await this.stageController.deleteStagesByTripId(id)
      return await TripModel.findByIdAndDelete(id).lean()
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
