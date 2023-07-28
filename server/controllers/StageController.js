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

  // async createStage(stageData) {
  //   try {
  //     const newStage = await StageModel.create({
  //       // eslint-disable-next-line node/no-unsupported-features/es-syntax
  //       ...stageData,
  //     })
  //     return newStage.toObject()
  //   } catch (error) {
  //     if (config.server.env === 'DEV')
  //       console.error('Error while creating stage:', error)
  //     throw new Error(`Could not create stage`)
  //   }
  // }

  async createManyStages(listOfStages, session) {
    console.log(listOfStages)

    try {
      const options = session ? { session } : undefined
      const newStages = await StageModel.insertMany(listOfStages, options)
      return newStages.map((stage) => stage.toObject())
    } catch (error) {
      if (config.server.env === 'DEV')
        console.error('Error while creating stages:', error)
      throw new Error('Could not create stages')
    }
  }

  async getStage(userId, id) {
    try {
      return await StageModel.findOne({
        userId: userId,
        _id: new mongoose.Types.ObjectId(id),
      })
    } catch (error) {
      if (config.server.env === 'DEV')
        console.error('Error while fetching stages:', error)
      throw new Error('Could not fetch all stages for trip')
    }
  }

  async getStagesByTripId(userId, tripId) {
    try {
      const trip = await this.tripController.getTrip(tripId)
      const stagesPerTripId = await StageModel.find({
        tripId: tripId,
        userId: userId,
      })
        .sort({ dayIndex: 1, stageIndex: 1 })
        .lean()
      return partitionStagesByDay(stagesPerTripId, trip.stagesPerDay)
    } catch (error) {
      throw new Error(`Could not fetch all stages for trip: ${error}`)
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
          'openai response returned an error: ' + newStageResponse.error,
        )
      }
      // Get Coordinates
      let coords = await getCoordinatesFromLocation(
        trip.tripLocation,
        newStageResponse.newStage.stageLocation,
      )
      // Update DB
      // Return success message
      await StageModel.updateOne(
        { _id: stage._id, userId: userId },
        {
          $set: {
            stageLocation: newStageResponse.newStage.stageLocation,
            emoji: newStageResponse.newStage.emoji,
            description: newStageResponse.newStage.description,
            stageLatitude: coords.lat,
            stageLongitude: coords.lng,
          },
        },
      )
      return await StageModel.findById(stage._id)
    } catch (error) {
      if (config.server.env === 'DEV')
        console.error('Could not update stage:', error)
      throw new Error('Could not update stage')
    }
  }

  async deleteStage(userId, id) {
    try {
      return await StageModel.findOneAndDelete({
        userId: userId,
        _id: new mongoose.Types.ObjectId(id), // ensure user1 cannot delete user2's trips
      }).lean()
    } catch (error) {
      if (config.server.env === 'DEV')
        console.error('Error while deleting stages:', error)
      throw new Error('Could not delete all stages for given id')
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

  arr.forEach((item, index) => {
    const startNewRow = index % stagesPerDay === 0
    if (startNewRow) {
      stagesByDayByTrip.push([item])
    } else {
      stagesByDayByTrip[stagesByDayByTrip.length - 1].push(item)
    }
  })

  return stagesByDayByTrip
}

module.exports = StageController
