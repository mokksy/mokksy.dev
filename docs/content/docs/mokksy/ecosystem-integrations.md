---
title: "Ecosystem integrations"
slug: integrations
weight: 75
toc: true
summary: |-
  Use Mokksy with Spring Boot, Ktor, Quarkus, JVM SDK clients, LangChain4j, Spring AI, OpenAI SDK, and Anthropic SDK.
---

Mokksy works with any framework or SDK that can be pointed at a configurable base URL.

## Spring Boot

Start Mokksy in your test fixture, then inject `mokksy.baseUrl()` into the HTTP client or application property that normally points at the external service.

```text
Spring Boot test -> application HTTP client -> Mokksy -> stubbed external API
```

Use this for payment gateways, fraud/risk APIs, document services, or internal platform dependencies.

## Ktor

Use [Ktor integration](../ktor/) when you want Mokksy to live inside an existing Ktor application. Use the standalone server when your application only needs a replacement base URL.

## Quarkus

Use the same pattern as Spring Boot: start Mokksy before the test, set the dependency base URL to `mokksy.baseUrl()`, and run the application through its real HTTP client.

Demos:
- ["LangChain4j with Quarkus (KotlinConf`25)"](https://2025.kotlinconf.com/talks/795976/)
    - ["Financial Assistant Chatbot with Easy RAG"](https://github.com/kpavlov/quarkus-assistant-demo) ([SentimentAnalyzerTest](https://github.com/kpavlov/quarkus-assistant-demo/blob/main/src/test/kotlin/com/example/chatbot/SentimentAnalyzerTest.kt))
- ["Quarkus LC4J Demo"](https://github.com/kpavlov/quarkus-ai-demo/tree/main#demo-2---service-with-mock-openai) (archive)

## LangChain4j

Use AI-Mocks when the dependency is an AI provider. Start with:

- [OpenAI with LangChain4j](../../ai-mocks/openai/#integration-with-langchain4j)
- [Anthropic with LangChain4j](../../ai-mocks/anthropic/#integration-with-langchain4j)
- [Ollama with LangChain4j](../../ai-mocks/ollama/#integration-with-langchain4j)

Demos:

- ["LangChain4j with Quarkus (KotlinConf`25)"](https://2025.kotlinconf.com/talks/795976/)
  - ["Financial Assistant Chatbot with Easy RAG"](https://github.com/kpavlov/quarkus-assistant-demo) ([SentimentAnalyzerTest](https://github.com/kpavlov/quarkus-assistant-demo/blob/main/src/test/kotlin/com/example/chatbot/SentimentAnalyzerTest.kt))

## Spring AI

Use AI-Mocks for provider-compatible responses:

- [OpenAI with Spring AI](../../ai-mocks/openai/#integration-with-spring-ai)
- [Gemini with Spring AI](../../ai-mocks/gemini/#integration-with-spring-ai)

## OpenAI SDK

Use [AI-Mocks OpenAI](../../ai-mocks/openai/) when your application uses the official OpenAI SDK. Configure the SDK with the mock server base URL and a dummy API key.

## Anthropic SDK

Use [AI-Mocks Anthropic](../../ai-mocks/anthropic/) when your application uses the official Anthropic SDK. Configure the SDK with the mock server base URL and a dummy API key.

## Koog

[Koog](https://koog.ai) is an AI framework from JetBrains. You can absolutely test Koog applications with Mokksy/AI Mocks.

Demos:
- ["Koog Spring-Boot Elven Assistant" (Devoxx Belgium 2025)](https://github.com/kpavlov/koog-spring-boot-assistant)
   - Video: ["Testing Challenges in the Age of AI"](https://www.youtube.com/watch?v=IwAsq3EfaC0)
   - [Slides](https://speakerdeck.com/kpavlov/testing-challenges-in-the-age-of-ai-devoxx-dot-be-2025)

