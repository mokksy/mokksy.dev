---
title: "Quarkus"
weight: 20
toc: true
description: Test Quarkus applications against Mokksy or AI-Mocks by replacing outbound HTTP and AI provider dependencies with deterministic local endpoints.
summary: |-
  Use Mokksy with Quarkus to replace outbound HTTP services and provider APIs in JVM integration tests.
---

Quarkus follows the same base-URL replacement pattern as Spring Boot: start Mokksy before the
test, configure the application to call `mokksy.baseUrl()`, then exercise the real Quarkus HTTP
client code.

In practice, that usually means overriding the Quarkus config value that normally holds the
external service base URL during test startup, rather than swapping clients manually inside the
application.

```text
Quarkus test -> application HTTP client -> Mokksy -> stubbed external API
```

Use this for standard HTTP integrations as well as AI provider clients that sit behind Quarkus
services.

## Demos

- ["LangChain4j with Quarkus (KotlinConf`25)"](https://2025.kotlinconf.com/talks/795976/)
- ["Financial Assistant Chatbot with Easy RAG"](https://github.com/kpavlov/quarkus-assistant-demo)
- ["Quarkus LC4J Demo"](https://github.com/kpavlov/quarkus-ai-demo/tree/main#demo-2---service-with-mock-openai)

## Where to go next

- [Mokksy overview](../mokksy/) for core HTTP and SSE mocks
- [LangChain4j](./langchain4j/) if the Quarkus service uses LangChain4j
- [OpenAI SDK](./openai-sdk/) or [Anthropic SDK](./anthropic-sdk/) for provider SDK clients
