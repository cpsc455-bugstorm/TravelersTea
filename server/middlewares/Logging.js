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

const logErrorMiddleware = (err, req, res) => {
  console.error(err)
  if (config.server.env == 'DEV') {
    Logging.error(`ERROR at ${req.method} request for ${req.path}`)
    Logging.error(err.toString())
  }
  if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
    res.status(err.statusCode).json({ error: err.toString() })
  }
  res.status(500).json({ error: err.toString() })
}

const loggingMiddleware = {
  logRouteMiddleware,
  logErrorMiddleware,
}

module.exports = loggingMiddleware
