const openaiClient = require('./openaiClient')

async function generateItinerary(constraints) {
  try {
    const conversation = [
      {
        role: 'system',
        content: `You are an AI that generates travel itineraries. Respond with JSON that contains the plan for each stage. If there are any confusing values, respond with an error.`,
      },
      {
        role: 'user',
        content: `Generate a travel itinerary based on these constraints: ${constraints}`,
      },
    ]

    const response = await openaiClient.post(
      '/v1/engines/davinci-codex/completions',
      {
        model: 'codex',
        messages: conversation,
        max_tokens: 200,
        n: 1,
        stop: null,
        temperature: 0.8,
        top_p: 1,
      },
    )

    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0
    ) {
      return response.data.choices[0].text.trim()
    }

    return 'Unable to generate a travel itinerary. Please try again later.'
  } catch (error) {
    console.error('Error while generating itinerary:', error)
    throw error
  }
}

module.exports = generateItinerary
