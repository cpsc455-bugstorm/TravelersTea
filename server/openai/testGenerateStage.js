/*
 Simple test example of usage of generateTrip function
 Run via `node openai/testGenerateTrip.js` from `server/` or wherever the .env file with the openai key is
*/

const generateStage = require('./generateStage')
const TripModel = require('../models/TripModel')
const StageModel = require('../models/StageModel')

const exampleTrip = new TripModel({
  destination: 'Paris',
  budget: 2000,
  numberOfDays: 5,
  stagesPerDay: 3,
})

const exampleStage = new StageModel({
  stageLocation: 'Eiffel Tower',
  description: 'One of the seven wonders of the world!',
  emoji: '🗼',
})

const examplePreferenceString = 'I would like to visit a food place instead'

;(async function testGenerateStage() {
  try {
    const newStage = await generateStage(
      exampleTrip,
      exampleStage,
      examplePreferenceString,
    )

    console.log(`Generated new stage for based on preference:`)
    console.log(exampleTrip)
    console.log(exampleStage)
    console.log(examplePreferenceString)
    console.log(JSON.parse(newStage))
  } catch (error) {
    console.error('Error while testing generateTrip function:', error)
  }
})()
