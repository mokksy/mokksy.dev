---
title: "Anthropic SDK"
weight: 60
toc: true
description: Use AI-Mocks Anthropic with the official Anthropic Java SDK for deterministic Messages API and SSE streaming tests.
summary: |-
  Integration guidance for the official Anthropic Java SDK using AI-Mocks Anthropic.
---

Use [AI-Mocks Anthropic](../ai-mocks/anthropic/) when your application depends on the official
Anthropic Java SDK. The provider page includes an example that configures the SDK client with
`anthropic.baseUrl()` and exercises the Messages API against the mock server.

## Tested integration

The Anthropic docs page includes an SDK example and LangChain4j integration coverage for the same
provider-compatible mock server.

## Where to go next

- [Anthropic overview](../ai-mocks/anthropic/)
- [Anthropic with LangChain4j](../ai-mocks/anthropic/#integration-with-langchain4j) if your Anthropic client sits behind LangChain4j
- [Spring Boot](./spring-boot/) if your application wraps the Anthropic SDK inside a Spring service
- [Quarkus](./quarkus/) if your application wraps the Anthropic SDK inside a Quarkus service
- [Integrations overview](./) for the rest of the framework and SDK entry points
