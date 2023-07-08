const UserController = require('./UserController')
const TripController = require('./TripController')
const StageController = require('./StageController')

const stageController = new StageController()
const tripController = new TripController(stageController)
const userController = new UserController(tripController)

const controllers = {
  userController: userController,
  tripController: tripController,
  stageController: stageController,
}

module.exports = controllers
