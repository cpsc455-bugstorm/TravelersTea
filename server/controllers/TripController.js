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

  async generateAndSaveTrip(userId, tripData, id = null, session) {
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
        { new: true, session },
      ).lean()
      if (!savedTrip) {
        const error = new Error('Trip to edit not found')
        error.statusCode = 404
        throw error
      }
      await this.stageController.deleteStagesByTripId(savedTrip._id, session)
    } else {
      const _savedTrip = await TripModel.create([tripToSave], { session })
      savedTrip = _savedTrip[0].toObject()
    }

    const { days } = generatedTripWithStages
    const stagesToAdd = await this.parseStagesFromMultipleDays(
      days,
      savedTrip._id,
      filteredTripData.tripLocation,
      session,
    )
    await this.stageController.createManyStages(stagesToAdd, session)

    let savedTripDTO = savedTrip
    delete savedTripDTO.userId

    return savedTripDTO
  }

  async createTrip(userId, tripData) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const newTrip = await this.generateAndSaveTrip(
        userId,
        tripData,
        null,
        session,
      )
      await session.commitTransaction()
      session.endSession()
      return newTrip
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  }

  async updateTrip(userId, id, tripData) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
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
        }).session(session)
        if (!existingTrip) {
          const error = new Error('Trip could not be found')
          error.statusCode = 404
          throw error
        }
        existingTrip.tripName = tripData.tripName
        await existingTrip.save({ session })
        const existingTripDTO = existingTrip.toObject()
        delete existingTripDTO.userId

        await session.commitTransaction()
        session.endSession()
        return existingTripDTO
      } else {
        const updatedTrip = await this.generateAndSaveTrip(
          userId,
          tripData,
          id,
          session,
        )
        await session.commitTransaction()
        session.endSession()
        return updatedTrip
      }
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throw error
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
