const StageModel = require('../models/StageModel')

class StageController {
  constructor() {}

  async createStage(stageData) {
    try {
      const newStage = await StageModel.create({
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...stageData,
      })
      return newStage.toObject()
    } catch (error) {
      throw new Error(`Could not create stage: ${error}`)
    }
  }

  async createManyStages(listOfStages) {
    console.log(listOfStages)
    try {
      const newStages = await StageModel.insertMany(listOfStages)
      const newStagesObjects = newStages.map((stage) => stage.toObject())
      return newStagesObjects
    } catch (error) {
      throw new Error(`Could not create stage: ${error}`)
    }
  }

  async getStage(id) {
    try {
      return await StageModel.findById(id)
    } catch (error) {
      throw new Error(`Could not fetch stage: ${error}`)
    }
  }

  async getStagesByTripId(tripId) {
    try {
      return await StageModel.find({ tripId: tripId }).lean()
    } catch (error) {
      throw new Error(`Could not fetch all stages for trip: ${error}`)
    }
  }

  async updateStage(id, stageData) {
    try {
      return await StageModel.findByIdAndUpdate(id, stageData, {
        new: true,
      }).lean()
    } catch (error) {
      throw new Error(`Could not update stage: ${error}`)
    }
  }

  async deleteStage(id) {
    try {
      return await StageModel.findByIdAndDelete(id).lean()
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
      return await StageModel.deleteMany({ tripId: tripId })
    } catch (error) {
      throw new Error(`Could not delete all stages for given tripId: ${error}`)
    }
  }
}

module.exports = StageController
