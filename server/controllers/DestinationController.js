const DestinationModel = require('../models/DestinationModel')
const FuzzySearch = require('fuzzy-search')

class DestinationController {
  async searchDestination(query) {
    try {
      // Fetch all destinations
      const destinations = await DestinationModel.find().lean()

      // Extract names and aliases
      const namesAndAliases = destinations.flatMap((destination) => [
        destination.name,
        ...(destination.alias || []),
      ])

      // Perform a fuzzy search on the names and aliases
      const searcher = new FuzzySearch(namesAndAliases)
      const results = searcher.search(query)

      // Return the destinations that match the search results
      const matchingDestinations = destinations.filter(
        (destination) =>
          results.includes(destination.name) ||
          (destination.alias || []).some((alias) => results.includes(alias)),
      )

      return matchingDestinations
    } catch (error) {
      error.message = 'Could not search destination | ' + error.message
      throw error
    }
  }

  async findClosestDestinations(latitude, longitude, n) {
    try {
      const closestDestinations = await DestinationModel.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
          },
        },
      })
        .limit(n)
        .lean()

      return closestDestinations
    } catch (error) {
      error.message = 'Could not find closest destinations | ' + error.message
      throw error
    }
  }
}

module.exports = DestinationController
