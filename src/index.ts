import express from 'express'
import mongoose from 'mongoose'

const app = express()
const port = process.env.PORT || 5000

// Replace the following URL with your MongoDB connection string
const mongoUrl = 'mongodb://localhost:27017/mern-typescript-db'

mongoose
  .connect(mongoUrl, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

app.get('/', (req, res) => {
  res.send('Hello, MERN TypeScript!')
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
