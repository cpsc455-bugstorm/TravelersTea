const express = require('express')
const controllers = require('../controllers/Controllers')
const authMiddleware = require('../middlewares/AuthMiddleware')

class TripRoute {
  constructor() {
    this.router = express.Router()
    this.router.use(authMiddleware)
    this.router.get('', this.getAllByUserId.bind(this))
    this.router.get('/:id', this.getTripById.bind(this))
    this.router.post('', this.create.bind(this))
    this.router.patch('/:id', this.update.bind(this))
    this.router.delete('/:id', this.delete.bind(this))
    this.router.patch('/:id/share', this.enableShare.bind(this))
  }

  initRoutes(apiRouter) {
    apiRouter.use('/trips', this.router)
  }

  async getTripById(req, res) {
    try {
      const response = await controllers.tripController.getTrip(req.params.id)
      res.status(200).json([response])
    } catch (err) {
      res.status(500).json({ error: err.toString() })
    }
  }

  async getAllByUserId(req, res, next) {
    try {
      const response = await controllers.tripController.getAllByUserId(
        req.userId,
      )
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }

  async create(req, res, next) {
    try {
      const newTrip = await controllers.tripController.createTrip(
        req.userId,
        req.body,
      )
      res.status(201).json(newTrip)
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const updatedTrip = await controllers.tripController.updateTrip(
        req.userId,
        req.params.id,
        req.body,
      )
      res.status(200).json(updatedTrip)
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const deletedTrip = await controllers.tripController.deleteTrip(
        req.userId,
        req.params.id,
      )
      console.log(deletedTrip)
      res.status(200).json(deletedTrip)
    } catch (err) {
      next(err)
    }
  }

  async enableShare(req, res, next) {
    console.log('entered enable share')
    try {
      const enabledTrip = await controllers.tripController.enableShareTrip(
        req.userId,
        req.params.id,
      )
      console.log(enabledTrip)
      res.status(200).json(enabledTrip)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = TripRoute
