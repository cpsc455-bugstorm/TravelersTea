const StageModel = require('../models/StageModel')
const uuid = require('uuid')

class StageController {
  constructor() {}

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
      const stagesPerTripId = await StageModel.find({ tripId: tripId }).lean()
      return stagesPerTripId
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

module.exports = StageController
