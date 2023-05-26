const { openaiApiKey } = require('./config')
const axios = require('axios')

const OpenAIApiUrl =
  'https://api.openai.com/v1/engines/davinci-codex/completions'

const openaiClient = axios.create({
  baseURL: OpenAIApiUrl,
  timeout: 30000,
  headers: {
    Authorization: `Bearer ${openaiApiKey}`,
    'Content-Type': 'application/json',
  },
})

module.exports = openaiClient
