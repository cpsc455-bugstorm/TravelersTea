const UserModel = require('../models/UserModel')

class UserController {
    constructor() {
      
    }
  
    async getAll() {
      try {
        const users = await UserModel.find();
        return users;
      } catch (error) {
        console.error('Error while retrieving users:', error);
        throw error;
      }
    }

    async createUser(userData) {
      try {
        const newUser = await UserModel.create(userData);
        return newUser;
      } catch (error) {
        console.error('Error while creating user:', error);
        throw error;
      }
    }
  
    async updateUser(userId, updateData) {
      try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
          new: true, // Return the updated user
        });
        return updatedUser;
      } catch (error) {
        console.error('Error while updating user:', error);
        throw error;
      }
    }
  
    async deleteUser(userId) {
      try {
        const deletedUser = await UserModel.findByIdAndRemove(userId);
        return deletedUser;
      } catch (error) {
        console.error('Error while deleting user:', error);
        throw error;
      }
    } 

  }
  
module.exports =  UserController