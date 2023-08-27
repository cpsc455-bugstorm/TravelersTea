const openaiClient = require('./openaiClient')

async function generateDestination(constraints, locationsToAvoid = []) {
  const totalPlaces = constraints.numberOfDays * constraints.stagesPerDay
  if (totalPlaces > 25) {
    throw new Error(
      `Trips must have a maximum of 25 places (user requested ${totalPlaces} places)`,
    )
  }
  const naturalLanguageConstraints = `
      Destination: ${constraints.tripLocation}
      Budget per Day: $${constraints.budget}
      Number of Places: ${totalPlaces}
      Specific Locations to Avoid: ${locationsToAvoid.join(', ')}
   `
  const conversation = [
    {
      role: 'system',
      content: `You are an AI that generates travel itineraries. Respond with ONLY JSON that contains the plan for each stage. 
        ONLY respond with the following format, do not include any descriptions or codeblocks, I should be able to parse the output to a JavaScript Object.
        The response needs to be formatted exactly like the following structure and the 'l' (location's name) should be real places names such that Google Maps can find them:
        '''
        {
          s: [
            {
              i: Number (the current index starting from 1),
              l: String (the location's name),
              d: String (best description around 25 words),
              e: String  (best emoji representation of stage),
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

module.exports = generateDestination
