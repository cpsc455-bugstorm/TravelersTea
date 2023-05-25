const express = require("express");
const controllers = require("../controllers/Controllers");
const UserModel = require('../models/UserModel')


class UserRoute {
  constructor() {
    this.router = express.Router();
    // the this.getAll.bind(this) is basically saying
    // when I hit /api/example in a get request, I am going
    // to call the getAll function
    this.router.get("", this.getAll.bind(this));
  }

  initRoutes(apiRouter) {
    apiRouter.use("/user", this.router);
  }

  async getAll(req, res) {
    try {
      const response = await controllers.userController.getAll();
      res.json(response);
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = UserRoute;
