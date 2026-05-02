import OpenAI from 'openai'

const FOLDER_ID = '${process.env.FOLDER_ID}'

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://ai.api.cloud.yandex.net/v1',
})

const model = `gpt://${FOLDER_ID}/aliceai-llm`

// Первый запрос
const response1 = await client.responses.create({
  model,
  input: 'Меня зовут Алексей. Запомни это.',
})
console.log('Ответ 1:', response1.output_text)

// Второй запрос — передаём предыдущий ответ как контекст
const response2 = await client.responses.create({
  model,
  input: [
    { role: 'user', content: 'Меня зовут Алексей. Запомни это.' },
    { role: 'assistant', content: response1.output_text },
    { role: 'user', content: 'Как меня зовут?' },
  ],
})
console.log('Ответ 2:', response2.output_text)
