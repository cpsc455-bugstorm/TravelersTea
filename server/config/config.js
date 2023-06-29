require('dotenv').config()

const MONGO_USERNAME = process.env.MONGO_USERNAME || ''
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ''
const DB_CHOICE = process.env.DB_USER_FLAG || 'BugStormDB'

// let DB_CHOICE = 'BugStormDB'
//
// // Change the value of the DB_USER_FLAG if you want to use your own DB
// let DB_USER_FLAG = ''
// const DB_MAP = {
//   ANDY: 'BugStormDEV_AL',
//   NOREEN: 'BugStormDEV_NC',
//   MENG: 'BugStormDEV_Meng',
//   RITHIN: 'BugStormDEV_Rithin',
//   VEE: 'BugStormDEV_Vee',
// }
// DB_CHOICE = DB_MAP[DB_USER_FLAG] || 'BugStormDB'

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
console.log('DB_CHOICE:', DB_CHOICE)

module.exports = config
