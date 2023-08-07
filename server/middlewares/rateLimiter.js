/* eslint-disable no-unused-vars */
const rateLimit = require('express-rate-limit')
const config = require('../config/config')

const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  max: config.server.rateLimit,
  message: 'You have exceeded the 10 trip requests in 24 hours limit!',
  headers: true,
  skipFailedRequests: true,
  keyGenerator: (req) => {
    console.log(req.headers)
    return req.headers['true-client-ip'] || req.ip
  },
  requestWasSuccessful: (request, response) => {
    return response.isTripAPI && response.statusCode < 400
  },
  skip: (request, response) => {
    console.log(
      request.ip,
      request.userId,
      request.isAdmin,
      request.headers['x-forwarded-for'],
      request.headers,
    )
    return request.isAdmin || config.server.env === 'TEST'
  },
})

module.exports = apiLimiter
