/* eslint-disable no-unused-vars */
const rateLimit = require('express-rate-limit')
const config = require('../config/config')

const extraFeatureLimiter = rateLimit({
  windowMs: config.server.timeLimit,
  max: config.server.efRateLimit,
  message: `You have exceeded the ${config.server.efRateLimit} trip requests in 24 hours limit!`,
  headers: true,
  skipFailedRequests: true,
  keyGenerator: (request) => {
    return request.headers['true-client-ip'] || request.ip
  },
  requestWasSuccessful: (_, response) => {
    return response.isExtraFeature && response.statusCode < 400
  },
  skip: (request, _) => {
    return request.isAdmin || request.skipEF || config.server.env === 'TEST'
  },
})

module.exports = extraFeatureLimiter
