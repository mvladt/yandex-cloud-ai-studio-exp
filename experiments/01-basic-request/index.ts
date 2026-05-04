import OpenAI from 'openai'

const FOLDER_ID = process.env.FOLDER_ID

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://ai.api.cloud.yandex.net/v1',
})

const response = await client.responses.create({
  model: `gpt://${FOLDER_ID}/aliceai-llm`,
  input: 'Привет! Расскажи о себе в двух предложениях.',
})

console.log(response.output_text)
