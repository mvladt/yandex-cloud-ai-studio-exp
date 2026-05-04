# CLAUDE.md

## О проекте

Эксперименты с Yandex Cloud AI Studio API (Responses API). Цель — изучить возможности API и в будущем разработать агента на его базе.

## Технологии

- **Runtime**: Node.js v22+ с нативной поддержкой TypeScript (`--experimental-strip-types`)
  - Запуск: `node --experimental-strip-types index.ts`
  - Без сборки, без компиляторов
  - Ограничения: нет `enum`, `namespace`, декораторов
- **SDK**: пакет `openai` с кастомным `baseURL` (API совместим с OpenAI)
- **Тесты**: `node:test` (встроенный, без зависимостей)
- **Секреты**: `.env` файл в корне проекта, читается через `--env-file=.env`

## Структура

Каждый эксперимент — отдельная папка внутри `experiments/`:

```
.env              # API-ключ (в корне, не коммитить)
experiments/
  01-basic-request/
    index.ts           # демо-скрипт
    index.test.ts      # тест (node:test)
  02-context/
    ...
```

## Запуск

```bash
# Один эксперимент
node --experimental-strip-types --env-file=.env experiments/01-basic-request/index.ts

# Все тесты
node --experimental-strip-types --env-file=.env --test experiments/*/index.test.ts
```

## API-конфигурация

| Параметр          | Значение                                       |
|-------------------|------------------------------------------------|
| baseURL           | `https://ai.api.cloud.yandex.net/v1`           |
| Формат модели     | `gpt://<folder_id>/<model>` (напр. `aliceai-llm`) |
| folder_id         | из `.env` (`FOLDER_ID`)                           |
| Авторизация       | API-ключ передаётся как `apiKey` в OpenAI SDK  |
| Сервисный аккаунт | `ai-studio-4aaac8`                             |

### Встроенные инструменты

- **Веб-поиск**: `type: "web_search"` (не `web_search_preview`)
  - `search_context_size`: `low` | `medium` | `high`
  - `filters.allowed_domains`: до 5 доменов
  - Ответ содержит `annotations` с URL-источниками

## Yandex Cloud CLI

`yc` установлен в `~/.local/bin/yc`. Используется для управления сервисными аккаунтами и получения IAM-токенов/API-ключей.

## Документация AI Studio

- [Responses API](https://aistudio.yandex.ru/docs/en/ai-studio/responses/index.html)
- [Operations (практические гайды)](https://aistudio.yandex.ru/docs/en/ai-studio/operations/)
- [Getting started / API key](https://aistudio.yandex.ru/docs/en/ai-studio/quickstart/index.html)
