const express = require('express')
const controllers = require('../controllers/Controllers')

class TripRoute {
  constructor() {
    this.router = express.Router()
    this.router.get('', this.getAll.bind(this))
    this.router.get('/:id', this.getTrip.bind(this))
    this.router.post('', this.create.bind(this))
    this.router.patch('/:id', this.update.bind(this))
    this.router.delete('/:id', this.delete.bind(this))
  }

  initRoutes(apiRouter) {
    apiRouter.use('/trips', this.router)
  }

  async getTrip(req, res) {
    try {
      const response = await controllers.tripController.getTrip(req.params.id)
      res.status(200).json(response)
    } catch (err) {
      res.status(500).json({ error: err.toString() })
    }
  }

  async getAll(req, res) {
    try {
      const response = await controllers.tripController.getAll(req.query.userId)
      res.status(200).json(response)
    } catch (err) {
      res.status(500).json({ error: err.toString() })
    }
  }

  async create(req, res) {
    try {
      const newTrip = await controllers.tripController.createTrip(
        req.body.userId,
        req.body,
      )
      res.status(201).json(newTrip)
    } catch (err) {
      res.status(500).json({ error: err.toString() })
    }
  }

  async update(req, res) {
    try {
      const updatedTrip = await controllers.tripController.updateTrip(
        req.params.id,
        req.body,
      )
      if (!updatedTrip) {
        return res
          .status(404)
          .json({ error: '404: Trip not found during edit' })
      }
      res.status(200).json(updatedTrip)
    } catch (err) {
      res.status(500).json({ error: err.toString() })
    }
  }

  async delete(req, res) {
    try {
      const deletedTrip = await controllers.tripController.deleteTrip(
        req.params.id,
      )
      if (!deletedTrip) {
        return res
          .status(404)
          .json({ error: '404: Trip not found during delete' })
      }
      res.status(200).json(deletedTrip)
    } catch (err) {
      res.status(500).json({ error: err.toString() })
    }
  }
}

module.exports = TripRoute
