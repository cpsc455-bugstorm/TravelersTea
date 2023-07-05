const { Configuration } = require('openai')

module.exports = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiConfig: new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY || 'add-alt-key-here',
  }),
}
