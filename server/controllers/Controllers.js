const UserController = require('./UserController')

const userController = new UserController()

const controllers = {
  userController: userController,
}

module.exports = controllers
