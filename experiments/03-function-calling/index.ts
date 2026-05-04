import OpenAI from 'openai'

const FOLDER_ID = process.env.FOLDER_ID

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://ai.api.cloud.yandex.net/v1',
})

const model = `gpt://${FOLDER_ID}/aliceai-llm`

// Локальная функция, которую модель может вызвать
function getWeather(city: string): string {
  const data: Record<string, string> = {
    'москва': 'Солнечно, +22°C',
    'санкт-петербург': 'Облачно, +17°C',
    'новосибирск': 'Дождь, +14°C',
  }
  return data[city.toLowerCase()] ?? `Нет данных о погоде для города ${city}`
}

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

// Первый запрос — модель решает вызвать функцию
const response = await client.responses.create({
  model,
  tools,
  input: 'Какая погода в Москве?',
})

console.log('Ответ модели:', JSON.stringify(response.output, null, 2))

// Находим вызов функции
const functionCall = response.output.find(
  (item): item is OpenAI.Responses.ResponseFunctionToolCall =>
    item.type === 'function_call'
)

if (functionCall) {
  const args = JSON.parse(functionCall.arguments)
  console.log(`\nМодель вызвала: ${functionCall.name}(${JSON.stringify(args)})`)

  const result = getWeather(args.city)
  console.log(`Результат функции: ${result}`)

  // Второй запрос — передаём результат функции обратно
  const finalResponse = await client.responses.create({
    model,
    tools,
    input: [
      { role: 'user', content: 'Какая погода в Москве?' },
      functionCall,
      {
        type: 'function_call_output',
        call_id: functionCall.call_id,
        output: result,
      },
    ],
  })

  console.log(`\nФинальный ответ: ${finalResponse.output_text}`)
} else {
  console.log('Модель не вызвала функцию')
}
