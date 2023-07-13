require('dotenv').config()
const axios = require('axios')

async function getAPIResponse(destination, stageLocationName) {
  const query = `${stageLocationName} ${destination}`
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

    return response.data.results[0]
  } catch (error) {
    console.error('Error while fetching place details:', error)
    throw error
  }
}

async function getStageLatitude(results) {
  const { location } = results.geometry
  return location.lat
}

async function getStageLongitude(results) {
  const { location } = results.geometry
  return location.lng
}

async function getStageRating(results) {
  const { rating } = results
  return rating
}

module.exports = {
  getAPIResponse,
  getStageLatitude,
  getStageLongitude,
  getStageRating,
}
