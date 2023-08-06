const express = require('express')
const controllers = require('../controllers/Controllers')
const authMiddleware = require('../middlewares/AuthMiddleware')
const apiLimiter = require('../middlewares/rateLimiter')

class StageRoute {
  constructor() {
    this.router = express.Router()
    this.router.get('', authMiddleware, this.getByTripId.bind(this))
    this.router.get('/share', this.getByTripId.bind(this))
    this.router.get('/:id', authMiddleware, this.getById.bind(this))
    this.router.patch(
      '/:id',
      authMiddleware,
      apiLimiter,
      this.update.bind(this),
    )
  }

  initRoutes(apiRouter) {
    apiRouter.use('/stages', this.router)
  }

  async getById(req, res, next) {
    const stageId = req.params.id
    console.log('hitting getbyid: ', req.params.id)
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
    console.log('hitting getbytripid')
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
      res.isTripAPI = true
      res.status(200).json(updatedStage)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = StageRoute
