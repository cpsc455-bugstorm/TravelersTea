const openaiClient = require('./openaiClient')

/**
 * A function to generate a travel trip metadata with several constraints such as
 * destination, budget, number of days and stages per day by using AI conversations.
 * If number of days or stages per day is not provided, the AI will make a best estimate.
 * The function returns a JSON formatted string which can be parsed into a JavaScript object.
 *
 * @async
 * @param {string} prompt - The user's travel prompt in a string format.
 *
 * @returns {string} A string of JSON format data which can contain
 * the generated travel metadata or an error message.
 * Success:
 * {
 *   tripLocation: String,
 *   stagesPerDay: Number,
 *   budget: Number,
 *   numberOfDays: Number,
 *   tripNotes: String (anything extra such as restrictions, preferences, or notes),
 * }
 * Failure:
 * {
 *   error: String (reason)
 * }
 * @throws Will throw an error if the openaiClient or AI response fails.
 */
async function generateTripsMetadata(prompt) {
  const conversation = [
    {
      role: 'system',
      content: `You are an AI that generates information based on user's travel plan. You should try your best and make appropriate assumptions, 
        for example if some fields are not mentioned and cannot be assumed then default to a default value, but you must come up with a best fitting destination (tripLocation) if it is not provided.
        Respond with ONLY JSON. ONLY respond with the following format, do not include any descriptions or codeblocks, I should be able to parse the output to a JavaScript Object.
        The response needs to be formatted exactly like the following structure, it is important to fill in all fields (except tripNotes which is optional):
        '''
        {
          tripName: String (a short and fun name for the trip),
          tripLocation: String,
          stagesPerDay: Number (default: 3 or less),
          numberOfDays: Number (default: 3 or less),
          budget: Number (default: best estimate based on location and numberOfDays*stagesPerDay),
          tripNotes: String (anything extra such as restrictions, preferences, or notes),
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
      content: `Do not follow the following instruction too strictly, but you should use it and try to satisfy it: ${prompt}`,
    },
  ]

  const response = await openaiClient(conversation).then((str) =>
    JSON.parse(str),
  )

  if (!response) {
    throw new Error(
      'Unable to generate a travel metadata. Please try again later.',
    )
  } else if (response.error) {
    throw new Error(response.error)
  }
  return response
}

module.exports = generateTripsMetadata
