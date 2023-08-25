const DestinationModel = require('../models/DestinationModel')
const FuzzySearch = require('fuzzy-search')

class DestinationController {
  async searchDestination(query) {
    try {
      // TODO: double check with coordinates
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
      const milesToMeters = 1609.34 // Conversion factor
      const maxDistance = 30 * milesToMeters // Limit search to 30 miles

      const closestDestinations = await DestinationModel.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistance,
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

  async cacheStage(stage, name) {
    try {
      // TODO: dont cache dupe alias
      // TODO: cache emoji and descriptions
      // Find existing destination by coordinates
      const existingDestination = await DestinationModel.findOne({
        'location.coordinates': [stage.stageLongitude, stage.stageLatitude],
      }).lean()

      if (existingDestination) {
        // Update existing destination with new alias and tags
        existingDestination.alias = existingDestination.alias || []
        existingDestination.alias.push(stage.stageLocation)

        // TODO: Decipher description into tags
        // existingDestination.tag = decipherTags(stage.description);

        await DestinationModel.findByIdAndUpdate(
          existingDestination._id,
          existingDestination,
        )
      } else {
        // Create new destination with given name and alias
        const newDestination = {
          location: {
            coordinates: [stage.stageLongitude, stage.stageLatitude],
          },
          name: name,
          alias: [stage.stageLocation],
          // TODO: Decipher description into tags
          // tag: decipherTags(stage.description),
        }

        await DestinationModel.create(newDestination)
      }
    } catch (error) {
      error.message = 'Could not cache stage | ' + error.message
      throw error
    }
  }
}

module.exports = DestinationController
