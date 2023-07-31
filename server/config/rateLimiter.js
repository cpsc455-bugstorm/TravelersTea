const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
  windowMs: 8 * 60 * 60 * 1000, // 8 hours
  max: 4,
  message: 'You have exceeded the 4 requests in 8 hours limit!',
  headers: true,
  skipFailedRequests: true,
})

module.exports = apiLimiter
