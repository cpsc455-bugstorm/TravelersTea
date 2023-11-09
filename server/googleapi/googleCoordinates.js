require('dotenv').config()
const axios = require('axios')

/**
 Retrieves the coordinates of a stage location using Google Places API.
 @see {@link https://developers.google.com/maps/documentation/javascript/places|Google Places API}
 @param {string} destinationCity - The destinationCity of the stage.
 @param {string} stageLocationName - The name of the stage location.
 @param {Boolean} rating - Boolean indicating whether to return rating in response location. True if stages provided.
 @returns {object} The coordinates of the stage location as an object { lat: number, lng: number } or { lat: number, lng: number, rating: number } if rating is true.
 @throws {Error} If there is an error while fetching place details.
 */
async function getCoordinatesFromLocation(
  destinationCity,
  stageLocationName,
  includeRating,
) {
  const query = `${stageLocationName} ${destinationCity}`
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json'

  try {
    let response
    response = await axios.get(url, {
      params: {
        query: query,
        inputtype: 'textquery',
        fields: 'geometry',
        key: apiKey,
      },
    })
    if (!response.data.results.length) {
      console.log(destinationCity, stageLocationName)
      // retry with just stageLocationName, sometimes it has city in it
      response = await axios.get(url, {
        params: {
          query: `${stageLocationName}`,
          inputtype: 'textquery',
          fields: 'geometry',
          key: apiKey,
        },
      })
      if (!response.data.results.length)
        throw new Error('No coordinates found.')
    }
    const { location } = response.data.results[0].geometry
    if (includeRating) {
      let { rating } = response.data.results[0]

      if (rating === undefined) {
        rating = 0
      }
      return { location, rating }
    }
    return location
  } catch (error) {
    error.message = 'Error while fetching place details | ' + error.message
    throw error
  }
}

module.exports = getCoordinatesFromLocation
