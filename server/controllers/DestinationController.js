const DestinationModel = require('../models/DestinationModel')
const getLatLon = require('../googleapi/getLatLon')
const nlp = require('compromise')
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

  async tryCache(tripData) {
    const tripLatLon = await getLatLon(tripData.tripLocation)
    const cachedDestinations = await this.findClosestDestinations(
      tripLatLon.lat,
      tripLatLon.lng,
      tripData.numberOfDays * tripData.stagesPerDay,
    )
    if (
      cachedDestinations.length >=
      tripData.numberOfDays * tripData.stagesPerDay
    ) {
      return {
        days: Array.from({ length: tripData.numberOfDays }, (_, dayIndex) => ({
          day: dayIndex + 1,
          stages: Array.from(
            { length: tripData.stagesPerDay },
            (_, stageIndex) => {
              const destination =
                cachedDestinations[
                  dayIndex * tripData.stagesPerDay + stageIndex
                ]
              return {
                stageIndex: stageIndex + 1,
                stageLocationName: destination.alias
                  ? destination.alias[0]
                  : destination.name,
                stageDescription: destination.description,
                stageEmoji: destination.emoji,
              }
            },
          ),
        })),
      }
    } else {
      return null
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

  async cacheStage(stage, name, notes) {
    try {
      const existingDestination = await DestinationModel.findOne({
        'location.coordinates': [stage.stageLongitude, stage.stageLatitude],
      }).lean()

      const tags = this.extractTags(notes)

      if (existingDestination) {
        await DestinationModel.findByIdAndUpdate(existingDestination._id, {
          $addToSet: {
            alias: stage.stageLocation,
            tag: { $each: tags },
          },
        })
      } else {
        const newDestination = {
          location: {
            coordinates: [stage.stageLongitude, stage.stageLatitude],
          },
          name: name,
          alias: [stage.stageLocation],
          description: stage.description,
          emoji: stage.emoji,
          tag: tags,
        }

        await DestinationModel.create(newDestination)
      }
    } catch (error) {
      error.message = 'Could not cache stage | ' + error.message
      throw error
    }
  }

  extractTags(notes) {
    const doc = nlp(notes)
    let nouns = doc.nouns().out('array')

    const stopWords = [
      'the',
      'and',
      'its',
      'its',
      'a',
      'an',
      'of',
      'to',
      'in',
      'for',
      'with',
      'on',
      'at',
      'by',
      'from',
    ]
    nouns = nouns.filter((word) => !stopWords.includes(word.toLowerCase()))

    return nouns
  }
}

module.exports = DestinationController
