import OpenAI from 'openai'

const FOLDER_ID = '${process.env.FOLDER_ID}'

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://ai.api.cloud.yandex.net/v1',
})

const model = `gpt://${FOLDER_ID}/aliceai-llm`

const response = await client.responses.create({
  model,
  input: 'Какая последняя версия Node.js вышла в 2025 году? Кратко.',
  tools: [
    {
      type: 'web_search' as any,
      search_context_size: 'medium',
    },
  ],
})

console.log('Ответ:', response.output_text)

// Проверяем аннотации с источниками
for (const item of response.output) {
  if (item.type === 'message') {
    for (const part of item.content) {
      if (part.type === 'output_text' && 'annotations' in part) {
        const annotations = part.annotations as any[]
        if (annotations?.length) {
          console.log('\nИсточники:')
          for (const ann of annotations) {
            console.log(`  - ${ann.title ?? ann.url}`)
          }
        }
      }
    }
  }
}
