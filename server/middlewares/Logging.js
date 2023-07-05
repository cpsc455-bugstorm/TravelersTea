const chalk = require('chalk')
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

const generalLoggingMiddleware = (tokens, req, res) => {
  const method = tokens.method(req, res)
  const url = tokens.url(req, res)
  const status = tokens.status(req, res)
  const responseTime = tokens['response-time'](req, res)
  if (res.err) {
    Logging.error(
      `Received ${method} at ${url}  Status: ${status}  Response Time: ${responseTime} ms`,
    )
    Logging.error(res.err.toString())
    console.error(res.err)
    return
  }
  Logging.info(
    `Received ${method} at ${url}  Status: ${status}  Response Time: ${responseTime} ms`,
  )
}

const errorLoggingMiddleware = (err, req, res, next) => {
  res.err = err
  next(err)
}

const loggingMiddleware = {
  generalLoggingMiddleware,
  errorLoggingMiddleware,
}

module.exports = loggingMiddleware
