const express = require('express')
const controllers = require('../controllers/Controllers')
const authMiddleware = require('../middlewares/AuthMiddleware')
class StageRoute {
  constructor() {
    this.router = express.Router()
    this.router.use(authMiddleware)
    // this.router.post('', this.create.bind(this))
    this.router.get('', this.getByTripId.bind(this))
    this.router.get('/:id', this.getById.bind(this))
    this.router.patch('/:id', this.update.bind(this))
    // this.router.delete('/:id', this.delete.bind(this))
  }

  initRoutes(apiRouter) {
    apiRouter.use('/stages', this.router)
  }

  async getById(req, res, next) {
    const stageId = req.params.id
    try {
      if (!stageId) {
        const error = new Error('Missing stageId parameter')
        error.statusCode = 400
        throw error
      }
      const response = await controllers.stageController.getStage(
        req.userId,
        stageId,
      )
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }

  async getByTripId(req, res, next) {
    const tripId = req.query.tripId
    try {
      if (!tripId) {
        const error = new Error('Missing tripId parameter')
        error.statusCode = 400
        throw error
      }
      const response = await controllers.stageController.getStagesByTripId(
        req.userId,
        tripId,
      )
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const updatedStage = await controllers.stageController.updateStage(
        req.userId,
        req.params.id,
        req.body,
      )
      res.status(200).json(updatedStage)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = StageRoute
