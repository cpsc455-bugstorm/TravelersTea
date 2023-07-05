require('dotenv').config()
const { OpenAIApi } = require('openai')
const { openaiConfig } = require('./config')
let openai

openai = new OpenAIApi(openaiConfig)
let model = process.env.GPT_MODEL || 'gpt-3.5-turbo'
// if this says gpt-4 and you have set it in your env that means it has read the env file successfully
console.log(`model: ${model}`)

async function openaiClient(conversation) {
  try {
    const response = await openai.createChatCompletion(
      {
        model: model,
        temperature: 0.888,
        max_tokens: 2048,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1,
        messages: conversation,
      },
      { timeout: 120000 },
    )

    return response.data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error in OpenAI API:', error)
    throw error
  }
}

module.exports = openaiClient
