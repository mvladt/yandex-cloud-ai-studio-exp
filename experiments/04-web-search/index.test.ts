import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import OpenAI from 'openai'

const FOLDER_ID = process.env.FOLDER_ID

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://ai.api.cloud.yandex.net/v1',
})

const model = `gpt://${FOLDER_ID}/aliceai-llm`

describe('04-web-search', () => {
  it('должен вернуть ответ с данными из веб-поиска', async () => {
    const response = await client.responses.create({
      model,
      input: 'Кто президент Франции в 2025 году? Одно предложение.',
      tools: [
        {
          type: 'web_search' as any,
          search_context_size: 'low',
        },
      ],
    })

    assert.ok(response.output_text.length > 0, 'Ответ не должен быть пустым')
    assert.ok(
      response.output_text.toLowerCase().includes('макрон'),
      `Ожидали "Макрон" в ответе, получили: ${response.output_text}`
    )
  })

  it('должен содержать аннотации с источниками', async () => {
    const response = await client.responses.create({
      model,
      input: 'Какая последняя версия TypeScript? Кратко.',
      tools: [
        {
          type: 'web_search' as any,
          search_context_size: 'low',
        },
      ],
    })

    let hasAnnotations = false
    for (const item of response.output) {
      if (item.type === 'message') {
        for (const part of item.content) {
          if (part.type === 'output_text' && 'annotations' in part) {
            const annotations = part.annotations as any[]
            if (annotations?.length > 0) hasAnnotations = true
          }
        }
      }
    }

    assert.ok(hasAnnotations, 'Ответ должен содержать аннотации с источниками')
  })
})
