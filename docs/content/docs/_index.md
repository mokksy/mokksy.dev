---
title: "Mokksy and AI-Mocks"
#weight: 1
summary: |-
  Documentation for Mokksy and AI-Mocks. Start with HTTP integration testing, then add provider-specific AI mocks when your dependency is an LLM API.
---

Mokksy helps Kotlin and Java teams replace external HTTP services in integration tests. Use it for deterministic stubs, real request matching, streaming responses, SSE, and failure simulation.

AI-Mocks is built on Mokksy. Use it when the external dependency is an AI provider and you want OpenAI, Anthropic, Gemini, Ollama, or Agent-to-Agent API behavior without API keys, rate limits, or provider outages.

## Start here

- [Quick Start (5 minutes)](./mokksy/quick-start/)
- [First integration test](./mokksy/first-integration-test/)
- [Streaming test example](./mokksy/streaming-test-example/)
- [Failure simulation recipes](./mokksy/failure-simulation/)

## Mokksy

- [Mokksy overview](./mokksy/)
- [Why Mokksy vs WireMock](./mokksy/wiremock-alternative/)
- [Stubbing responses](./mokksy/stubbing/)
- [Request matching](./mokksy/request-matching/)
- [Streaming and SSE](./mokksy/streaming/)
- [Multipart and file uploads](./mokksy/multipart/)
- [Verification and request journal](./mokksy/verification/)
- [Ecosystem integrations](./mokksy/ecosystem-integrations/)

## AI-Mocks

- [AI-Mocks overview](./ai-mocks/)
  - [OpenAI](./ai-mocks/openai/)
  - [Anthropic](./ai-mocks/anthropic/)
  - [Gemini](./ai-mocks/gemini/)
  - [Ollama](./ai-mocks/ollama/)
  - [Agent-to-Agent Protocol (A2A)](./ai-mocks/a2a/)

## API Reference

- [Mokksy API](https://mokksy.github.io/mokksy/)
- [AI Mocks API](https://mokksy.github.io/ai-mocks/)
