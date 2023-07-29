const openaiClient = require('./openaiClient')

/**
 * A function to Update a stage based on a User's preferences
 *
 * @async
 * @param {Object} trip TripModel Object - The trip information.
 * @param {Object} stage StageModel Object - The stage that needs to be edited.
 * @param {string} preference - The destination of the trip.
 *
 * If AI response exists, the function returns the response otherwise,
 * it gives an error message.
 *
 * @returns {string} A string of JSON format data which can contain
 * the generated travel itinerary or an error message.
 * Success:
 * {
 *   newStage: {
 *      stageLocation: String,
 *      description: String,
 *      emoji: String
 *   }
 * }
 * Failure:
 * {
 *   error: String (reason)
 * }
 * @throws Will throw an error if the openaiClient or AI response fails.
 */
async function generateStage(trip, stage, preference) {
  const naturalLanguageConstraints = `
      Trip Details
      Destination: ${trip.tripLocation}
  
      Current Stage Details
      Location: ${stage.stageLocation}
      Description: ${stage.description}
      Emoji: ${stage.emoji}
      
      Preference provided by user:
      Question: How would you like to update this stage?
      "${preference}"
   `
  try {
    const conversation = [
      {
        role: 'system',
        content: `You are an AI that generates travel itineraries. Respond with ONLY JSON that contains the information for the new stage. The new stage must be a real place. 
        ONLY respond with the following format, do not include any descriptions or codeblocks, I should be able to parse the output to a JavaScript Object. 
        Ensure the newStage is strictly in ${trip.tripLocation} and is a real place.
        The response needs to be formatted exactly like the following structure and updated stageLocation must be a real place name such that Google Maps can find them:.:
        '''
        {
          newStage: {
            stageLocation: String,
            description: String,
            emoji: String
          }
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
        content: `Generate a new stage based on the following details: ${naturalLanguageConstraints}, ensuring to meet ${preference}`,
      },
    ]

    const response = await openaiClient(conversation)
    if (response) {
      return response
    }
    return 'Unable to generate new stage. Please try again later.'
  } catch (error) {
    console.error('Error while generating itinerary:', error)
    throw error
  }
}

module.exports = generateStage
