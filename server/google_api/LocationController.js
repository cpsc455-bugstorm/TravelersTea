const Location = require('./Location')
const placesAPI = require('./PlacesAPIClient')

const locationController = {
  async fetchCoordinates(req, res) {
    try {
      const { address } = req.query

      const coordinates = await placesAPI.fetchCoordinates(address)
      const place = new Location({
        address,
        coordinates,
      })

      await place.save()
      res.json({
        success: true,
        place,
      })
    } catch (error) {
      console.error('Error fetching coordinates:', error)
      res.status(500).json({
        success: false,
        message: 'Error fetching coordinates.',
      })
    }
  },
}

module.exports = locationController
