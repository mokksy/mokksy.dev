---
title: "Spring AI"
weight: 40
toc: true
description: Test Spring AI clients against provider-compatible AI-Mocks servers for deterministic OpenAI and Gemini behavior, including streaming.
summary: |-
  Spring AI integration guides for AI-Mocks OpenAI and Gemini providers.
---

Spring AI sits on top of provider APIs, so the correct integration point is AI-Mocks rather than
plain Mokksy. Use the provider-specific guide that matches your Spring AI client.

## Supported provider guides

This is a routing guide for Spring AI. Choose the provider page that matches the Spring AI client configured in your application.

- [OpenAI with Spring AI](../../ai-mocks/openai/#integration-with-spring-ai)
- [Gemini with Spring AI](../../ai-mocks/gemini/#integration-with-spring-ai)

These guides cover provider-compatible request formats, streaming behavior, and error handling
without live provider credentials, rate limits, or provider outages.

## Product choice

- Use [Mokksy](../../mokksy/) for general HTTP services in Spring applications.
- Use [AI-Mocks](../../ai-mocks/) for Spring AI clients.
