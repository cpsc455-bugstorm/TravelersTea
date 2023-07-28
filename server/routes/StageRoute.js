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
    this.router.delete('/:id', this.delete.bind(this))
  }

  initRoutes(apiRouter) {
    apiRouter.use('/stages', this.router)
  }

  // async create(req, res) {
  //   try {
  //     const newStage = await controllers.stageController.createStage(req.body)
  //     res.status(201).json(newStage)
  //   } catch (err) {
  //     res.status(500).json({ error: err.toString() })
  //   }
  // }

  async getById(req, res) {
    const stageId = req.params.id
    if (!stageId) res.status(400).json({ error: 'Missing stageId parameter' })

    try {
      const response = await controllers.stageController.getStage(
        req.userId,
        stageId,
      )
      res.status(200).json(response)
    } catch (err) {
      res.status(500).json({ error: err.toString() })
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

  async update(req, res) {
    try {
      const updatedStage = await controllers.stageController.updateStage(
        req.userId,
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
        req.userId,
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
