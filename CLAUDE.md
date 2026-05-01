# CLAUDE.md

## О проекте

Эксперименты с Yandex Cloud AI Studio API (Responses API). Цель — изучить возможности API и в будущем разработать агента на его базе.

## Технологии

- **Runtime**: Node.js v22+ с нативной поддержкой TypeScript (`--experimental-strip-types`)
  - Запуск: `node --experimental-strip-types index.ts`
  - Без сборки, без компиляторов
  - Ограничения: нет `enum`, `namespace`, декораторов
- **SDK**: пакет `openai` с кастомным `baseURL` (API совместим с OpenAI)
- **Секреты**: `.env` файл, читается через `process.env` (Node 20.6+ поддерживает `--env-file`)

## Структура

Каждый эксперимент — отдельная папка внутри `experiments/`:

```
experiments/
  01-basic-request/
    index.ts
    .env          # не коммитить
    README.md     # описание эксперимента
  02-function-calling/
    ...
```

## Запуск эксперимента

```bash
node --experimental-strip-types --env-file=.env index.ts
```

## Yandex Cloud CLI

`yc` установлен в `~/.local/bin/yc`. Используется для управления сервисными аккаунтами и получения IAM-токенов/API-ключей.

## Документация AI Studio

- [Responses API](https://aistudio.yandex.ru/docs/en/ai-studio/responses/index.html)
- [Operations (практические гайды)](https://aistudio.yandex.ru/docs/en/ai-studio/operations/)
- [Getting started / API key](https://aistudio.yandex.ru/docs/en/ai-studio/quickstart/index.html)
