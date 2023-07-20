const TripModel = require('../models/TripModel')
const generateTrip = require('../openai/generateTrip')
const getCoordinatesFromLocation = require('../googleapi/googleCoordinates')
const config = require('../config/config')

class TripController {
  constructor(stageController) {
    this.stageController = stageController
  }

  async getTrip(id) {
    try {
      return await TripModel.findById(id)
    } catch (error) {
      if (config.server.env === 'DEV')
        console.error('Error while fetching trip:', error)
      throw new Error('Could not fetch trip')
    }
  }

  async getAll(userId) {
    if (!userId) {
      throw new Error('User ID is required to fetch trips.')
    }
    try {
      return await TripModel.find({ userId }).lean()
    } catch (error) {
      if (config.server.env === 'DEV')
        console.error('Error while fetching all trips:', error)
      throw new Error('Could not fetch all trips')
    }
  }

  async parseStagesFromMultipleDays(days, tripId, tripLocation) {
    const _tripId = tripId
    const stagesToAdd = []
    for (let day of days) {
      const stagesToAddFromDay = await this.parseStagesFromDay(
        day,
        _tripId,
        tripLocation,
      )
      for (let stage of stagesToAddFromDay) {
        stagesToAdd.push(stage)
      }
    }
    return stagesToAdd
  }

  async parseStagesFromDay(day, tripId, tripLocation) {
    const stagesToAddFromDay = []
    for (let stage of day.stages) {
      const longLatObject = await getCoordinatesFromLocation(
        stage.stageLocationName,
        tripLocation,
      )
      const stageToAddFromDay = {
        tripId,
        dayIndex: day.day,
        stageIndex: stage.stageIndex,
        stageLongitude: longLatObject.lng,
        stageLatitude: longLatObject.lat,
        stageLocation: stage.stageLocationName,
        description: stage.stageDescription,
        colorNumber: stage.stageColor,
        emoji: stage.stageEmoji,
      }
      stagesToAddFromDay.push(stageToAddFromDay)
    }
    return stagesToAddFromDay
  }

  async createTrip(userId, tripData) {
    try {
      let generatedTripWithStages = await generateTrip(tripData)

      const longLatObject = await getCoordinatesFromLocation(
        '',
        tripData.tripLocation,
      )
      const tripToCreate = {
        userId,
        tripName: tripData.tripName,
        tripLocation: tripData.tripLocation,
        stagesPerDay: tripData.stagesPerDay,
        budget: tripData.budget,
        numberOfDays: tripData.numberOfDays,
        tripLongitude: longLatObject.lng,
        tripLatitude: longLatObject.lat,
        isPublic: false,
      }

      const newTrip = await TripModel.create({
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...tripToCreate,
      })
      const newTripDTO = newTrip.toObject()
      delete newTripDTO.userId
      const { days } = generatedTripWithStages
      const stagesToAdd = await this.parseStagesFromMultipleDays(
        days,
        newTrip._id,
        tripData.tripLocation,
      )
      await this.stageController.createManyStages(stagesToAdd)
      return newTripDTO
    } catch (error) {
      error.message = 'Could not create trip: ' + error.message
      throw error
    }
  }

  async updateTrip(userId, id, tripData) {
    try {
      const updatedTrip = await TripModel.findOneAndUpdate(
        { userId: userId, _id: id }, // ensure user1 cannot edit user2's trip
        tripData,
        { new: true },
      ).lean()
      const updatedTripDTO = updatedTrip
      delete updatedTripDTO.userId
      return updatedTripDTO
    } catch (error) {
      if (config.server.env === 'DEV')
        console.error('Error while updating trip:', error)
      throw new Error('Could not edit trip')
    }
  }

  async deleteTrip(id) {
    try {
      await this.stageController.deleteStagesByTripId(id)
      return await TripModel.findByIdAndDelete(id).lean()
    } catch (error) {
      if (config.server.env === 'DEV')
        console.error('Error while deleting trip:', error)
      throw new Error('Could not delete trip')
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
      if (config.server.env === 'DEV')
        console.error('Error while deleting trips:', error)
      throw new Error('Could not delete trip')
    }
  }
}

module.exports = TripController
