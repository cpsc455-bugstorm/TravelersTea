const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const UserRoute = require('./routes/UserRoute')
const TripRoute = require('./routes/TripRoute')

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
app.use('/api', apiRouter)

const userRoute = new UserRoute()
userRoute.initRoutes(apiRouter)

const tripRoute = new TripRoute()
tripRoute.initRoutes(apiRouter)

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
