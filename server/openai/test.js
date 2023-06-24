/*
 Simple test example of usage of generateItinerary function
 Run via `node openai/test.js` from `server/` or wherever the .env file with the openai key is
*/

const generateItinerary = require('./generateItenerary')
const Itinerary = require('../models/itineraryModel')

const exampleItinerary = new Itinerary({
  destination: 'Paris',
  budget: 2000,
  days: 5,
  stages: 3,
  preferences: ['shopping', 'museums', 'historical landmarks'],
})

;(async function testGenerateItinerary() {
  try {
    const itineraryConstraints = `
      Destination: ${exampleItinerary.destination}
      Budget: $${exampleItinerary.budget}
      Days: ${exampleItinerary.days}
      Stages per day: ${exampleItinerary.stages}
      Preferences: ${exampleItinerary.preferences.join(', ')}
    `

    const itinerary = await generateItinerary(itineraryConstraints)

    console.log(`Generated itinerary for given constraints:`)
    console.log(itineraryConstraints)
    console.log(itinerary)
  } catch (error) {
    console.error('Error while testing generateItinerary function:', error)
  }
})()
