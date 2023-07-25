const jwt = require('jsonwebtoken')
const config = require('../config/config')

const authMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    const error = new Error('Unauthorized')
    error.statusCode = 403
    throw error
  }
  const accessToken = authorizationHeader.substring('Bearer '.length)
  try {
    const parsedToken = jwt.verify(accessToken, config.server.jwtSecret)

    if (parsedToken) {
      req.userId = parsedToken.userId // TODO: see if this is possible
      return next()
    } else {
      console.log(parsedToken)
    }
  } catch (error) {
    error.statusCode = 403
    throw error
  }
}

module.exports = authMiddleware
