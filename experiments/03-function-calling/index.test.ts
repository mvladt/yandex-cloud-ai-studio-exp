import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import OpenAI from 'openai'

const FOLDER_ID = process.env.FOLDER_ID

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://ai.api.cloud.yandex.net/v1',
})

const model = `gpt://${FOLDER_ID}/aliceai-llm`

const tools: OpenAI.Responses.Tool[] = [
  {
    type: 'function',
    name: 'get_weather',
    description: 'Получить текущую погоду в городе',
    parameters: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'Название города' },
      },
      required: ['city'],
    },
  },
]

describe('03-function-calling', () => {
  it('должен вызвать функцию get_weather с правильным городом', async () => {
    const response = await client.responses.create({
      model,
      tools,
      input: 'Какая погода в Москве?',
    })

    const functionCall = response.output.find(
      (item): item is OpenAI.Responses.ResponseFunctionToolCall =>
        item.type === 'function_call'
    )

    assert.ok(functionCall, 'Модель должна вызвать функцию')
    assert.equal(functionCall.name, 'get_weather')

    const args = JSON.parse(functionCall.arguments)
    assert.ok(
      args.city.toLowerCase().includes('москв'),
      `Ожидали город "Москва", получили: ${args.city}`
    )
  })

  it('должен сформировать ответ на основе результата функции', async () => {
    const response1 = await client.responses.create({
      model,
      tools,
      input: 'Какая погода в Москве?',
    })

    const functionCall = response1.output.find(
      (item): item is OpenAI.Responses.ResponseFunctionToolCall =>
        item.type === 'function_call'
    )
    assert.ok(functionCall)

    const response2 = await client.responses.create({
      model,
      tools,
      input: [
        { role: 'user', content: 'Какая погода в Москве?' },
        functionCall,
        {
          type: 'function_call_output',
          call_id: functionCall.call_id,
          output: 'Солнечно, +22°C',
        },
      ],
    })

    assert.ok(
      response2.output_text.includes('22'),
      `Ответ должен содержать температуру, получили: ${response2.output_text}`
    )
  })
})
