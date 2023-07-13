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
  try {
    const { location } = results.geometry
    return location.lat
  } catch (error) {
    console.error('Error occurred in getStageLatitude:', error)
    throw error
  }
}

async function getStageLongitude(results) {
  try {
    const { location } = results.geometry
    return location.lng
  } catch (error) {
    console.error('Error occurred in getStageLongitude:', error)
    throw error
  }
}

async function getStageRating(results) {
  try {
    const { rating } = results
    return rating
  } catch (error) {
    console.error('Error occurred in getStageRating:', error)
    throw error
  }
}

module.exports = {
  getAPIResponse,
  getStageLatitude,
  getStageLongitude,
  getStageRating,
}
