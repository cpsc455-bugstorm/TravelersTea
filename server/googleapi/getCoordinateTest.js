/* Run this file with 'yarn coordinates:test' from 'server/' */
const getCoordinatesFromLocation = require('./googleCoordinates')

const stageLocations = [
  { stageLocationName: 'Eiffel Tower', destination: 'Paris', rating: true },
  { stageLocationName: 'Tim Hortons', destination: 'Vancouver', rating: true },
  { stageLocationName: 'Stanley Park', destination: 'Vancouver', rating: true },
  {
    stageLocationName: 'Taste of Nawabs',
    destination: 'Vancouver',
    rating: true,
  },
  { stageLocationName: '', destination: 'Vancouver', rating: false },
  { stageLocationName: '', destination: 'Paris', rating: false },
  { stageLocationName: '', destination: 'Beijing', rating: false },
  { stageLocationName: '', destination: 'London', rating: false },
]

async function testGetCoordinates() {
  try {
    for (const { stageLocationName, destination, rating } of stageLocations) {
      const coordinates = await getCoordinatesFromLocation(
        destination,
        stageLocationName,
        rating,
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
