const openaiClient = require('./openaiClient')

async function generateItinerary(constraints) {
  try {
    const conversation = [
      {
        role: 'system',
        content: `You are an AI that generates travel itineraries. Respond with JSON that contains the plan for each stage. 
        Only respond with the following format:
        {
          plan:[
            {
              stage: Number,
              place: String,
              description: String,
              address: String,
            }
          ]
        }
        
        If there are any confusing values respond with:
        {
          error: String (reason)
        }
        `,
      },
      {
        role: 'user',
        content: `Generate a travel itinerary based on these constraints: ${constraints}`,
      },
    ]

    const response = await openaiClient(conversation)

    if (
      response.choices &&
      response.choices.length > 0 &&
      response.choices[0].message.content
    ) {
      return response.choices[0].message.content.trim()
    }

    return 'Unable to generate a travel itinerary. Please try again later.'
  } catch (error) {
    console.error('Error while generating itinerary:', error)
    throw error
  }
}

module.exports = generateItinerary
