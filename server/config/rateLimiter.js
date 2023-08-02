/* eslint-disable no-unused-vars */
const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
  windowMs: 8 * 60 * 60 * 1000, // 8 hours
  max: 4,
  message: 'You have exceeded the 4 trip requests in 8 hours limit!',
  headers: true,
  skipFailedRequests: true,
  requestWasSuccessful: (request, response) => {
    return response.isTripAPI && response.statusCode < 400
  },
  skip: (request, response) => {
    console.log(request.ip, request.userId, request.isAdmin)
    return request.isAdmin
  },
})

module.exports = apiLimiter
