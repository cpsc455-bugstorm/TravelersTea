const express = require('express');
const services = require('../services/services')

class ExampleController {
    constructor() {
        this.router = express.Router()
        // the this.getAll.bind(this) is basically saying
        // when I hit /api/example in a get request, I am going 
        // to call the getAll function 
        this.router.get("", this.getAll.bind(this))
    }

    initRoutes(apiRouter) {
        apiRouter.use("/example", this.router)
    }

    async getAll(req, res) {
        try {
            const response = await services.exampleService.getAll();
            res.json(response);
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = ExampleController;