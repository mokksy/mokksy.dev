---
title: Mokksy
weight: 10
description: Modern mock HTTP server for Kotlin & Java
summary: |-
  Mokksy: The modern mock HTTP server for Kotlin & Java build with Ktor. Unlike WireMock, Mokksy provides true SSE and streaming response support for advanced integration testing.
---
[![Maven Central](https://img.shields.io/maven-central/v/dev.mokksy/mokksy.svg?label=Maven%20Central)](https://central.sonatype.com/artifact/dev.mokksy/mokksy)

## Why Mokksy?

WireMock does not support true SSE and streaming responses.

Mokksy is here to address those limitations.
Particularly, it might be useful for integration testing LLM clients.

## Key Features

- **Streaming Support**: True support for streaming responses and [Server-Side Events (SSE)][sse]
- **Response Control**: Flexibility to control server responses directly via `ApplicationCall` object
- **Delay Simulation**: Support for simulating response delays and delays between chunks
- **Modern API**: Fluent Kotlin DSL API with [Kotest Assertions](https://kotest.io/docs/assertions/assertions.html)
- **Error Simulation**: Ability to mock negative scenarios and error responses
- **Specificity-Based Matching**: When multiple stubs match a request, Mokksy automatically selects the most specific
  one — no explicit priority configuration required for common cases
- **Ktor Integration**: Embed Mokksy into any existing Ktor application via `Application.mokksy()` and `Route.mokksy()`
  extension functions — including behind authentication middleware

## Quick start

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
{{< /code-tabs >}}

## Sections

- [Stubbing responses](./stubbing/) — GET, POST, typed body, status-only
- [Streaming and SSE](./streaming/) — SSE streams, long-lived connections
- [Request matching](./matching/) — matchers, specificity, priority
- [Verification and request journal](./verification/) — verify stubs, journal modes
- [Ktor integration](./ktor-embedding/) — embed in existing Ktor applications

[sse]: https://html.spec.whatwg.org/multipage/server-sent-events.html "Server-Side Events Specification"
