const chalk = require('chalk')
const config = require('../config/config')
class Logging {
  static info(args) {
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}] [INFO] `),
      typeof args === 'string' ? chalk.blueBright(args) : args,
    )
  }

  static warn(args) {
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}] [INFO] `),
      typeof args === 'string' ? chalk.yellowBright(args) : args,
    )
  }

  static error(args) {
    console.log(
      chalk.red(`[${new Date().toLocaleString()}] [INFO] `),
      typeof args === 'string' ? chalk.redBright(args) : args,
    )
  }
}

const logRouteMiddleware = (req, res, next) => {
  if (config.server.env == 'DEV') {
    Logging.info(`Received ${req.method} request for ${req.path}`)
  }
  next()
}

const logErrorMiddleware = (err, req, res, next) => {
  console.error(err)
  Logging.error(`ERROR at ${req.method} request for ${req.path}`)
  Logging.error(err.toString())
  next(err)
}

const loggingMiddleware = {
  logRouteMiddleware,
  logErrorMiddleware,
}

module.exports = loggingMiddleware
