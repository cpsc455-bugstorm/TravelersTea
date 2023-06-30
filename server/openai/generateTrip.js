const openaiClient = require('./openaiClient')

/**
 *
 * @param {*} constraints
 * @returns a trip object in the format of
 * {
 *  tripName: String
 *  preferences: [String]
 *  days:[
 *    [
 *      {
 *        // day 1 stage 1
 *        stageLocation: String,
 *        stageDescription:  String,
 *        colourNumber: // a random number between 1-17,
 *        emoji:  String,
 *      }, {
 *        // day 1 stage 2
 *      }, {
 *        // day 1 stage 3
 *      }
 *    ],
 *    [
 *      {
 *        // day 2 stage 1
 *        ...
 *      },
 *      {
 *        // day 2 stage 2
 *        ...
 *      }
 *    ]
 *  ]
 *}
 *
 *
 */

async function generateTrip(constraints) {
  try {
    const conversation = [
      {
        role: 'system',
        content: `You are an AI that generates travel itineraries. Respond with ONLY JSON that contains the plan for each stage. 
        ONLY respond with the following format, do not include any descriptions or codeblocks, I should be able to parse the output to a JavaScript Object
        The response needs to be formatted exactly like the following structure. Add some Food and snack stages as well with an optional: true marker.:
        '''
        {
          plan:[
            {
              day: Number
              bullet_point_summary: String (comma seperated. Can be the names of each place)
              stages:[
                {
                  stage: Number,
                  place: String,
                  description: String,
                  emoji: String (best emoji representation of stage)
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

module.exports = generateTrip
