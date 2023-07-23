const TripModel = require('../models/TripModel')
const generateTrip = require('../openai/generateTrip')
const generateTripsMetadata = require('../openai/generateTripMetadata')
const getCoordinatesFromLocation = require('../googleapi/googleCoordinates')
const config = require('../config/config')
const mongoose = require('mongoose')

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

  async getAllByUserId(userId) {
    if (!userId) {
      throw new Error('User ID is required to fetch trips.')
    }
    try {
      const trips = await TripModel.find({ userId }).lean()
      trips.map((trip) => delete trip.userId)
      return trips
    } catch (error) {
      error.message += 'Could not fetch all trips | ' + error.message
      throw error
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
    } catch (error) {
      error.message = 'Error while generating trip | ' + error.message
      throw error
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
        isPublic: false,
      }

      if (!id) {
        tripToSave.userId = userId
      }

      let savedTrip
      if (id) {
        savedTrip = await TripModel.findOneAndUpdate(
          { userId: userId, _id: new mongoose.Types.ObjectId(id) }, // ensure user1 cannot edit user2's trip
          tripData,
          { new: true },
        ).lean()
        if (!savedTrip) {
          const error = new Error('Trip to edit not found')
          error.statusCode = 404
          throw error
        }
        await this.stageController.deleteStagesByTripId(savedTrip._id)
      } else {
        const _savedTrip = await TripModel.create(tripToSave)
        savedTrip = _savedTrip.toObject()
      }

      const { days } = generatedTripWithStages
      const stagesToAdd = await this.parseStagesFromMultipleDays(
        days,
        savedTrip._id,
        filteredTripData.tripLocation,
      )
      await this.stageController.createManyStages(stagesToAdd)
      let savedTripDTO = savedTrip
      delete savedTripDTO.userId
      return savedTripDTO
    } catch (error) {
      error.message = 'Could not save trip | ' + error.message
      throw error
    }
  }

  async createTrip(userId, tripData) {
    return this.generateAndSaveTrip(userId, tripData)
  }

  async updateTrip(userId, id, tripData) {
    if (
      tripData.tripName &&
      !tripData.tripLocation &&
      !tripData.stagesPerDay &&
      !tripData.budget &&
      !tripData.numberOfDays &&
      !tripData.tripNotes
    ) {
      const existingTrip = await TripModel.findOne({
        userId: userId,
        _id: new mongoose.Types.ObjectId(id),
      })
      if (!existingTrip) {
        const error = new Error('Trip could not be found')
        error.statusCode = 404
        throw error
      }
      existingTrip.tripName = tripData.tripName
      await existingTrip.save()
      const existingTripDTO = existingTrip.toObject()
      delete existingTripDTO.userId
      return existingTripDTO
    } else {
      return this.generateAndSaveTrip(userId, tripData, id)
    }
  }

  async deleteTrip(userId, id) {
    try {
      await this.stageController.deleteStagesByTripId(id)
      const deletedTrip = await TripModel.findOneAndDelete({
        userId: userId,
        _id: new mongoose.Types.ObjectId(id), // ensure user1 cannot delete user2's trips
      }).lean()
      if (!deletedTrip) {
        const error = new Error('Trip could not be found')
        error.statusCode = 404
        throw error
      }
      delete deletedTrip.userId
      return deletedTrip
    } catch (error) {
      error.message = 'Could not delete trip | ' + error.message
      throw error
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
