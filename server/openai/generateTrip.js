const openaiClient = require('./openaiClient')

/**
 * A function to generate a travel trip itinerary with several constraints such as
 * destination, budget, number of days and stages per day by using AI conversations.
 * If number of days or stages per day is greater than 5, it returns a error message.
 *
 * @async
 * @param {Object} constraints TripModel Object - The travel constraints.
 * @param {Object} locationsToAvoid - specifies the places to avoid, optional and defaults to []
 * @param {string} constraints.tripLocation - The destination of the trip.
 * @param {number} constraints.budget - The budget per day for the trip.
 * @param {number} constraints.numberOfDays - The number of days for the trip.
 * @param {number} constraints.stagesPerDay - The stages per day of the trip.
 * @param {string} constraints.tripNotes - The extra note and/or restriction for the trip.
 *
 * If AI response exists, the function returns the response otherwise,
 * it gives an error message.
 *
 * @returns {string} A string of JSON format data which can contain
 * the generated travel itinerary or an error message.
 * Success:
 * {
 *   days:[
 *     {
 *       day: Number
 *       stages:[
 *         {
 *           stageIndex: Number,
 *           stageLocationName: String,
 *           stageDescription: String,
 *           stageEmoji: String (best emoji representation of stage),
 *           stageColor: Number (Random number between 1-17)
 *         }
 *       ]
 *     }
 *   ]
 * }
 * Failure:
 * {
 *   error: String (reason)
 * }
 * @throws Will throw an error if the openaiClient or AI response fails.
 */
async function generateTrip(constraints, locationsToAvoid = []) {
  const totalPlaces = constraints.numberOfDays * constraints.stagesPerDay
  if (totalPlaces > 25) {
    throw new Error(
      `Trips must have a maximum of 25 places (user requested ${totalPlaces} places)`,
    )
  }
  const naturalLanguageConstraints = `
      Destination: ${constraints.tripLocation}
      Budget per Day: $${constraints.budget}
      Days: ${constraints.numberOfDays}
      Stages per Day: ${constraints.stagesPerDay}
      Specific locations to avoid: ${locationsToAvoid.join(', ')}
   `
  const conversation = [
    {
      role: 'system',
      content: `You are an AI that generates travel itineraries. Respond with ONLY JSON that contains the plan for each stage. 
        ONLY respond with the following format, do not include any descriptions or codeblocks, I should be able to parse the output to a JavaScript Object.
        The response needs to be formatted exactly like the following structure and the stageLocationName should be real places names such that Google Maps can find them:
        '''
        {
          days:[
            {
              day: Number
              stages:[
                {
                  stageIndex: Number,
                  stageLocationName: String,
                  stageDescription: String,
                  stageEmoji: String (best emoji representation of stage),
                }
              ]
            }
          ]
        }
        '''
        
        If there are any confusing values respond with:
        '''
        {
          error: String (reason)
        }
        '''
        `,
    },
    {
      role: 'user',
      content: `${constraints.tripNotes} (This is not a strict constraint, You should still find real places names). Generate a travel itinerary based on these constraints: ${naturalLanguageConstraints}`,
    },
  ]

  const tripJson = await openaiClient(conversation)
  const response = JSON.parse(tripJson)

  if (!response) {
    throw new Error(
      'Unable to generate a travel itinerary. Please try again later.',
    )
  } else if (response.error) {
    throw new Error(response.error)
  }
  return response
}

module.exports = generateTrip
