const TripModel = require('../models/TripModel')
const generateTrip = require('../openai/generateTrip')
const generateTripsMetadata = require('../openai/generateTripMetadata')
const getCoordinatesFromLocation = require('../googleapi/googleCoordinates')
const config = require('../config/config')
const mongoose = require('mongoose')

const NUM_TAILWIND_COLORS = 17

class TripController {
  constructor(stageController) {
    this.stageController = stageController
  }

  async getTrip(userId, tripId) {
    try {
      const trip = await TripModel.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        _id: new mongoose.Types.ObjectId(tripId),
      })

      if (!trip) {
        const error = new Error('Trip could not be found')
        error.statusCode = 404
        throw error
      }

      const tripDTO = trip.toObject()
      delete tripDTO.userId
      return tripDTO
    } catch (error) {
      error.message = 'Could not fetch trip | ' + error.message
      throw error
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

  /**
   * https://en.wikipedia.org/wiki/Spherical_coordinate_system#Cartesian_coordinates
   * https://medium.com/fishbrain/finding-the-center-point-in-a-cluster-of-coordinates-e607cdf75fd5
   *
   * Calculates the geographical center of all stages using spherical coordinates.
   * Returns an array of stages to add, along with the latitude and longitude of the center.
   */
  async parseStagesFromMultipleDays(days, tripId, tripLocation, userId) {
    const _tripId = tripId
    const stagesToAdd = []
    let totalX = 0
    let totalY = 0
    let totalZ = 0
    const shuffledColorIndexes = getShuffledIndexes()

    for (let day of days) {
      const index = days.indexOf(day)
      const colorNumber = shuffledColorIndexes[index % NUM_TAILWIND_COLORS]
      const { stagesToAddFromDay, x, y, z } = await this.parseStagesFromDay(
        day,
        _tripId,
        tripLocation,
        userId,
        colorNumber,
      )
      totalX += x
      totalY += y
      totalZ += z
      for (let stage of stagesToAddFromDay) {
        stagesToAdd.push(stage)
      }
    }

    const avgX = totalX / days.length
    const avgY = totalY / days.length
    const avgZ = totalZ / days.length

    const lon = Math.atan2(avgY, avgX)
    const hyp = Math.sqrt(avgX * avgX + avgY * avgY)
    const lat = Math.atan2(avgZ, hyp)

    const centerLat = lat * (180 / Math.PI)
    const centerLng = lon * (180 / Math.PI)

    return { stagesToAdd, centerLat, centerLng }
  }

  /**
   * Calculates the geographical center of all stages in the day using spherical coordinates.
   * Returns an array of stages to add from the day, along with the x, y, and z coordinates of the center.
   */
  async parseStagesFromDay(day, tripId, tripLocation, userId, colorNumber) {
    const stagesToAddFromDay = []
    let totalX = 0
    let totalY = 0
    let totalZ = 0

    for (let stage of day.stages) {
      const longLatObject = await getCoordinatesFromLocation(
        stage.stageLocationName,
        tripLocation,
        true,
      )
      const lat = longLatObject.location.lat * (Math.PI / 180)
      const lon = longLatObject.location.lng * (Math.PI / 180)

      totalX += Math.cos(lat) * Math.cos(lon)
      totalY += Math.cos(lat) * Math.sin(lon)
      totalZ += Math.sin(lat)

      const stageToAddFromDay = {
        tripId,
        userId,
        dayIndex: day.day,
        stageIndex: stage.stageIndex,
        stageLongitude: longLatObject.location.lng,
        stageLatitude: longLatObject.location.lat,
        stageRating: longLatObject.rating,
        stageLocation: stage.stageLocationName,
        description: stage.stageDescription,
        colorNumber: colorNumber,
        emoji: stage.stageEmoji,
      }
      stagesToAddFromDay.push(stageToAddFromDay)
    }

    return {
      stagesToAddFromDay,
      x: totalX / day.stages.length,
      y: totalY / day.stages.length,
      z: totalZ / day.stages.length,
    }
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

    try {
      const tripToSave = {
        tripName: filteredTripData.tripName,
        tripLocation: filteredTripData.tripLocation,
        stagesPerDay: filteredTripData.stagesPerDay,
        budget: filteredTripData.budget,
        numberOfDays: filteredTripData.numberOfDays,
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
          filteredTripData,
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
      const { stagesToAdd, centerLat, centerLng } =
        await this.parseStagesFromMultipleDays(
          days,
          savedTrip._id,
          filteredTripData.tripLocation,
          userId,
        )

      // this adds stages so do the part before this
      await this.stageController.createManyStages(stagesToAdd)

      tripToSave.tripLongitude = centerLng
      tripToSave.tripLatitude = centerLat

      savedTrip = await TripModel.findByIdAndUpdate(savedTrip._id, tripToSave, {
        new: true,
        session,
      })

      let savedTripDTO = savedTrip.toObject()
      delete savedTripDTO.userId

      return savedTripDTO
    } catch (error) {
      error.message = 'Could not save trip | ' + error.message
      throw error
    }
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
      return newTrip
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      await session.endSession()
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
        return updatedTrip
      }
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      await session.endSession()
    }
  }

  async deleteTrip(userId, id) {
    try {
      await this.stageController.deleteStagesByTripId(id)
      const deletedTrip = await TripModel.findOneAndDelete({
        userId: userId, // ensure user1 cannot delete user2's trips
        _id: new mongoose.Types.ObjectId(id),
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

const getShuffledIndexes = () => {
  const unshuffledList = Array.from(Array(NUM_TAILWIND_COLORS).keys())
  // shuffle credits: https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
  // eslint-disable-next-line no-unused-vars
  return unshuffledList.sort((a, b) => 0.5 - Math.random())
}
