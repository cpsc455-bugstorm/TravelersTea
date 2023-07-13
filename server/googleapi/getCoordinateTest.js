/* Run this file with 'yarn coordinates:test' from 'server/' */
const getStageCoordinates = require('./googleCoordinates')

const stageLocations = [
  { stageLocationName: 'Eiffel Tower', destination: 'Paris' },
  { stageLocationName: 'Tim Hortons', destination: 'Vancouver' },
  { stageLocationName: 'Stanley Park', destination: 'Vancouver' },
  { stageLocationName: 'Taste of Nawabs', destination: 'Vancouver' },
]

async function testGetCoordinates() {
  try {
    for (const { stageLocationName, destination } of stageLocations) {
      const coordinates = await getStageCoordinates(
        stageLocationName,
        destination,
      )

      console.log(
        `----- Coordinates for ${stageLocationName} in ${destination} -----`,
      )
      console.log(coordinates)
    }
  } catch (error) {
    console.error('Error while testing generateTrip function:', error)
  }
}

testGetCoordinates()
