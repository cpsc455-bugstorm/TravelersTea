require('dotenv').config()

const MONGO_USERNAME = process.env.MONGO_USERNAME || ''
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ''
const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.4bflh41.mongodb.net/BugStormDB?retryWrites=true&w=majority`
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 5001
const ENV = process.env.ENV || ''
const JWT_SECRET = process.env.JWT_SECRET || ''

const config = {
  mongo: {
    uri: MONGO_URI,
  },
  server: {
    port: SERVER_PORT,
    env: ENV,
    JWT_SECRET,
  },
}

module.exports = config
