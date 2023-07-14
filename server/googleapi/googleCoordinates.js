require('dotenv').config()
const axios = require('axios')

/**
 Retrieves the coordinates of a stage location using Google Places API.
 @param {string} destinationCity - The destinationCity of the stage.
 @param {string} stageLocationName - The name of the stage location.
 @returns {object} The coordinates of the stage location as an object { lat: number, lng: number }
 @throws {Error} If there is an error while fetching place details.
 */
async function getCoordinatesFromLocation(destinationCity, stageLocationName) {
  console.log('Getting location for: ', destinationCity, stageLocationName)
  const query = `${stageLocationName} ${destinationCity}`
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json'

  try {
    const response = await axios.get(url, {
      params: {
        query: query,
        inputtype: 'textquery',
        fields: 'geometry',
        key: apiKey,
      },
    })

    const { location } = response.data.results[0].geometry
    return location
  } catch (error) {
    console.error('Error while fetching place details:', error)
    throw error
  }
}

module.exports = getCoordinatesFromLocation
