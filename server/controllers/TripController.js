const TripModel = require('../models/TripModel')
const uuid = require('uuid')
const generateTrip = require('../openai/generateTrip')

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
  parseStagesFromMultipleDays(days, tripId) {
    const _tripId = tripId
    const stagesToAdd = []
    for (let [index, day] of days.entries()) {
      const dayIndex = index
      const tripId = tripId
      const stagesToAddFromDay = this.parseStagesFromDay(day, _tripId, dayIndex)
      for (let stage of stagesToAddFromDay) {
        stagesToAdd.push(stage)
      }
    }
    return stagesToAdd
  }

  parseStagesFromDay(day, tripId, dayIndex) {
    const stagesToAddFromDay = []
    for (let [stage, index] of day.entries()) {
      const stageToAddFromDay = {
        tripId,
        dayIndex,
        stageIndex: index,
        // stageLongitude: googleApiStuff(),
        // stageLatitude: googleApiStuff(),
        description: stage.description,
        colourNumber: stage.colourNumber,
        emoji: stage.emoji,
      }
      stagesToAddFromDay.push(stageToAddFromDay)
    }
    return stagesToAddFromDay
  }
  async createTrip(userId, tripData) {
    try {
      const generatedTripWithStages = generateTrip(tripData)
      const tripToCreate = {
        tripName: generatedTripWithStages.tripName,
        tripLocation: tripData.destination,
        stagesPerDay: tripData.stagesPerDay,
        budget: tripData.budget,
        numberOfDays: tripData.numberOfDays,
        // tripLongitude: googleApiStuff(),
        // tripLatitude: googleApiStuff(),
        preferences: tripData.preferences, // ?
      }

      const newTrip = await TripModel.create({
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...tripToCreate,
        _id: uuid.v4(),
        userId,
      })
      const { days } = generatedTripWithStages
      const stagesToAdd = this.parseStagesFromMultipleDays(days, newTrip.id)
      console.log(stagesToAdd, 'This is to prevent linting errors')
      // await controller.StagesController.addMany(stagesToAdd)
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
