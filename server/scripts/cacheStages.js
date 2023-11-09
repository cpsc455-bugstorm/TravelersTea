const mongoose = require('mongoose')
const config = require('../config/config')
const Stage = require('../models/StageModel')
const DestinationController = require('../controllers/DestinationController')

const cacheStages = async () => {
  try {
    await mongoose.connect(config.mongo.uri)
    console.log('Connected to database...')

    const stages = await Stage.find({}).lean()

    const destinationController = new DestinationController()

    for (const stage of stages) {
      await destinationController.cacheStage(stage, stage.stageLocation, null)
    }

    console.log('All stages cached.')
  } catch (err) {
    console.error(err)
  } finally {
    await mongoose.connection.close()
  }
}

cacheStages()
