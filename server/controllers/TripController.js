const TripModel = require('../models/TripModel')
const uuid = require('uuid')
const generateTrip = require('../openai/generateTrip')
const getCoordinatesFromLocation = require('../googleapi/googleCoordinates')

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
      console.log(stage)
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
        colourNumber: stage.stageColor,
        emoji: stage.stageEmoji,
      }
      stagesToAddFromDay.push(stageToAddFromDay)
    }
    return stagesToAddFromDay
  }

  async createTrip(userId, tripData) {
    try {
      const generatedTripWithStagesJSON = await generateTrip(tripData)
      const generatedTripWithStages = JSON.parse(generatedTripWithStagesJSON)
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
      }

      const newTrip = await TripModel.create({
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...tripToCreate,
        _id: uuid.v4(),
      })
      const { days } = generatedTripWithStages
      const stagesToAdd = this.parseStagesFromMultipleDays(
        days,
        newTrip._id,
        tripData.tripLocation,
      )
      const newl = await this.stageController.createManyStages(stagesToAdd)
      console.log(JSON.stringify(newl, null, 2))
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
