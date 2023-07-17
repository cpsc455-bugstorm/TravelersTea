const openaiClient = require('./openaiClient')

/**
 * A function to generate a travel trip itinerary with several constraints such as
 * destination, budget, number of days and stages per day by using AI conversations.
 * If number of days or stages per day is greater than 5, it returns a error message.
 *
 * @async
 * @param {Object} constraints TripModel Object - The travel constraints.
 * @param {string} constraints.tripLocation - The destination of the trip.
 * @param {number} constraints.budget - The budget for the trip.
 * @param {number} constraints.numberOfDays - The number of days for the trip.
 * @param {number} constraints.stagesPerDay - The stages per day of the trip.
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
async function generateTrip(constraints) {
  const totalPlaces = constraints.numberOfDays * constraints.stagesPerDay
  if (totalPlaces > 25) {
    throw new Error(
      `Trips must have a maximum of 25 places (user requested ${totalPlaces} places)`,
    )
  }
  const naturalLanguageConstraints = `
      Destination: ${constraints.tripLocation}
      Budget: $${constraints.budget}
      Days: ${constraints.numberOfDays}
      Stages per day: ${constraints.stagesPerDay}
   `
  const conversation = [
    {
      role: 'system',
      content: `You are an AI that generates travel itineraries. Respond with ONLY JSON that contains the plan for each stage. 
        ONLY respond with the following format, do not include any descriptions or codeblocks, I should be able to parse the output to a JavaScript Object
        The response needs to be formatted exactly like the following structure.:
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
                  stageColor: Number (Random number between 1-17)
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
      content: `Generate a travel itinerary based on these constraints: ${naturalLanguageConstraints}`,
    },
  ]

  const response = await openaiClient(conversation).then((str) =>
    JSON.parse(str),
  )

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
