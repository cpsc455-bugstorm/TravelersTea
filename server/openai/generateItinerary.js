const openaiClient = require('./openaiClient')

async function generateItinerary(constraints) {
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
        content: `Generate a travel itinerary based on these constraints: ${constraints}`,
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
