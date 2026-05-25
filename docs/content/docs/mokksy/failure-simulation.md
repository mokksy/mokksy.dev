---
title: "Failure simulation recipes"
weight: 60
toc: true
summary: |-
  Recipes for delayed responses, hanging streams, timeout paths, rate limits, retry-after responses, and malformed streaming data.
---

Production HTTP clients need more than happy-path JSON. Use these recipes to verify retries, backoff, timeouts, stream parsing, and fallback behavior.

## Delayed response

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.get {
  path("/slow")
} respondsWith {
  delay = 2.seconds
  body = "eventually-ok"
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.get(spec -> spec.path("/slow"))
    .respondsWith(response -> response
        .delayMillis(2_000)
        .body("eventually-ok"));
```
{{< /tab >}}
{{< /code-tabs >}}

## Delayed chunks

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.get {
  path("/slow-stream")
} respondsWithStream {
  delayBetweenChunks = 500.milliseconds
  chunks += "first\n"
  chunks += "second\n"
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.get(spec -> spec.path("/slow-stream"))
    .respondsWithStream(stream -> stream
        .delayBetweenChunksMillis(500)
        .chunk("first\n")
        .chunk("second\n"));
```
{{< /tab >}}
{{< /code-tabs >}}

## Hanging request or stream

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.get {
  path("/never-finishes")
} respondsWithSseStream {
  flow = flow {
    emit(ServerSentEvent(data = "started"))
    awaitCancellation()
  }
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.get(spec -> spec.path("/never-finishes"))
    .respondsWithSseStream(stream -> stream
        .chunks(Stream.generate(() -> SseEvent.data("heartbeat")))
        .delayBetweenChunksMillis(1_000));
```
{{< /tab >}}
{{< /code-tabs >}}

Use this with a short client timeout to verify timeout handling.

## Retry-after and rate limiting

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.post {
  path("/payments")
} respondsWith {
  httpStatus = HttpStatusCode.TooManyRequests
  headers += HttpHeaders.RetryAfter to "30"
  body = """{"error":"rate_limited"}"""
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.post(spec -> spec.path("/payments"))
    .respondsWith(response -> response
        .status(429)
        .header("Retry-After", "30")
        .body("{\"error\":\"rate_limited\"}"));
```
{{< /tab >}}
{{< /code-tabs >}}

## Malformed SSE

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.get {
  path("/malformed-events")
} respondsWithStream {
  contentType = ContentType.Text.EventStream
  chunks += "data: valid\n\n"
  chunks += "this is not a valid event frame"
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.get(spec -> spec.path("/malformed-events"))
    .respondsWithStream(stream -> stream
        .contentType("text/event-stream")
        .chunk("data: valid\n\n")
        .chunk("this is not a valid event frame"));
```
{{< /tab >}}
{{< /code-tabs >}}

## Partial failure

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.get {
  path("/statement")
} respondsWithStream {
  chunks += "header\n"
  chunks += "row-1\n"
  delayBetweenChunks = 250.milliseconds
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.get(spec -> spec.path("/statement"))
    .respondsWithStream(stream -> stream
        .chunk("header\n")
        .chunk("row-1\n")
        .delayBetweenChunksMillis(250));
```
{{< /tab >}}
{{< /code-tabs >}}

Keep the client timeout lower than the full expected transfer time to verify partial-data handling.
