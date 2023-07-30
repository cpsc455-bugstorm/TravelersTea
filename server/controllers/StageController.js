const StageModel = require('../models/StageModel')
const config = require('../config/config')
const generateStage = require('../openai/generateStage')
const getCoordinatesFromLocation = require('../googleapi/googleCoordinates')
const mongoose = require('mongoose')

class StageController {
  constructor() {}

  setTripController(tripController) {
    this.tripController = tripController
  }

  async createManyStages(listOfStages, session) {
    try {
      const options = session ? { session } : undefined
      const newStages = await StageModel.insertMany(listOfStages, options)
      return newStages.map((stage) => stage.toObject())
    } catch (error) {
      error.message = 'Could not save trip | ' + error.message
      throw error
    }
  }

  async getStage(userId, id) {
    try {
      const stage = await StageModel.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        _id: new mongoose.Types.ObjectId(id),
      }).lean()
      if (!stage) {
        const error = new Error('Stage could not be found')
        error.statusCode = 404
        throw error
      }
      delete stage.userId
      return stage
    } catch (error) {
      error.message = 'Could not fetch stage | ' + error.message
      throw error
    }
  }

  async getStagesByTripId(userId, tripId) {
    try {
      const trip = await this.tripController.getTrip(userId, tripId)
      const stagesPerTripId = await StageModel.find({
        tripId: new mongoose.Types.ObjectId(tripId),
        userId: new mongoose.Types.ObjectId(userId),
      })
        .sort({ dayIndex: 1, stageIndex: 1 })
        .lean()
      return partitionStagesByDay(stagesPerTripId, trip.stagesPerDay)
    } catch (error) {
      error.message = 'Could not fetch all stages for trip | ' + error.message
      throw error
    }
  }

  async updateStage(userId, id, { updateNotes, stage, trip }) {
    try {
      // Call Openai
      let newStageResponse = JSON.parse(
        await generateStage(trip, stage, updateNotes),
      )
      // Parse response
      if (newStageResponse.error) {
        throw new Error(
          'Openai response returned an error: ' + newStageResponse.error, // this is a error message
        )
      }
      // Get Coordinates
      let coords = await getCoordinatesFromLocation(
        trip.tripLocation,
        newStageResponse.newStage.stageLocation,
      )
      const newStage = await StageModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id),
          userId: new mongoose.Types.ObjectId(userId),
        },
        {
          $set: {
            stageLocation: newStageResponse.newStage.stageLocation,
            emoji: newStageResponse.newStage.emoji,
            description: newStageResponse.newStage.description,
            stageLatitude: coords.lat,
            stageLongitude: coords.lng,
          },
        },
        { new: true },
      ).lean()

      if (!newStage) {
        const error = new Error('Stage could not be found')
        error.statusCode = 404
        throw error
      }

      delete newStage.userId
      return newStage
    } catch (error) {
      error.message = 'Could not update stage | ' + error.message
      throw error
    }
  }

  /**
   * @param tripId
   * @return { deletedCount: number }
   * */
  async deleteStagesByTripId(tripId, session) {
    try {
      const query = StageModel.deleteMany({ tripId: tripId })
      if (session) {
        query.session(session)
      }
      return await query
    } catch (error) {
      if (config.server.env === 'DEV')
        console.error('Error while deleting stages:', error)
      throw new Error('Could not delete all stages for given tripId')
    }
  }
}

function partitionStagesByDay(arr, stagesPerDay) {
  const stagesByDayByTrip = []

  arr.forEach((stage, index) => {
    delete stage.userId
    const startNewRow = index % stagesPerDay === 0
    if (startNewRow) {
      stagesByDayByTrip.push([stage])
    } else {
      stagesByDayByTrip[stagesByDayByTrip.length - 1].push(stage)
    }
  })

  return stagesByDayByTrip
}

module.exports = StageController
