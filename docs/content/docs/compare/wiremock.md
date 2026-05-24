---
title: "Mokksy vs WireMock"
weight: 10
toc: true
description: Compare Mokksy and WireMock for HTTP integration testing, SSE, chunked streaming, deterministic failures, and Kotlin-first JVM tests.
summary: |-
  Compare Mokksy and WireMock for Kotlin and Java integration testing, especially SSE, streaming APIs, and failure simulation.
aliases:
  - /docs/mokksy/wiremock-alternative/
---

WireMock remains a strong general-purpose HTTP stubbing tool.
Mokksy focuses on Kotlin and Java integration tests where streaming behavior,
Server-Sent-Events (SSE), and deterministic failure simulation matter.

## Comparison

| Capability                                  | Mokksy               | WireMock       |
|---------------------------------------------|----------------------|----------------|
| HTTP stubbing for integration tests         | **✅ Yes**            | **✅ Yes**      |
| Request matching by path, headers, and body | **✅ Yes**            | **✅ Yes**      |
| **True Server-Sent Events (SSE)**           | **✅ Yes**            | **❌ No**       |
| **Chunk-level streaming responses**         | **✅ Yes**            | **❌ No**       |
| Delays between chunks                       | **✅ Yes**            | **⚠️ Limited** |
| **Hanging streams for timeout tests**       | **✅ Yes**            | **❌ No**       |
| Failure simulation                          | **✅ Yes**            | **✅ Yes**      |
| **Stream failure simulation**               | **✅ Yes**            | **❌ No**       |
| Verification API                            | **⚠️ Limited**       | **✅ Yes**      |
| **Kotlin DSL**                              | **✅ Yes**            | **❌ No**       |
| **AI/LLM provider mocks**                   | **✅ Yes** (AI-Mocks) | **❌ No**       |
| **Ktor support**                            | **✅ Yes**            | **❌ No**       |

## When to choose Mokksy

- You test clients that consume SSE or streaming APIs.
- You need deterministic tests for timeouts, retries, slow chunks, and partial streams.
- You want concise Kotlin DSLs and Java-friendly APIs in JVM test suites.
- You use AI provider SDKs and want AI-Mocks on top of a real HTTP/SSE mock server.

## When WireMock may be enough

- Your tests mostly return static request/response JSON.
- Your team already has a mature WireMock setup and does not need streaming-specific behavior.
