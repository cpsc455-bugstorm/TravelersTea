const { Configuration } = require('openai')
require('dotenv').config()

const MONGO_USERNAME = process.env.MONGO_USERNAME || ''
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ''
const DB_CHOICE = process.env.DB_USER_FLAG || 'BugStormDB'
const BACKUP_DB_CHOICE = process.env.BACKUP_DB_USER_FLAG || 'BugStormDB'

const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 5001
const ENV = process.env.ENV || ''
const JWT_SECRET = process.env.JWT_SECRET || ''
const CLIENT_URL = process.env.CLIENT_URL

const RATE_LIMIT = process.env.RATE_LIMIT || 10
const PROXY = process.env.PROXY || 1
const TIME_LIMT = process.env.TIME_LIMT || 24 * 60 * 60 * 1000 // 1 day

const config = {
  mongo: {
    uri: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.4bflh41.mongodb.net/${DB_CHOICE}?retryWrites=true&w=majority`,
    backupuri: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.4bflh41.mongodb.net/${BACKUP_DB_CHOICE}?retryWrites=true&w=majority`,
    flag: DB_CHOICE,
  },
  server: {
    port: SERVER_PORT,
    env: ENV,
    jwtSecret: JWT_SECRET,
    clientURL: CLIENT_URL,
    rateLimit: RATE_LIMIT,
    proxy: PROXY,
    timeLimit: TIME_LIMT,
  },
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiConfig: new Configuration({
    organization: process.env.OPEN_AI_ORG_ID,
    apiKey: process.env.OPEN_AI_API_KEY || 'add-alt-key-here',
  }),
  googleApiKey: process.env.GOOGLE_PLACES_API_KEY,
}

module.exports = config
