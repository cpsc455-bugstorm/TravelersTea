const TripModel = require('../models/TripModel')
const generateTrip = require('../openai/generateTrip')
const generateTripsMetadata = require('../openai/generateTripMetadata')
const getCoordinatesFromLocation = require('../googleapi/googleCoordinates')
const config = require('../config/config')

const NUM_TAILWIND_COLORS = 17

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
    const shuffledColorIndexes = getShuffledIndexes()
    let maxLat = Number.NEGATIVE_INFINITY
    let minLat = Number.POSITIVE_INFINITY
    let maxLng = Number.NEGATIVE_INFINITY
    let minLng = Number.POSITIVE_INFINITY

    for (let day of days) {
      const index = days.indexOf(day)
      const colorNumber = shuffledColorIndexes[index % NUM_TAILWIND_COLORS]
      const stagesToAddFromDay = await this.parseStagesFromDay(
        day,
        _tripId,
        tripLocation,
        colorNumber,
      )
      for (let stage of stagesToAddFromDay) {
        stagesToAdd.push(stage)
        maxLat = Math.max(maxLat, stage.stageLatitude)
        minLat = Math.min(minLat, stage.stageLatitude)
        maxLng = Math.max(maxLng, stage.stageLongitude)
        minLng = Math.min(minLng, stage.stageLongitude)
      }
    }
    console.log(maxLat, minLat, maxLng, minLng)
    const centerLat = (maxLat + minLat) / 2
    const centerLng = (maxLng + minLng) / 2
    console.log(centerLat, centerLng)
    return { stagesToAdd, centerLat, centerLng }
  }

  async parseStagesFromDay(day, tripId, tripLocation, colorNumber) {
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
        colorNumber: colorNumber,
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
      const tripToSave = {
        tripName: filteredTripData.tripName,
        tripLocation: filteredTripData.tripLocation,
        stagesPerDay: filteredTripData.stagesPerDay,
        budget: filteredTripData.budget,
        numberOfDays: filteredTripData.numberOfDays,
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
      const { stagesToAdd, centerLat, centerLng } =
        await this.parseStagesFromMultipleDays(
          days,
          savedTrip._id,
          filteredTripData.tripLocation,
        )
      await this.stageController.createManyStages(stagesToAdd)

      tripToSave.tripLongitude = centerLng
      tripToSave.tripLatitude = centerLat

      console.log(tripToSave)

      savedTrip = await TripModel.findByIdAndUpdate(savedTrip._id, tripToSave, {
        new: true,
      })

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

const getShuffledIndexes = () => {
  const unshuffledList = Array.from(Array(NUM_TAILWIND_COLORS).keys())
  // shuffle credits: https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
  // eslint-disable-next-line no-unused-vars
  return unshuffledList.sort((a, b) => 0.5 - Math.random())
}
