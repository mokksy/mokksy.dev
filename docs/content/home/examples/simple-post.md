---
title: Simple POST
weight: 10
build:
  render: never
---

<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.MokksyServer
import io.ktor.client.HttpClient
import io.ktor.client.engine.java.Java
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import kotlinx.coroutines.runBlocking

val client = HttpClient(Java)
fun main() = runBlocking {
-->
```kotlin
// Create mock server
val mokksy = MokksyServer()
mokksy.startSuspend()

// Stub a POST endpoint
mokksy.post {
    path("/items")
    bodyContains("widget")
} respondsWith {
    body = """{"id":"42"}"""
    httpStatus = HttpStatusCode.Created
}

// Call the server
val response = client.post(mokksy.baseUrl() + "/items") {
    setBody("""{"name":"widget"}""")
}
println(response.bodyAsText()) // {"id":"42"}
```
<!--- SUFFIX
}
-->
<!--- KNIT example-home-post-01.kt -->

```java
// Create mock server
var mokksy = Mokksy.create();
mokksy.start();

// Stub a POST endpoint
mokksy.post(spec -> spec.path("/items"))
    .respondsWith(builder -> builder
        .body("{\"id\":\"42\"}")
        .status(201)
        .header("Location", "/items/42"));

// Call the server - response streams as text/event-stream
var response = httpClient.send(
    HttpRequest.newBuilder()
        .uri(URI.create(mokksy.baseUrl() + "/items"))
        .POST(BodyPublishers.ofString("{\"name\":\"widget\"}"))
        .build(),
    BodyHandlers.ofString());
System.out.println(response.body()); // {"id":"42"}
```
