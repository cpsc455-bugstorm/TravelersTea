const express = require('express')
const controllers = require('../controllers/Controllers')

class StageRoute {
  constructor() {
    this.router = express.Router()
    this.router.get('', this.getByTripId.bind(this))
  }

  initRoutes(apiRouter) {
    apiRouter.use('/stages', this.router)
  }

  async create(req, res) {
    try {
      const newStage = await controllers.stageController.createStage(req.body)
      res.status(201).json(newStage)
    } catch (err) {
      res.status(500).json({ error: err.toString() })
    }
  }

  async getByTripId(req, res) {
    const tripId = req.query.tripId
    if (!tripId) res.status(400).json({ error: 'Missing tripId parameter' })

    try {
      const response = await controllers.stageController.getStagesByTripId(
        tripId,
      )
      res.status(200).json(response)
    } catch (err) {
      res.status(500).json({ error: err.toString() })
    }
  }

  async update(req, res) {
    try {
      const updatedStage = await controllers.stageController.updateStage(
        req.params.id,
        req.body,
      )
      if (!updatedStage) {
        return res
          .status(404)
          .json({ error: '404: Stage not found during edit' })
      }
      res.status(200).json(updatedStage)
    } catch (err) {
      res.status(500).json({ error: err.toString() })
    }
  }

  async delete(req, res) {
    try {
      const deletedStage = await controllers.stageController.deleteStage(
        req.params.id,
      )
      if (!deletedStage) {
        return res
          .status(404)
          .json({ error: '404: Trip not found during delete' })
      }
      res.status(200).json(deletedStage)
    } catch (err) {
      res.status(500).json({ error: err.toString() })
    }
  }
}

module.exports = StageRoute
