const TripModel = require('../models/TripModel')
const uuid = require('uuid')
const generateTrip = require('../openai/generateTrip')

class TripController {
  constructor() {}

  async getAll() {
    try {
      const trips = await TripModel.find()
      return trips
    } catch (error) {
      throw new Error('Could not fetch all trips', error)
    }
  }

  parseStagesFromMultipleDays(days, tripId) {
    const _tripId = tripId
    const stagesToAdd = []
    for (let [index, day] of days.entries()) {
      const dayIndex = index
      const tripId = tripId
      const stagesToAddFromDay = this.parseStagesFromDay(day, _tripId, dayIndex)
      for (let stage of stagesToAddFromDay) {
        stagesToAdd.push(stage)
      }
    }
    return stagesToAdd
  }

  parseStagesFromDay(day, tripId, dayIndex) {
    const stagesToAddFromDay = []
    for (let [stage, index] of day.entries()) {
      const stageToAddFromDay = {
        tripId,
        dayIndex,
        stageIndex: index,
        // stageLongitude: googleApiStuff(),
        // stageLatitude: googleApiStuff(),
        description: stage.description,
        colourNumber: stage.colourNumber,
        emoji: stage.emoji,
      }
      stagesToAddFromDay.push(stageToAddFromDay)
    }
    return stagesToAddFromDay
  }

  async createTrip(constraints) {
    try {
      const generatedTripWithStages = generateTrip(constraints)
      const tripToCreate = {
        tripName: generatedTripWithStages.tripName,
        tripLocation: constraints.destination,
        stagesPerDay: constraints.stagesPerDay,
        budget: constraints.budget,
        numberOfDays: constraints.numberOfDays,
        // tripLongitude: googleApiStuff(),
        // tripLatitude: googleApiStuff(),
        preferences: constraints, // ?
      }

      const newTrip = await TripModel.create({
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...tripToCreate,
        _id: uuid.v4(),
      })

      const { days } = generatedTripWithStages
      const stagesToAdd = this.parseStagesFromMultipleDays(days, newTrip.id)
      console.log(stagesToAdd, 'This is to prevent linting errors')
      // await controller.StagesController.addMany(stagesToAdd)
      return newTrip
    } catch (error) {
      throw new Error('Could not create trip', error)
    }
  }

  async updateTrip(id, tripData) {
    try {
      const updatedTrip = await TripModel.findByIdAndUpdate(id, tripData, {
        new: true,
      })
      return updatedTrip
    } catch (error) {
      throw new Error('Could not edit trip', error)
    }
  }

  async deleteTrip(id) {
    try {
      const deletedTrip = await TripModel.findByIdAndDelete(id)
      return deletedTrip
    } catch (error) {
      throw new Error('Could not delete trip', error)
    }
  }
}

module.exports = TripController
