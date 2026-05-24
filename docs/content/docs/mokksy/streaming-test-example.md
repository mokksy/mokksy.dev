---
title: "Streaming test example"
weight: 7
slug: streaming-test-example
toc: true
summary: |-
  Test Server-Sent Events and chunked streaming responses with controlled timing between chunks.
---

Streaming clients fail in ways static JSON tests cannot catch: missed chunks, early completion, timeout handling, buffering, and reconnect logic.

```text
Client opens SSE connection -> Mokksy sends event chunks -> Client handles stream completion, delay, or timeout
```

## SSE response with chunk delays

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

## Plain text stream

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

Use these examples to test code that processes data before the full response is available.
