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

For the fastest path, start with [Quick Start (5 minutes)](./quick-start/).

1. Add dependencies:
{{< code-tabs >}}
{{< tab lang="kotlin" filename="build.gradle.kts" >}}
   ```kotlin
   dependencies {               
        // for multiplatform projects
       implementation("dev.mokksy:mokksy:$latestVersion")
        // for JVM projects
       implementation("dev.mokksy:mokksy-jvm:$latestVersion")
   }
   ``` 
{{< /tab >}}
{{< tab lang="xml" filename="pom.xml" >}}
   ```xml
    <dependency>
        <groupId>dev.mokksy</groupId>
        <artifactId>mokksy-jvm</artifactId>
        <version>[LATEST_VERSION]</version>
        <scope>test</scope>
    </dependency>
   ```
{{< /tab >}}
{{< /code-tabs >}}


2. Create and start Mokksy server:

   **Kotlin — all platforms (coroutine-based):**

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
   ```kotlin
   import dev.mokksy.mokksy.Mokksy

   val mokksy = Mokksy()
   mokksy.startSuspend()
   mokksy.awaitStarted() // port() and baseUrl() are safe after this point
   ```
{{< /tab >}}
{{< /code-tabs >}}

   **Kotlin — JVM blocking / Java:**

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
   ```kotlin
   import dev.mokksy.mokksy.Mokksy

   val mokksy = Mokksy().start()
   ```
{{< /tab >}}
{{< tab lang="java" >}}
```java
import dev.mokksy.Mokksy;

Mokksy mokksy = Mokksy.create();
mokksy.start(); // baseUrl() is safe after start() returns
```
{{< /tab >}}
{{< /code-tabs >}}

3. Configure your HTTP client to use the Mokksy server's base URL:

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
val client = HttpClient {
  install(DefaultRequest) {
    url(mokksy.baseUrl())
  }
  install(ContentNegotiation) {
    json()
  }
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
var httpClient = HttpClient.newHttpClient();

var request = HttpRequest.newBuilder()
    .uri(URI.create(mokksy.baseUrl() + "/ping"))
    .GET()
    .build();
```
{{< /tab >}}
{{< /code-tabs >}}

## Sections

### Guides

- [Quick Start (5 minutes)](./quick-start/) — install Mokksy and run the first stub
- [First integration test](./first-integration-test/) — replace a real HTTP dependency
- [Failure simulation recipes](./failure-simulation/) — delays, timeouts, rate limits, and malformed streams
- [Streaming test example](./streaming-test-example/) — test SSE and chunked responses

### Reference

- [Stubbing responses](./stubbing/) — GET, POST, typed body, status-only
- [Request matching](./request-matching/) — matchers, specificity, priority
- [Verification and request journal](./verification/) — verify stubs, journal modes
- [Multipart and file uploads](./multipart/) — forms, uploaded files, multipart/mixed
- [Streaming and SSE](./streaming/) — SSE streams, long-lived connections

### Operations

- [File-based configuration](./file-config/) — load stubs from YAML
- [Docker](./docker/) — run Mokksy as a standalone mock server
- [Ktor integration](./ktor/) — embed Mokksy directly in an existing Ktor application

### Related sections

- [Integrations](../integrations/) — Spring Boot, Ktor, Quarkus, SDKs, and AI frameworks
- [Compare and migrate](../compare/) — evaluate Mokksy and plan migrations

[sse]: https://html.spec.whatwg.org/multipage/server-sent-events.html "Server-Side Events Specification"
