const { openaiApiKey } = require('./config')
const axios = require('axios')

const apiUrl =
  'https://api.openai.com/v1/engines/gpt-3.5-turbo-0301/chat/completions'

async function openaiClient(conversation) {
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: conversation,
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
      },
    )

    return response.data
  } catch (error) {
    console.error('Error in OpenAI API:', error)
    throw error
  }
}

module.exports = openaiClient
