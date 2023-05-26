const express = require('express')
const mongoose = require('mongoose')

const UserRoute = require('./routes/UserRoute')
const config = require('./config/config')
const app = express()
app.use(express.json())

const apiRouter = express.Router()
app.use('/api', apiRouter)

const userRoute = new UserRoute()
userRoute.initRoutes(apiRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo.uri)
    startServer()
  } catch (err) {
    console.error(err)
  }
}

const startServer = () => {
  app.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`)
  })
}

connectDB()
