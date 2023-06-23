const UserController = require('./UserController')
const TripController = require('./TripController')

const userController = new UserController()
const tripController = new TripController()

const controllers = {
  userController: userController,
  tripController: tripController,
}

module.exports = controllers
