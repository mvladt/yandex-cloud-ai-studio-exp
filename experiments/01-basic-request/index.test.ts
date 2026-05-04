import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import OpenAI from 'openai'

const FOLDER_ID = process.env.FOLDER_ID

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://ai.api.cloud.yandex.net/v1',
})

describe('01-basic-request', () => {
  it('должен вернуть непустой текстовый ответ', async () => {
    const response = await client.responses.create({
      model: `gpt://${FOLDER_ID}/aliceai-llm`,
      input: 'Скажи "привет" одним словом.',
    })

    assert.ok(response.output_text.length > 0, 'Ответ не должен быть пустым')
  })
})
