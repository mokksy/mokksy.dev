---
title: "Streaming and SSE"
weight: 50
toc: true
aliases:
  - /docs/mokksy/streaming-test-example/
description: |-
  Server-Sent Events (SSE) enable servers to push updates to clients over a single HTTP connection. The provided code demonstrates how to use mokksy to simulate an SSE stream and verify its response in both Kotlin and Java.
summary: |-
  Mock true Server-Sent Events (SSE) and chunked streaming responses with Mokksy. Test real-time data flow, stream timing, and long-lived connections from Kotlin and Java.
---
## Server-Sent Events (SSE)

[Server-Sent Events (SSE)][sse] allow a server to push updates to the client over a single, long-lived HTTP connection.

Streaming clients fail in ways static JSON tests cannot catch: missed chunks, early completion, timeout handling, buffering, and reconnect logic.

```text
Client opens SSE connection -> Mokksy sends event chunks -> Client handles stream completion, delay, or timeout
```

This example defines an SSE endpoint, emits two events with controlled timing, and verifies that the client receives a real `text/event-stream` response.

<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.Mokksy
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.start
import io.kotest.matchers.equals.beEqual
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import io.ktor.client.HttpClient
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.http.withCharsetIfNeeded
import io.ktor.sse.ServerSentEvent
import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.awaitCancellation
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.flow
import org.junit.jupiter.api.Test

class StreamingTest {
    val mokksy: MokksyServer = Mokksy(verbose = true).start()
    val client: HttpClient =
        HttpClient {
            install(DefaultRequest) {
                url(mokksy.baseUrl())
            }
        }
-->
<!--- INCLUDE
    @Test
    suspend fun testSse() {
-->
{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.post {
  path = beEqual("/sse")
} respondsWithSseStream {
  flow =
    flow {
      delay(200.milliseconds)
      emit(
        ServerSentEvent(
          data = "One",
        ),
      )
      delay(50.milliseconds)
      emit(
        ServerSentEvent(
          data = "Two",
        ),
      )
    }
}

// when
val result = client.post("/sse")

// then
result shouldNotBeNull {
  status shouldBe HttpStatusCode.OK
  contentType() shouldBe ContentType.Text.EventStream.withCharsetIfNeeded(Charsets.UTF_8)
  bodyAsText() shouldBe "data: One\r\n\r\ndata: Two\r\n\r\n"
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.post(spec -> spec.path("/sse"))
    .respondsWithSseStream(builder -> builder
        .chunk(SseEvent.data("One"))
        .chunk(SseEvent.data("Two")));

var response = httpClient.send(
    HttpRequest.newBuilder()
        .uri(URI.create(mokksy.baseUrl() + "/sse"))
        .POST(HttpRequest.BodyPublishers.noBody())
        .build(),
    HttpResponse.BodyHandlers.ofString()
);

assertThat(response.statusCode()).isEqualTo(200);
assertThat(response.body()).isEqualTo("data: One\r\n\r\ndata: Two\r\n\r\n");
```
{{< /tab >}}
{{< /code-tabs >}}

## Long-lived SSE streams

By default, the SSE stream closes when the flow completes.

To keep it open (e.g. for clients that reconnect on close), end the flow with `awaitCancellation()`:

<!--- INCLUDE
    }
    @Test
    suspend fun testLongLivedSse() {
-->
{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.post {
  path = beEqual("/sse-ll")
} respondsWithSseStream {
  flow = flow {
    emit(ServerSentEvent(data = "hello"))
    awaitCancellation()
  }
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.post(spec -> spec.path("/sse-ll"))
    .respondsWithSseStream(stream -> stream
        .chunks(Stream.generate(() -> SseEvent.data("heartbeat")))
        .delayBetweenChunksMillis(1_000));
```
{{< /tab >}}
{{< /code-tabs >}}
<!--- INCLUDE
    }
-->

## SSE response with chunk delays

Use `delayBetweenChunks` when you want to verify that a client handles events as they arrive, instead of waiting for the full response body.

<!--- INCLUDE
    @Test
    suspend fun testSseWithChunkDelays() {
-->
{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.get {
  path("/events")
} respondsWithSseStream {
  delayBetweenChunks = 100.milliseconds
  chunks += ServerSentEvent(data = """{"status":"accepted"}""")
  chunks += ServerSentEvent(data = """{"status":"processed"}""")
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.get(spec -> spec.path("/events"))
    .respondsWithSseStream(stream -> stream
        .delayBetweenChunksMillis(100)
        .chunk(SseEvent.data("{\"status\":\"accepted\"}"))
        .chunk(SseEvent.data("{\"status\":\"processed\"}")));
```
{{< /tab >}}
{{< /code-tabs >}}
<!--- INCLUDE
    }
-->

## Plain text stream

Use `respondsWithStream` for non-SSE streaming responses, such as line-delimited downloads or APIs that return partial data before the transfer completes.

<!--- INCLUDE
    @Test
    suspend fun testPlainTextStream() {
-->
{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.get {
  path("/download")
} respondsWithStream {
  delayBetweenChunks = 50.milliseconds
  chunks += "part-1\n"
  chunks += "part-2\n"
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.get(spec -> spec.path("/download"))
    .respondsWithStream(stream -> stream
        .delayBetweenChunksMillis(50)
        .chunk("part-1\n")
        .chunk("part-2\n"));
```
{{< /tab >}}
{{< /code-tabs >}}
<!--- INCLUDE
    }
-->

Use these examples to test code that processes data before the full response is available.
For timeout, retry, and malformed-stream cases, continue with [Failure simulation](../failure-simulation/).

<!--- SUFFIX
}
-->
<!--- KNIT example-mokksy-streaming-01.kt -->

[sse]: https://html.spec.whatwg.org/multipage/server-sent-events.html "Server-Side Events Specification"
