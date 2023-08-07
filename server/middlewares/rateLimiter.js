/* eslint-disable no-unused-vars */
const rateLimit = require('express-rate-limit')
const config = require('../config/config')

const apiLimiter = rateLimit({
  windowMs: config.server.timeLimit,
  max: config.server.rateLimit,
  message: `You have exceeded the ${config.server.rateLimit} trip requests in 24 hours limit!`,
  headers: true,
  skipFailedRequests: true,
  keyGenerator: (request) => {
    return request.headers['true-client-ip'] || request.ip
  },
  requestWasSuccessful: (_, response) => {
    return response.isTripAPI && response.statusCode < 400
  },
  skip: (request, _) => {
    console.log(request.userId, request.isAdmin, request.headers)
    return request.isAdmin || config.server.env === 'TEST'
  },
})

module.exports = apiLimiter
