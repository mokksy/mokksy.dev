---
title: "Mokksy and AI-Mocks"
weight: 1
summary: |-
  Documentation for Mokksy and AI-Mocks. Start with HTTP integration testing, then add provider-specific AI mocks when your dependency is an LLM API.
---

Mokksy helps Kotlin and Java teams replace external HTTP services in integration tests. Use it for deterministic stubs, real request matching, streaming responses, SSE, and failure simulation.

AI-Mocks is built on Mokksy. Use it when the external dependency is an AI provider and you want OpenAI, Anthropic, Gemini, Ollama, or Agent-to-Agent API behavior without live provider credentials, rate limits, or provider outages.

## Start here

- [Quick Start (5 minutes)](./mokksy/quick-start/)
- [First integration test](./mokksy/first-integration-test/)
- [Streaming and SSE](./mokksy/streaming/)
- [Failure simulation](./mokksy/failure-simulation/)

## Products

- [Mokksy overview](./mokksy/)
- [AI-Mocks overview](./ai-mocks/)

## Mokksy guides, reference, and operations

- [Stubbing responses](./mokksy/stubbing/)
- [Request matching](./mokksy/request-matching/)
- [Verification and request journal](./mokksy/verification/)
- [Multipart and file uploads](./mokksy/multipart/)
- [Streaming and SSE](./mokksy/streaming/)
- [File-based configuration](./mokksy/file-config/)
- [Docker](./mokksy/docker/)

## Shared integrations

- [Integrations overview](./integrations/)
- [Spring Boot](./integrations/spring-boot/)
- [Ktor](./mokksy/ktor/)
- [Quarkus](./integrations/quarkus/)
- [LangChain4j](./integrations/langchain4j/)
- [Koog](./integrations/koog/)
- [Spring AI](./integrations/spring-ai/)
- [OpenAI SDK](./integrations/openai-sdk/)
- [Anthropic SDK](./integrations/anthropic-sdk/)

## Compare and migrate

- [Mokksy vs WireMock](./compare/wiremock/)

## AI-Mocks providers

- [OpenAI](./ai-mocks/openai/)
- [Anthropic](./ai-mocks/anthropic/)
- [Gemini](./ai-mocks/gemini/)
- [Ollama](./ai-mocks/ollama/)
- [Agent-to-Agent Protocol (A2A)](./ai-mocks/a2a/)

## API Reference

- [Mokksy API](https://mokksy.github.io/mokksy/)
- [AI Mocks API](https://mokksy.github.io/ai-mocks/)
