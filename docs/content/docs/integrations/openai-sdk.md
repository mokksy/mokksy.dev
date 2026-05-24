---
title: "OpenAI SDK"
weight: 50
toc: true
description: Use AI-Mocks OpenAI with the official openai-java SDK for deterministic chat, embeddings, moderation, and streaming tests.
summary: |-
  Integration guidance for the official OpenAI Java SDK using AI-Mocks OpenAI.
---

Use [AI-Mocks OpenAI](../ai-mocks/openai/) when your application depends on the official
`openai-java` SDK. The mock server exposes OpenAI-compatible endpoints and lets you point the SDK
at a local base URL with a dummy API key.

## Tested integration

The OpenAI docs page states that `MockOpenai` is tested against the official `openai-java` SDK,
along with LangChain4j and Spring AI integrations.

## Where to go next

- [OpenAI overview](../ai-mocks/openai/)
- [OpenAI with LangChain4j](../ai-mocks/openai/#integration-with-langchain4j) if your OpenAI client sits behind LangChain4j
- [OpenAI with Spring AI](../ai-mocks/openai/#integration-with-spring-ai) if the integration point is Spring AI rather than the raw SDK
- [Spring Boot](./spring-boot/) if your application wraps the OpenAI SDK inside a Spring service
- [Quarkus](./quarkus/) if your application wraps the OpenAI SDK inside a Quarkus service
- [Integrations overview](./) for the rest of the framework and SDK entry points
