const TripModel = require('../models/TripModel')
const generateTrip = require('../openai/generateTrip')
const generateTripsMetadata = require('../openai/generateTripMetadata')
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
        true,
      )
      const stageToAddFromDay = {
        tripId,
        dayIndex: day.day,
        stageIndex: stage.stageIndex,
        stageLongitude: longLatObject.location.lng,
        stageLatitude: longLatObject.location.lat,
        stageRating: longLatObject.rating,
        stageLocation: stage.stageLocationName,
        description: stage.stageDescription,
        colorNumber: stage.stageColor,
        emoji: stage.stageEmoji,
      }
      stagesToAddFromDay.push(stageToAddFromDay)
    }
    return stagesToAddFromDay
  }

  async generateAndSaveTrip(userId, tripData, id = null) {
    let filteredTripData = tripData.colloquialPrompt
      ? await generateTripsMetadata(tripData.colloquialPrompt)
      : tripData

    let generatedTripWithStages
    try {
      generatedTripWithStages = await generateTrip(filteredTripData)
    } catch (e) {
      console.error('Error while generating itinerary:', e)
      throw e
    }

    try {
      const longLatObject = await getCoordinatesFromLocation(
        '',
        filteredTripData.tripLocation,
        false,
      )
      const tripToSave = {
        tripName: filteredTripData.tripName,
        tripLocation: filteredTripData.tripLocation,
        stagesPerDay: filteredTripData.stagesPerDay,
        budget: filteredTripData.budget,
        numberOfDays: filteredTripData.numberOfDays,
        tripLongitude: longLatObject.lng,
        tripLatitude: longLatObject.lat,
        tripNotes: filteredTripData.tripNotes,
      }

      if (!id) {
        tripToSave.userId = userId
      }

      let savedTrip
      if (id) {
        savedTrip = await TripModel.findByIdAndUpdate(id, tripToSave, {
          new: true,
        })
        await this.stageController.deleteStagesByTripId(savedTrip._id)
      } else {
        savedTrip = await TripModel.create(tripToSave)
      }

      const { days } = generatedTripWithStages
      const stagesToAdd = await this.parseStagesFromMultipleDays(
        days,
        savedTrip._id,
        filteredTripData.tripLocation,
      )
      await this.stageController.createManyStages(stagesToAdd)
      return savedTrip.toObject()
    } catch (error) {
      if (config.server.env === 'DEV')
        console.error('Error while saving trip:', error)
      throw new Error('Could not save trip')
    }
  }

  async createTrip(userId, tripData) {
    return this.generateAndSaveTrip(userId, tripData)
  }

  async updateTrip(id, tripData) {
    if (
      tripData.tripName &&
      !tripData.tripLocation &&
      !tripData.stagesPerDay &&
      !tripData.budget &&
      !tripData.numberOfDays &&
      !tripData.tripNotes
    ) {
      const existingTrip = await TripModel.findById(id)
      existingTrip.tripName = tripData.tripName
      await existingTrip.save()
      return existingTrip
    } else {
      return this.generateAndSaveTrip(null, tripData, id)
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
