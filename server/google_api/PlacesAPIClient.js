const axios = require('axios')
const { API_KEY } = require('./config')

const placesAPI = {
  async fetchCoordinates(address) {
    try {
      // TODO: fetch coordinates from Google Places API
      const response = await axios.get('', {
        params: {
          address,
          key: API_KEY,
        },
      })

      const { lat, lng } = response.data.results[0].geometry.location
      return {
        latitude: lat,
        longitude: lng,
      }
    } catch (error) {
      console.error('Error fetching coordinates from Google API:', error)
      throw new Error('Error fetching coordinates.')
    }
  },
}

module.exports = placesAPI
