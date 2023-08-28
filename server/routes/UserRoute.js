const express = require('express')
const controllers = require('../controllers/Controllers')
const apiLimiter = require('../middlewares/rateLimiter')
const extraFeatureLimiter = require('../middlewares/extraFeatureRateLimiter')

class UserRoute {
  constructor() {
    this.router = express.Router()
    // the this.getAll.bind(this) is basically saying
    // when I hit /api/example in a get request, I am going
    // to call the getAll function
    this.router.post('/register', apiLimiter, this.register.bind(this))
    this.router.post('/login', this.login.bind(this))
    this.router.get('/limit-left', apiLimiter, this.fetchLimitLeft.bind(this))
    this.router.get(
      '/ef-limit-left',
      extraFeatureLimiter,
      this.fetchEFLimitLeft.bind(this),
    )
  }

  initRoutes(apiRouter) {
    apiRouter.use('/users', this.router)
  }
  async fetchLimitLeft(req, res, next) {
    try {
      const response = {
        attemptLeft: req.rateLimit.remaining + 1,
      }

      res.isTripAPI = false
      res.json(response)
    } catch (err) {
      next(err)
    }
  }
  async fetchEFLimitLeft(req, res, next) {
    try {
      const response = {
        efAttemptLeft: req.rateLimit.remaining + 1,
      }

      res.isTripAPI = false
      res.json(response)
    } catch (err) {
      next(err)
    }
  }
  async register(req, res, next) {
    try {
      const userData = req.body
      const response = await controllers.userController.register(userData)

      res.isTripAPI = false
      res.json(response)
    } catch (err) {
      next(err)
    }
  }
  async login(req, res, next) {
    try {
      const userData = req.body
      const response = await controllers.userController.login(userData)

      res.json(response)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserRoute
