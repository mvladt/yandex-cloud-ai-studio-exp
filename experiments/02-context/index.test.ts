import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import OpenAI from 'openai'

const FOLDER_ID = '${process.env.FOLDER_ID}'

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://ai.api.cloud.yandex.net/v1',
})

const model = `gpt://${FOLDER_ID}/aliceai-llm`

describe('02-context', () => {
  it('должен помнить имя из предыдущего сообщения', async () => {
    const response1 = await client.responses.create({
      model,
      input: 'Меня зовут Алексей. Запомни это.',
    })

    const response2 = await client.responses.create({
      model,
      input: [
        { role: 'user', content: 'Меня зовут Алексей. Запомни это.' },
        { role: 'assistant', content: response1.output_text },
        { role: 'user', content: 'Как меня зовут?' },
      ],
    })

    assert.ok(
      response2.output_text.toLowerCase().includes('алексей'),
      `Ожидали "Алексей" в ответе, получили: ${response2.output_text}`
    )
  })
})
