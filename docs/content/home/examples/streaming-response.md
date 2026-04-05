---
title: Streaming Response
weight: 20
build:
  render: never
---

<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.MokksyServer
import io.ktor.client.HttpClient
import io.ktor.client.engine.java.Java
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.runBlocking

val client = HttpClient(Java)
fun main() = runBlocking {
-->
```kotlin
// Create mock server
val mokksy = MokksyServer()
mokksy.startSuspend()

// Stub a streaming endpoint
mokksy.get {
    path("/stream")
} respondsWithStream {
    flow = flow {
        delay(100.milliseconds)
        emit("Hello")
        delay(50.milliseconds)
        emit(" World")
    }
}

// Call the server — response streams as text/event-stream
val response = client.get(mokksy.baseUrl() + "/stream")
println(response.bodyAsText()) // Hello World
```
<!--- SUFFIX
}
-->
<!--- KNIT example-home-streaming-01.kt -->

```java
// Create mock server
var mokksy = Mokksy.create().start();

// Stub a streaming endpoint
mokksy.get(spec -> spec.path("/stream"))
    .respondsWithStream(builder -> builder
        .chunks(List.of("Hello", " World")));

// Call the server — response streams as text/event-stream
var response = httpClient.send(
    HttpRequest.newBuilder()
        .uri(URI.create(mokksy.baseUrl() + "/stream"))
        .GET().build(),
    BodyHandlers.ofString());
System.out.println(response.body()); // Hello World
```
