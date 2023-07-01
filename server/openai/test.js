/*
 Simple test example of usage of generateItinerary function
 Run via `node openai/test.js` from `server/` or wherever the .env file with the openai key is
*/

const generateItinerary = require('./generateTrip')
const TripModel = require('../models/TripModel')

const exampleItinerary = new TripModel({
  destination: 'Paris',
  budget: 2000,
  numberOfDays: 5,
  stagesPerDay: 3,
})

;(async function testGenerateItinerary() {
  try {
    const itinerary = await generateItinerary(exampleItinerary)

    console.log(`Generated itinerary for given constraints:`)
    console.log(exampleItinerary)
    console.log(itinerary)
  } catch (error) {
    console.error('Error while testing generateItinerary function:', error)
  }
})()
