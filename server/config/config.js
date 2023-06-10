require('dotenv').config()

const MONGO_USERNAME = process.env.MONGO_USERNAME || ''
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ''
let DB_CHOICE = 'BugStormDB'

// Change the value of the DB_USER_FLAG if you want to use your own DB
let DB_USER_FLAG = ''
switch (DB_USER_FLAG) {
  case 'ANDY':
    DB_CHOICE = 'BugStormDEV_AL'
    break
  case 'NOREEN':
    DB_CHOICE = 'BugStormDEV_NC'
    break
  case 'MENG':
    DB_CHOICE = 'BugStormDEV_Meng'
    break
  case 'RITHIN':
    DB_CHOICE = 'BugStormDEV_Rithin'
    break
  case 'VEE':
    DB_CHOICE = 'BugStormDEV_Vee'
    break
  default:
    DB_CHOICE = 'BugStormDB'
    break
}

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
    JWT_SECRET,
  },
}

module.exports = config
