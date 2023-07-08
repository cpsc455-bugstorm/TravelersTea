const UserModel = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const config = require('../config/config')
const jwt = require('jsonwebtoken')

class UserController {
  constructor(tripController) {
    this.tripController = tripController
  }

  async getAll() {
    try {
      const users = await UserModel.find().lean()
      return users
    } catch (error) {
      console.error('Error while retrieving users:', error)
      throw error
    }
  }

  async getByEmail(userEmail) {
    try {
      const user = await UserModel.findOne({ email: userEmail }).lean()
      return user
    } catch (error) {
      console.error('Error while retrieving users:', error)
      throw error
    }
  }

  async create(userData) {
    try {
      const newUser = await UserModel.create(userData)
      return newUser.toObject()
    } catch (error) {
      console.error('Error while creating user:', error)
      throw error
    }
  }

  async update(userId, updateData) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true, // Return the updated user
        },
      )
      return updatedUser.toObject()
    } catch (error) {
      console.error('Error while updating user:', error)
      throw error
    }
  }

  async delete(userId) {
    try {
      await this.tripController.deleteTripsByUserId(userId)

      const deletedUser = await UserModel.findByIdAndRemove(userId)
      return deletedUser.toObject()
    } catch (error) {
      console.error('Error while deleting user:', error)
      throw error
    }
  }

  async register(userData) {
    const userWithEmail = await this.getByEmail(userData.email)
    if (userWithEmail != null) {
      const error = new Error('Email already exists')
      error.statusCode = 400
      throw error
    }
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(userData.password, salt)
    const newlyCreatedUser = await this.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    })

    const accessToken = this.createAccessToken(newlyCreatedUser)
    const userDTO = {
      id: newlyCreatedUser._id,
      username: newlyCreatedUser.username,
      accessToken,
    }
    return userDTO
  }

  createAccessToken(userData) {
    try {
      const accessToken = jwt.sign(
        {
          username: userData.username,
        },
        config.server.jwtSecret,
      )
      return accessToken
    } catch (error) {
      console.error('Error with creating token')
      throw new Error(`Could not create token: ${error}`)
    }
  }

  async login(userData) {
    const userWithEmail = await this.getByEmail(userData.email)
    if (userWithEmail == null) {
      const error = new Error('No user with this email')
      error.statusCode = 404
      throw error
    }

    const passwordMatches = bcrypt.compareSync(
      userData.password,
      userWithEmail.password,
    )

    if (!passwordMatches) {
      const error = new Error('Invalid password')
      error.statusCode = 400
      throw error
    }

    const accessToken = this.createAccessToken(userWithEmail)
    const userDTO = {
      id: userWithEmail._id,
      username: userWithEmail.username,
      accessToken,
    }
    return userDTO
  }
}

module.exports = UserController
