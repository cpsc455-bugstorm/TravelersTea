const { Configuration } = require('openai')
require('dotenv').config()

const MONGO_USERNAME = process.env.MONGO_USERNAME || ''
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ''
const DB_CHOICE = process.env.DB_USER_FLAG || 'BugStormDB'

const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.4bflh41.mongodb.net/${DB_CHOICE}?retryWrites=true&w=majority`
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
    jwtSecret: JWT_SECRET,
  },
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiConfig: new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY || 'add-alt-key-here',
  }),
  googleApiKey: process.env.GOOGLE_PLACES_API_KEY,
}

module.exports = config
