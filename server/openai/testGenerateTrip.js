/*
 Simple test example of usage of generateTrip function
 Run via `node openai/testGenerateTrip.js` from `server/` or wherever the .env file with the openai key is
*/

const generateTrip = require('./generateTrip')
const TripModel = require('../models/TripModel')

const exampleTrip = new TripModel({
  tripLocation: 'Paris',
  budget: 2000,
  numberOfDays: 5,
  stagesPerDay: 3,
})

;(async function testGenerateTrip() {
  try {
    const trip = await generateTrip(exampleTrip)

    console.log(`Generated trip for given constraints:`)
    console.log(exampleTrip)
    console.log(JSON.parse(trip))
  } catch (error) {
    console.error('Error while testing generateTrip function:', error)
  }
})()
