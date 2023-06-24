const express = require('express')
const locationController = require('./LocationController')

const router = express.Router()

router.get('/location', locationController.fetchCoordinates)

module.exports = router
