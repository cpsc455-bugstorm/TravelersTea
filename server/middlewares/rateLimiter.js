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
    if (Object.keys(request.body).length !== 0) {
      console.log('Host:', request.headers.host)
      console.log('User-Agent:', request.headers['user-agent'])
      console.log('Referer:', request.headers.referer)
      console.log('CF-IPCountry:', request.headers['cf-ipcountry'])
      console.log('X-Forwarded-Proto:', request.headers['x-forwarded-proto'])
      console.log('X-Forwarded:', request.headers['x-forwarded-for'])
      console.log('X-Request-Start:', request.headers['x-request-start'])
      console.log('User ID:', request.userId)
      console.log('Is Admin:', request.isAdmin)
      console.log('Request Body:', request.body)
    }
    return request.isAdmin || config.server.env === 'TEST'
  },
})

module.exports = apiLimiter
