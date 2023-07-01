require('dotenv').config()
const { Configuration, OpenAIApi } = require('openai')
let openai

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY || 'add-alt-key-here',
})
// console.log('key: ', process.env.OPEN_AI_API_KEY)
openai = new OpenAIApi(configuration)
let model = process.env.GPT_MODEL || 'gpt-3.5-turbo'
console.log('model: ' + model)

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
