require('dotenv').config()
const axios = require('axios')

/**
 Retrieves the coordinates of a stage location using Google Places API.
 @see {@link https://developers.google.com/maps/documentation/javascript/places|Google Places API}
 @param {string} destination - The destination.
 @returns {object} { lat: number, lng: number }
 @throws {Error} If there is an error while fetching place details.
 */
async function getLatLon(destination) {
  const query = `${destination}`
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
    if (!response.data.results.length) {
      throw new Error('No coordinates found.')
    }
    const { location } = response.data.results[0].geometry

    return location
  } catch (error) {
    error.message = 'Error while fetching place details | ' + error.message
    throw error
  }
}

module.exports = getLatLon
