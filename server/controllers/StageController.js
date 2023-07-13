const StageModel = require('../models/StageModel')
const uuid = require('uuid')

class StageController {
  constructor() {}

  setTripController(tripController) {
    this.tripController = tripController
  }

  async createStage(stageData) {
    try {
      const newStage = await StageModel.create({
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...stageData,
        _id: uuid.v4(),
      })
      return newStage.toObject()
    } catch (error) {
      throw new Error(`Could not create stage: ${error}`)
    }
  }

  async getStage(id) {
    try {
      const stage = await StageModel.findById(id)
      return stage
    } catch (error) {
      throw new Error(`Could not fetch stage: ${error}`)
    }
  }

  async getStagesByTripId(tripId) {
    try {
      const trip = await this.tripController.getTrip(tripId)
      const stagesPerTripId = await StageModel.find({ tripId: tripId })
        .sort({ dayIndex: 1, stageIndex: 1 })
        .lean()
      return partitionStagesByDay(stagesPerTripId, trip.stagesPerDay)
    } catch (error) {
      throw new Error(`Could not fetch all stages for trip: ${error}`)
    }
  }

  async updateStage(id, stageData) {
    try {
      const updatedStage = await StageModel.findByIdAndUpdate(id, stageData, {
        new: true,
      }).lean()
      return updatedStage
    } catch (error) {
      throw new Error(`Could not update stage: ${error}`)
    }
  }

  async deleteStage(id) {
    try {
      const deletedStage = await StageModel.findByIdAndDelete(id).lean()
      return deletedStage
    } catch (error) {
      throw new Error(`Could not delete stage: ${error}`)
    }
  }

  /**
   * @param tripId
   * @return { deletedCount: number }
   * */
  async deleteStagesByTripId(tripId) {
    try {
      const result = await StageModel.deleteMany({ tripId: tripId })
      return result
    } catch (error) {
      throw new Error(`Could not delete all stages for given tripId: ${error}`)
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
