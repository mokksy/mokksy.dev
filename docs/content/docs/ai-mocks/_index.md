---
title: "AI-Mocks"
weight: 20
summary: |-
  Provider-specific AI mocking toolkit built on Mokksy. Test OpenAI, Anthropic, Gemini, Ollama, and Agent-to-Agent clients without real provider calls.
---
[![Maven Central](https://img.shields.io/maven-central/v/dev.mokksy.aimocks/ai-mocks-core.svg?label=Maven%20Central)](https://central.sonatype.com/artifact/dev.mokksy.aimocks/ai-mocks-core)

AI-Mocks provides specialized mock server implementations built on top of Mokksy for testing and development with AI provider APIs.

Use Mokksy directly when you need a general HTTP/SSE mock server. Use AI-Mocks when your dependency is an AI provider SDK and you want provider-specific request builders, response formats, streaming behavior, and error payloads.

## Supported Providers

- [OpenAI API (`ai-mocks-openai`)](./openai/)
- [Anthropic API (`ai-mocks-anthropic`)](./anthropic/)
- [Google VertexAI Gemini (`ai-mocks-gemini`)](./gemini/)
- [Ollama (`ai-mocks-ollama`)](./ollama/)
- [Agent-to-Agent Protocol (A2A) (`ai-mocks-a2a`)](./a2a/)

## Feature Support Matrix

| Feature              | OpenAI    | Anthropic | Gemini | Ollama   | A2A                                  |
|----------------------|-----------|-----------|--------|----------|--------------------------------------|
| **Chat Completions** | ✅         | ✅         | ✅      | ✅        | ❌                                    |
| **Streaming**        | ✅         | ✅         | ✅      | ✅        | ✅                                    |
| **Embeddings**       | ✅         | ❌         | ❌      | ✅        | ❌                                    |
| **Moderation**       | ✅         | ❌         | ❌      | ❌        | ❌                                    |
| **Additional APIs**  | Responses | -         | -      | Generate | Full A2A Protocol<br/>(11 endpoints) |

### API Details by Provider

#### OpenAI
- **Chat Completions** (`/v1/chat/completions`) - with streaming support
- **Embeddings** (`/v1/embeddings`) - text embedding generation
- **Moderation** (`/v1/moderations`) - content moderation
- **Responses** (`/v1/responses`) - response generation

#### Anthropic
- **Messages** (`/v1/messages`) - Claude's message API with streaming

#### Gemini
- **Generate Content** - standard content generation
- **Streaming Content** - streaming content generation

#### Ollama
- **Chat** (`/api/chat`) - with streaming support
- **Generate** (`/api/generate`) - text generation with streaming
- **Embeddings** (`/api/embed`) - text embeddings

#### A2A (Agent-to-Agent Protocol)
- **Agent Discovery** - agent card endpoint
- **Message Exchange** - send and receive messages with streaming
- **Task Management** - create, get, cancel, and resubscribe to tasks
- **Push Notifications** - configure task push notifications
- Full support for A2A Protocol v0.3.0
