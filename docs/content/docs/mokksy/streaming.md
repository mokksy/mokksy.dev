---
title: "Streaming and SSE"
weight: 20
toc: true
---

## Server-Sent Events (SSE)

[Server-Sent Events (SSE)][sse] allow a server to push updates to the client over a single, long-lived HTTP connection.

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

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```
flow = flow {
    emit(ServerSentEvent(data = "hello"))
    awaitCancellation() // stream stays open until client disconnects
}
```
{{< /tab >}}
{{< /code-tabs >}}

[sse]: https://html.spec.whatwg.org/multipage/server-sent-events.html "Server-Side Events Specification"
