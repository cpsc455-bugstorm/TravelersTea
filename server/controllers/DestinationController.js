const DestinationModel = require('../models/DestinationModel')
const getLatLon = require('../googleapi/getLatLon')
const generateTrip = require('../openai/generateTrip')
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

  /**
   * Caches a stage's information into the database.
   * If the stage already exists, it updates the existing record.
   * Otherwise, it creates a new record.
   *
   * @param {Object} stage - The stage object containing stage datas.
   * @param {String} name - Whatever the user queried as 'destination'.
   * @param {String} notes - Extra notes.
   */
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
          rating: stage.stageRating,
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

  /**
   * Generates a trip itinerary by combining cached and newly generated stages.
   * It first tries to fetch up to 80% of the whole trip as cached stages based on the trip data.
   * Then, it generates the remaining stages while avoiding the cached locations.
   * Finally, it combines both sets of stages into a single itinerary.
   *
   * @param {Object} tripData - The trip constraints and details.
   * @returns {Object} - The combined itinerary with days and stages.
   */
  async generateTripWithCache(tripData) {
    const cacheDestination = await this.tryCache(tripData)
    const avoidLocations = []
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const destinationLeftToFetch = { ...tripData }

    if (cacheDestination) {
      cacheDestination.days.forEach((day) => {
        day.stages.forEach((stage) => {
          avoidLocations.push(stage.stageLocationName)
        })
      })
      const cachedStagesPerDay = cacheDestination.days[0].stages.length
      destinationLeftToFetch.stagesPerDay =
        tripData.stagesPerDay - cachedStagesPerDay
    }

    let generatedDestination
    try {
      generatedDestination = await generateTrip(
        destinationLeftToFetch,
        avoidLocations,
      )
    } catch (error) {
      error.message = 'Error while generating trip | ' + error.message
      throw error
    }

    return this.combineDestinations(
      cacheDestination,
      generatedDestination,
      tripData.numberOfDays,
    )
  }

  // use user's destination's coordinates to find cacheable destinations to use
  async tryCache(tripData) {
    const tripLatLon = await getLatLon(tripData.tripLocation)

    const numberToFetch = Math.floor(
      tripData.numberOfDays * tripData.stagesPerDay * 0.8,
    )

    const cachedDestinations = await this.findClosestDestinations(
      tripLatLon.lat,
      tripLatLon.lng,
      numberToFetch,
    )

    const minStagesPerDay = Math.floor(
      cachedDestinations.length / tripData.numberOfDays,
    )

    if (minStagesPerDay < 1) {
      return null
    }

    let index = 0
    return {
      days: Array.from({ length: tripData.numberOfDays }, (_, dayIndex) => {
        let stageIndex = 0
        const stages = Array.from({ length: minStagesPerDay }, () => {
          const destination = cachedDestinations[index++]
          stageIndex++
          return {
            stageIndex: stageIndex,
            stageLocationName: destination.alias
              ? destination.alias[0]
              : destination.name,
            stageDescription: destination.description,
            stageEmoji: destination.emoji,
          }
        })

        return {
          day: dayIndex + 1,
          stages,
        }
      }),
    }
  }

  combineDestinations(cachedData, generatedData, numberOfDays) {
    const combinedDestinations = []

    for (let i = 0; i < numberOfDays; i++) {
      const cachedStages = cachedData
        ? cachedData.days[i]
          ? cachedData.days[i].stages
          : []
        : []
      const generatedStages = generatedData.days[i]
        ? generatedData.days[i].stages
        : []

      const combinedStages = []

      const allStages = [...cachedStages, ...generatedStages]

      allStages.forEach((stage, index) => {
        combinedStages.push({
          // eslint-disable-next-line node/no-unsupported-features/es-syntax
          ...stage,
          stageIndex: index + 1,
        })
      })

      combinedDestinations.push({
        day: i + 1,
        stages: combinedStages,
      })
    }

    return {
      days: combinedDestinations,
    }
  }
}

module.exports = DestinationController
