const express = require('express')
const controllers = require('../controllers/Controllers')

class SharedRoute {
  constructor() {
    this.router = express.Router()
    this.router.get('/trip/:tripId', this.getSharedTripByTripId.bind(this))
    this.router.get('/stages/:tripId', this.getSharedStagesByTripId.bind(this))
  }

  initRoutes(apiRouter) {
    apiRouter.use('/shared', this.router)
  }

  async getSharedTripByTripId(req, res) {
    const tripId = req.params.tripId
    if (!tripId) {
      res.status(400).json({ error: 'Missing tripId parameter' })
      return
    }

    try {
      const response = await controllers.tripController.getSharedTrip(tripId)
      res.status(200).json([response])
    } catch (err) {
      res.status(500).json({ error: err.toString() })
    }
  }

  async getSharedStagesByTripId(req, res) {
    const tripId = req.params.tripId
    console.log('req.params.tripId', req.params.tripId)
    if (!tripId) {
      res.status(400).json({ error: 'Missing tripId parameter' })
      return
    }

    try {
      const response =
        await controllers.stageController.getStagesBySharedTripId(tripId)
      res.status(200).json(response)
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.toString() })
    }
  }
}

module.exports = SharedRoute
