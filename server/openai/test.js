/*
 Simple test example of usage of generateItinerary function
 Run via `node openai/test.js` from `server/` or wherever the .env file with the openai key is
*/

const generateItinerary = require('./generateItinerary')
const TripModel = require('../models/TripModel')

const tripConstraints = new TripModel({
  tripLocation: 'Paris',
  budget: 2000,
  numberOfDays: 5,
  stagesPerDay: 3,
  preferences: ['shopping', 'museums', 'historical landmarks'],
  _id: 'test_id',
})

;(async function testGenerateItinerary() {
  try {
    const itinerary = await generateItinerary(tripConstraints)

    console.log(`Generated itinerary for given constraints:`)
    console.log(tripConstraints)
    console.log(itinerary)
  } catch (error) {
    console.error('Error while testing generateItinerary function:', error)
  }
})()
