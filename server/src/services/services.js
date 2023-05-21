const ExampleRepo = require("../repositories/ExampleRepo")
const ExampleService = require("./ExampleService")


const exampleRepo = new ExampleRepo()
const exampleService = new ExampleService(exampleRepo)


const services = {
    exampleService: exampleService
}

module.exports = services