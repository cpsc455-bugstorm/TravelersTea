/* Run this file with 'yarn coordinates:test' from 'server/' */
const getCoordinatesFromLocation = require('./googleCoordinates')

const stageLocations = [
  { stageLocationName: 'Eiffel Tower', destination: 'Paris' },
  { stageLocationName: 'Tim Hortons', destination: 'Vancouver' },
  { stageLocationName: 'Stanley Park', destination: 'Vancouver' },
  { stageLocationName: 'Taste of Nawabs', destination: 'Vancouver' },
  { stageLocationName: '', destination: 'Vancouver' },
  { stageLocationName: 'Eiffel Tower', destination: 'Paris' },
  { stageLocationName: '', destination: 'Osaka, Japan' },
  { stageLocationName: '', destination: 'Beijing' },
  { stageLocationName: '', destination: 'London' },
]

async function testGetCoordinates() {
  try {
    for (const { stageLocationName, destination } of stageLocations) {
      const coordinates = await getCoordinatesFromLocation(
        destination,
        stageLocationName,
      )

      console.log(
        `----- Coordinates for ${stageLocationName} in ${destination} -----`,
      )
      console.log(coordinates)
    }
  } catch (error) {
    console.error('Error while testing getStageCoordinates function:', error)
  }
}

testGetCoordinates()
