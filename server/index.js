const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const UserRoute = require('./routes/UserRoute')
const TripRoute = require('./routes/TripRoute')
const loggingMiddleware = require('./middlewares/Logging')
const errorHandleMiddleware = require('./middlewares/ErrorHandling')
const config = require('./config/config')

const app = express()
app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  }),
)

const apiRouter = express.Router()

if (config.server.env === 'DEV') {
  app.use(morgan(loggingMiddleware.generalLoggingMiddleware))
}

app.use('/api', apiRouter)

const userRoute = new UserRoute()
userRoute.initRoutes(apiRouter)

const tripRoute = new TripRoute()
tripRoute.initRoutes(apiRouter)

if (config.server.env === 'DEV') {
  app.use(loggingMiddleware.errorLoggingMiddleware)
}

app.use(errorHandleMiddleware)

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