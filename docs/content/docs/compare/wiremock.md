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

| Capability | Mokksy | WireMock |
|------------|--------|----------|
| HTTP stubbing and request matching | Yes | Yes |
| SSE-specific response API | `respondsWithSseStream` with event chunks | Use WireMock response configuration or evaluate extensions for your SSE scenario |
| Application-defined stream chunks | `respondsWithStream` accepts chunks or a flow | [Chunked Dribble Delay](https://wiremock.org/docs/simulating-faults/#chunked-dribble-delay) divides a configured body into chunks |
| Inter-chunk timing | Direct `delayBetweenChunks` control | Chunk count and total response duration determine pacing |
| Long-lived streams for client timeout tests | A flow can remain open with `awaitCancellation()` | Evaluate against your timeout scenario and WireMock setup |
| HTTP status and delayed-response scenarios | Yes | Yes |
| Connection-level fault injection | Not positioned as a core Mokksy API | Documented faults include malformed chunks and connection reset |
| Verification API | Request journal and stub verification | Yes |
| Kotlin-first DSL and Java API | Yes | General Java DSL; Kotlin use is through its Java API or integrations |
| Provider-shaped AI API mocks | Available through AI-Mocks | Not a WireMock core provider toolkit |
| Embedding in an existing Ktor application | Yes | Not a Mokksy-equivalent Ktor embedding API |

WireMock capability statements above are based on its
[official fault-simulation documentation](https://wiremock.org/docs/simulating-faults/).
If your decision depends on a WireMock extension or a newer product surface, validate that
specific setup before migrating.

## When to choose Mokksy

- You test clients that consume SSE or streaming APIs.
- You need Kotlin or Java tests that define SSE events and stream chunks directly in test code.
- You want concise Kotlin DSLs and Java-friendly APIs in JVM test suites.
- You use AI provider SDKs and want AI-Mocks on top of a real HTTP/SSE mock server.

## When WireMock may be enough

- Your team already has a mature WireMock setup and its delay or fault APIs cover your scenarios.
- You need connection-reset or malformed-response faults that WireMock already documents directly.
