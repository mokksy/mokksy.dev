---
title: Mokksy
weight: 10
description: Mock HTTP APIs with real-world behavior in Kotlin and Java integration tests.
summary: |-
  Mokksy is a mock HTTP server for Kotlin and Java integration testing. Use it to test real HTTP behavior, SSE, streaming APIs, deterministic failures, retries, and timeouts.
---
[![Maven Central](https://img.shields.io/maven-central/v/dev.mokksy/mokksy.svg?label=Maven%20Central)](https://central.sonatype.com/artifact/dev.mokksy/mokksy)
[![GitHub stars](https://img.shields.io/github/stars/mokksy/mokksy?style=social)](https://github.com/mokksy/mokksy)

## Why Mokksy?

Mokksy replaces external HTTP dependencies in integration tests. Point your application or SDK client at a local Mokksy server, define the responses you expect, and run the test without real network calls.

It is especially useful when static JSON responses are not enough: streaming APIs, Server-Sent Events (SSE), delayed chunks, retry scenarios, file uploads, and failure paths.

## Key Features

- **Streaming Support**: true support for streaming responses and [Server-Side Events (SSE)][sse]
- **Response Control**: define HTTP status, headers, body content, stream chunks, and delays in test code
- **Per-Request Test Logic**: run Kotlin or Java code inside response builders and predicate matchers when requests are evaluated
- **Delay Simulation**: simulate response delays and delays between individual chunks
- **Failure Simulation**: model rate limits, retry-after responses, malformed payloads, hanging streams, and timeout paths
- **Specificity-Based Matching**: When multiple stubs match a request, Mokksy automatically selects the most specific
  one — no explicit priority configuration required for common cases
- **Ktor Integration**: Embed Mokksy into any existing Ktor application via `Application.mokksy()` and `Route.mokksy()`
  extension functions — including behind authentication middleware
- **AI-Mocks Layer**: use provider-specific OpenAI, Anthropic, Gemini, Ollama, and A2A mocks when the dependency is an AI API

## Product architecture

```text
Application under test -> Mokksy -> Stubbed external HTTP API
```

```text
Client opens SSE connection -> Mokksy sends event chunks -> Client handles completion, delay, or timeout
```

```text
AI-Mocks provider DSL -> Mokksy HTTP/SSE server -> OpenAI/Anthropic/Gemini-compatible responses
```

Mokksy is the core HTTP and SSE mock server. AI-Mocks is built on top of Mokksy and adds provider-specific APIs for AI SDKs.

## Quick start

Start with [Quick Start (5 minutes)](./quick-start/) if you want the shortest path from an empty test to a running local mock server.
Then use [First integration test](./first-integration-test/) to wire Mokksy into application code and verify the request journal.

## Sections

### Guides

- [Quick Start (5 minutes)](./quick-start/) — install Mokksy and run the first stub
- [First integration test](./first-integration-test/) — replace a real HTTP dependency
- [Failure simulation](./failure-simulation/) — delays, timeouts, rate limits, and malformed streams
- [Streaming and SSE](./streaming/) — test SSE, chunked responses, and long-lived streams

### Reference

- [Stubbing responses](./stubbing/) — GET, POST, typed body, status-only
- [Request matching](./request-matching/) — matchers, specificity, priority
- [Verification and request journal](./verification/) — verify stubs, journal modes
- [Multipart and file uploads](./multipart/) — forms, uploaded files, multipart/mixed

### Operations

- [File-based configuration](./file-config/) — load stubs from YAML
- [Docker](./docker/) — run Mokksy as a standalone mock server
- [Ktor integration](./ktor/) — embed Mokksy directly in an existing Ktor application

### Related sections

- [Integrations](../integrations/) — Spring Boot, Ktor, Quarkus, SDKs, and AI frameworks
- [Compare and migrate](../compare/) — evaluate Mokksy and plan migrations

[sse]: https://html.spec.whatwg.org/multipage/server-sent-events.html "Server-Side Events Specification"
