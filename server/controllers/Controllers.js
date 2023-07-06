const UserController = require('./UserController')
const TripController = require('./TripController')
const StageController = require('./StageController')

const userController = new UserController()
const tripController = new TripController()
const stageController = new StageController()

const controllers = {
  userController: userController,
  tripController: tripController,
  stageController: stageController,
}

module.exports = controllers
