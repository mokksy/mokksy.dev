---
title: "Integrations"
weight: 30
toc: true
description: Use Mokksy and AI-Mocks with Spring Boot, Ktor, Quarkus, LangChain4j, Koog, Spring AI, the OpenAI SDK, and the Anthropic SDK.
summary: |-
  Shared integration guides for Mokksy and AI-Mocks across backend frameworks, AI frameworks such as LangChain4j and Koog, and provider SDKs.
aliases:
  - /docs/mokksy/ecosystem-integrations/
---

Use this section when your application or SDK can be pointed at a configurable base URL. For
general HTTP dependencies, use Mokksy directly. For AI provider SDKs and frameworks such as
LangChain4j, Koog, or Spring AI, use the provider-specific AI-Mocks layer built on top of Mokksy.

## Backend frameworks

- [Spring Boot](./spring-boot/) for `RestClient`, `WebClient`, and property-driven HTTP clients
- [Ktor](../mokksy/ktor/) when Mokksy needs to live inside an existing Ktor application
- [Quarkus](./quarkus/) for tests that replace outbound HTTP or AI provider dependencies

## AI frameworks and SDKs

- [LangChain4j](./langchain4j/) for provider-backed LangChain4j tests with AI-Mocks
- [Koog with OpenAI](./koog/) for Koog applications that talk to OpenAI-compatible providers through AI-Mocks
- [Spring AI](./spring-ai/) for Spring AI clients that need deterministic provider behavior
- [OpenAI SDK](./openai-sdk/) for the official `openai-java` client
- [Anthropic SDK](./anthropic-sdk/) for the official Anthropic Java client

## Which product should you use?

- Use [Mokksy](../mokksy/) when the dependency is a general HTTP API, SSE endpoint, or internal service.
- Use [AI-Mocks](../ai-mocks/) when the dependency is OpenAI, Anthropic, Gemini, Ollama, or A2A.
