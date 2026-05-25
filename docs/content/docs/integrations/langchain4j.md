---
title: "LangChain4j"
weight: 30
toc: true
description: Use AI-Mocks with LangChain4j to test provider-backed chat and streaming flows without real OpenAI, Anthropic, or Ollama calls.
summary: |-
  LangChain4j integrations for AI-Mocks across OpenAI, Anthropic, and Ollama-backed tests.
---

Use AI-Mocks when your LangChain4j code talks to a provider API. Mokksy supplies the underlying
HTTP and SSE behavior, and AI-Mocks adds provider-compatible request and response shapes.

## Supported provider guides

- [OpenAI with LangChain4j](../../ai-mocks/openai/#integration-with-langchain4j)
- [Anthropic with LangChain4j](../../ai-mocks/anthropic/#integration-with-langchain4j)
- [Ollama with LangChain4j](../../ai-mocks/ollama/#integration-with-langchain4j)

## Demo

- ["LangChain4j with Quarkus (KotlinConf`25)"](https://2025.kotlinconf.com/talks/795976/)
- ["Financial Assistant Chatbot with Easy RAG"](https://github.com/kpavlov/quarkus-assistant-demo)

## Product choice

- Use [Mokksy](../../mokksy/) directly for generic HTTP dependencies.
- Use [AI-Mocks](../../ai-mocks/) for provider-backed LangChain4j tests.
