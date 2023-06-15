const express = require('express')
const controllers = require('../controllers/Controllers')

class TripRoute {
  constructor() {
    this.router = express.Router()
    this.router.get('', this.getAll.bind(this))
    this.router.post('', this.create.bind(this))
    this.router.patch('/:id', this.edit.bind(this))
  }

  initRoutes(apiRouter) {
    apiRouter.use('/trip', this.router)
  }

  async getAll(req, res) {
    try {
      const response = await controllers.tripController.getAll()
      res.json(response)
    } catch (err) {
      console.error(err)
    }
  }

  async create(req, res) {
    try {
      const newTrip = await controllers.tripController.createTrip(req.body)
      res.json(newTrip)
    } catch (err) {
      console.error(err)
    }
  }

  async edit(req, res) {
    try {
      const updatedTrip = await controllers.tripController.editTrip(
        req.params.id,
        req.body,
      )
      res.json(updatedTrip)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = TripRoute
