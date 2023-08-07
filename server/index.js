const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const cron = require('node-cron')
const axios = require('axios')

const UserRoute = require('./routes/UserRoute')
const TripRoute = require('./routes/TripRoute')
const StageRoute = require('./routes/StageRoute')
const loggingMiddleware = require('./middlewares/Logging')
const errorHandleMiddleware = require('./middlewares/ErrorHandling')
const config = require('./config/config')

const app = express()
app.set('trust proxy', config.server.proxy)
app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: config.server.clientURL,
  }),
)

app.use(express.static(path.join(__dirname, '../client/build')))
app.get('/ping', (req, res) => {
  res.status(200).send('Server is running')
})

const apiRouter = express.Router()

if (config.server.env === 'DEV') {
  app.use(morgan(loggingMiddleware.generalLoggingMiddleware))
}

app.use('/api', apiRouter)

const userRoute = new UserRoute()
userRoute.initRoutes(apiRouter)

const tripRoute = new TripRoute()
tripRoute.initRoutes(apiRouter)

const stageRoute = new StageRoute()
stageRoute.initRoutes(apiRouter)

if (config.server.env === 'DEV') {
  app.use(loggingMiddleware.errorLoggingMiddleware)
}

app.use(errorHandleMiddleware)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
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

    if (config.server.env === 'PROD') {
      cron.schedule('*/13 * * * *', () => {
        console.log('Pinging self...')
        axios
          .get(`${config.server.clientURL}/ping`)
          .then(() => console.log('Self-ping successful'))
          .catch((error) => console.error('Self-ping failed:', error))
      })
    }
  })
}

connectDB()
