const openaiClient = require('./openaiClient')

/**
 * This async function leverages an AI to generate a travel itinerary based on constraints provided.
 * The AI responds in JSON format containing the plan for each day of the trip.
 *
 * @param {Object} constraints
 * @param {string} constraints.tripLocation - The travel destination.
 * @param {number} constraints.budget - The budget for the trip.
 * @param {number} constraints.numberOfDays - The number of days for the trip.
 * @param {number} constraints.stagesPerDay - The travel stages per day.
 * @param {string[]} constraints.preferences - An array of preferences for the trip.
 *
 * @returns {Promise<Object|string>} Returns a JSON object with travel itinerary stages OR an error message.
 * The stages are in the following format:
 * {
 *   stages: [
 *     {
 *       dayIndex: Number,
 *       stageIndex: Number,
 *       stageLocation: String,
 *       description: String,
 *       emoji: String (best Unicode code representation of stage)
 *     }
 *   ]
 * }
 * OR
 * {
 *   error: String (reason)
 * }
 * @throws {Error} Will throw an error if there's an issue in generating itinerary.
 */
async function generateItinerary(constraints) {
  const tripConstraintsNaturalLanguage = `
      Destination: ${constraints.tripLocation}
      Budget: $${constraints.budget}
      Days: ${constraints.numberOfDays}
      Stages per day: ${constraints.stagesPerDay}
      Preferences: ${constraints.preferences.join(', ')}
  `
  try {
    const conversation = [
      {
        role: 'system',
        content: `You are an AI that generates travel itineraries. Respond with ONLY JSON that contains the plan for each stage. 
        ONLY respond with the following format, do not include any descriptions or codeblocks, I should be able to parse the output to a JavaScript Object
        The response needs to be formatted exactly like the following structure. Add some Food and snack stages as well with an optional: true marker; 
        otherwise, do NOT return more days nor stages than requested.:
        '''
        {
          stages: [
            {
              dayIndex: Number
              stageIndex: Number,
              stageLocation: String,
              description: String,
              emoji: String (best Unicode code representation of stage)
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
        content: `Generate a travel itinerary based on these constraints: ${tripConstraintsNaturalLanguage}`,
      },
    ]

    const response = await openaiClient(conversation)
    if (response) {
      return response
    }
    return 'Unable to generate a travel itinerary. Please try again later.'
  } catch (error) {
    console.error('Error while generating itinerary:', error)
    throw error
  }
}

module.exports = generateItinerary
