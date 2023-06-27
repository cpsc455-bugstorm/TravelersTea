const UserModel = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const config = require('../config/config')
const jwt = require('jsonwebtoken')

class UserController {
  constructor() {}

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
      const users = await UserModel.findOne({ email: userEmail }).lean()
      return users
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
      id: userData._id,
      username: userData.username,
      email: userData.email,
      accessToken,
    }
    return userDTO
  }

  createAccessToken(userData) {
    console.log(userData)

    console.log('secret: ', config.server.jwtSecret)
    try {
      const accessToken = jwt.sign(
        {
          // id: userData._id,
          username: userData.username,
          email: userData.email,
        },
        config.server.jwtSecret,
      )
      return accessToken
    } catch (error) {
      console.log('Error with creating token')
      throw new Error('Could not create token: ', error)
    }
  }
}

module.exports = UserController
