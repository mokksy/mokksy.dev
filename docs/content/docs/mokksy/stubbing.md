---
title: "Stubbing responses"
weight: 10
toc: true
summary: |-
  Learn how to stub HTTP responses in Mokksy. Define custom body content, status codes, and headers with a fluent Kotlin DSL. Perfect for simulating complex API behaviors.
---

Mokksy supports all HTTP verbs. Here are some examples.

## GET request

<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.Mokksy
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.post
import dev.mokksy.mokksy.start
import io.kotest.matchers.equals.beEqual
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import io.ktor.client.HttpClient
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.withCharsetIfNeeded
import io.ktor.sse.ServerSentEvent
import kotlin.random.Random
import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.Serializable
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import org.junit.jupiter.api.Test

class ReadmeTest {
    val mokksy: MokksyServer = Mokksy(verbose = true).start()
    val client: HttpClient =
        HttpClient {
            install(DefaultRequest) {
                url(mokksy.baseUrl())
            }
            install(ContentNegotiation) {
                json()
            }
        }
-->
<!--- INCLUDE
  @Test
  suspend fun testGet() {
-->

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
// given
val expectedResponse =
  // language=json
  """
    {
        "response": "Pong"

    }
    """.trimIndent()

mokksy.get {
  path = beEqual("/ping")
  containsHeader("Foo", "bar")
} respondsWith {
  body = expectedResponse
}

// when
val result = client.get("/ping") {
  headers.append("Foo", "bar")
}

// then
result.status shouldBe HttpStatusCode.OK
result.bodyAsText() shouldBe expectedResponse
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
// given
var expectedResponse = "{\"response\": \"Pong\"}";

mokksy.get(spec -> {
    spec.path("/ping");
    spec.containsHeader("Foo", "bar");
}).respondsWith(builder -> builder.body(expectedResponse));

// when
var response = httpClient.send(
    HttpRequest.newBuilder()
        .uri(URI.create(mokksy.baseUrl() + "/ping"))
        .header("Foo", "bar")
        .GET()
        .build(),
    HttpResponse.BodyHandlers.ofString()
);

// then
assertThat(response.statusCode()).isEqualTo(200);
assertThat(response.body()).isEqualTo(expectedResponse);
```
{{< /tab >}}
{{< /code-tabs >}}

When the request does not match - Mokksy server returns `404 (Not Found)`:

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
val notFoundResult = client.get("/ping") {
  headers.append("Foo", "baz")
}

notFoundResult.status shouldBe HttpStatusCode.NotFound
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
// Request without the required header → 404
var notFound = httpClient.send(
    HttpRequest.newBuilder()
        .uri(URI.create(mokksy.baseUrl() + "/ping"))
        .header("Foo", "baz")
        .GET()
        .build(),
    HttpResponse.BodyHandlers.ofString()
);

assertThat(notFound.statusCode()).isEqualTo(404);
```
{{< /tab >}}
{{< /code-tabs >}}

<!--- INCLUDE
  }
-->

## POST request

<!--- INCLUDE
  @Test
  suspend fun testPost() {
-->

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
// given
val id = Random.nextInt()
val expectedResponse =
  // language=json
  """
    {
        "id": "$id",
        "name": "thing-$id"
    }
    """.trimIndent()

mokksy.post {
  path = beEqual("/things")
  bodyContains("\"$id\"")
} respondsWith {
  body = expectedResponse
  httpStatus = HttpStatusCode.Created
  headers {
    // type-safe builder style
    append(HttpHeaders.Location, "/things/$id")
  }
  headers += "Foo" to "bar" // list style
}

// when
val result =
  client.post("/things") {
    headers.append("Content-Type", "application/json")
    setBody(
      // language=json
      """
            {
                "id": "$id"
            }
            """.trimIndent(),
    )
  }

// then
result shouldNotBeNull {
  status shouldBe HttpStatusCode.Created
  bodyAsText() shouldBe expectedResponse
  headers["Location"] shouldBe "/things/$id"
  headers["Foo"] shouldBe "bar"
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
// given
var expectedBody = "{\"id\":\"42\",\"name\":\"thing-42\"}";

mokksy.post(spec -> {
    spec.path("/things");
    spec.bodyContains("\"42\"");
}).respondsWith(builder -> builder
    .body(expectedBody)
    .status(201)
    .header("Location", "/things/42")
    .header("Foo", "bar"));

// when
var response = httpClient.send(
    HttpRequest.newBuilder()
        .uri(URI.create(mokksy.baseUrl() + "/things"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString("{\"id\":\"42\"}"))
        .build(),
    HttpResponse.BodyHandlers.ofString()
);

// then
assertThat(response.statusCode()).isEqualTo(201);
assertThat(response.body()).isEqualTo(expectedBody);
assertThat(response.headers().firstValue("Location")).hasValue("/things/42");
assertThat(response.headers().firstValue("Foo")).hasValue("bar");
```
{{< /tab >}}
{{< /code-tabs >}}

<!--- INCLUDE
  }
-->

## Typed request body

When the request body type is known at compile time, use the **reified** overloads to let the compiler infer the type —
no explicit `::class` argument required:

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
@Serializable
@JvmRecord
data class CreateItemRequest(val name: String, val quantity: Int)

@Serializable
@JvmRecord
data class CreateItemResponse(val message: String)
```
{{< /tab >}}
{{< /code-tabs >}}

### Reified overloads

<!--- INCLUDE
  @Test
  suspend fun testReified() {
-->

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
val itemName = "Widget"

mokksy.post<CreateItemRequest>(name = "create-item") {
  path("/items")
  bodyMatchesPredicate("name should match") { it?.name == itemName }
} respondsWith {
  body = CreateItemResponse("Hello, $itemName!")
  httpStatus = HttpStatusCode.Created
  headers += "Foo" to "bar"
}

val result =
  client.post("/items") {
    contentType(ContentType.Application.Json)
    setBody(CreateItemRequest(itemName, quantity = 3))
  }

result shouldNotBeNull {
  status shouldBe HttpStatusCode.Created
  headers["Foo"] shouldBe "bar"
  body<CreateItemResponse>().message shouldBe "Hello, $itemName!"
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
record CreateItemRequest(String name, int quantity) {}

mokksy.post(
    CreateItemRequest.class,
    spec -> spec
        .path("/items")
        .bodyMatchesPredicate(request -> "widget".equals(request.name()))
).respondsWith(builder -> builder
    .body("{\"message\":\"Hello, widget!\"}")
    .status(201)
    .header("Foo", "bar"));

var response = httpClient.send(
    HttpRequest.newBuilder()
        .uri(URI.create(mokksy.baseUrl() + "/items"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString("{\"name\":\"widget\",\"quantity\":3}"))
        .build(),
    HttpResponse.BodyHandlers.ofString()
);

assertThat(response.statusCode()).isEqualTo(201);
assertThat(response.body()).isEqualTo("{\"message\":\"Hello, widget!\"}");
assertThat(response.headers().firstValue("Foo")).hasValue("bar");
```
{{< /tab >}}
{{< /code-tabs >}}

<!--- INCLUDE
  }
-->

Reified overloads are provided for all HTTP verbs (`get`, `post`, `put`, `delete`, `patch`, `head`,
`options`) and the generic `method` function. Two overloads exist per verb: one taking an optional
stub name (`name: String? = null`) and one taking a [`StubConfiguration`](../matching/#stub-specificity).

The deserialized request body is accessible inside the response lambda as `request.body()`.

### Explicit KClass token

When the type is determined at runtime or when you want an explicit name on the stub,
pass a `KClass` token using the named `requestType` parameter:

<!--- INCLUDE
  @Test
  suspend fun testKClass() {
-->

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.post(requestType = CreateItemRequest::class) {
  path("/items/validated")
  bodyMatchesPredicate("name=widget and quantity>=5") {
    it?.name == "widget" && (it.quantity) >= 5
  }
} respondsWith {
  body = "accepted"
  httpStatus = HttpStatusCode.Created
}

val accepted =
  client.post("/items/validated") {
    contentType(ContentType.Application.Json)
    setBody(CreateItemRequest("widget", quantity = 10))
  }

accepted.status shouldBe HttpStatusCode.Created
accepted.bodyAsText() shouldBe "accepted"
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.post(
    CreateItemRequest.class,
    spec -> spec
        .path("/items/validated")
        .bodyMatchesPredicate(
            "name=widget and quantity>=5",
            request -> "widget".equals(request.name()) && request.quantity() >= 5
        )
).respondsWith(builder -> builder.body("accepted").status(201));

var accepted = httpClient.send(
    HttpRequest.newBuilder()
        .uri(URI.create(mokksy.baseUrl() + "/items/validated"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString("{\"name\":\"widget\",\"quantity\":10}"))
        .build(),
    HttpResponse.BodyHandlers.ofString()
);

assertThat(accepted.statusCode()).isEqualTo(201);
```
{{< /tab >}}
{{< /code-tabs >}}

<!--- INCLUDE
  }
-->

Java callers pass the class token directly — see the Java tab above.

Deserialization uses Ktor's `ContentNegotiation` plugin. For projects that use Jackson instead of
`kotlinx.serialization`, create the server with `MokksyJackson.create()` (Java API) —
see [Jackson support](#jackson-support) below.

When no stub matches and verbose mode is on (`Mokksy(verbose = true)`), Mokksy logs the closest
partial match and its failed conditions to help diagnose the mismatch.

## Jackson support

By default, Mokksy uses `kotlinx.serialization` for request body deserialization. For Java-first
projects that prefer Jackson, use `MokksyJackson.create()`:

{{< code-tabs >}}
{{< tab lang="java" >}}
```java
import dev.mokksy.MokksyJackson;

// Default Jackson ObjectMapper
Mokksy mokksy = MokksyJackson.create();
mokksy.start();
```
{{< /tab >}}
{{< /code-tabs >}}

To customize the `ObjectMapper`, pass a configuration lambda:

{{< code-tabs >}}
{{< tab lang="java" >}}
```java
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.mokksy.MokksyJackson;

Mokksy mokksy = MokksyJackson.create(ObjectMapper::findAndRegisterModules);
mokksy.start();
```
{{< /tab >}}
{{< /code-tabs >}}

## Status-only responses

Use `respondsWithStatus` when the test only needs to verify a status code — no body needed.
It's an infix function, so it reads naturally next to the stub definition:

<!--- INCLUDE
  @Test
  suspend fun testRespondsWithStatus() {
-->

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.get { path("/ping") } respondsWithStatus HttpStatusCode.NoContent

val response = client.get("/ping")

response.status shouldBe HttpStatusCode.NoContent
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.get(spec -> spec.path("/status-only"))
    .respondsWithStatus(204);
```
{{< /tab >}}
{{< /code-tabs >}}

<!--- INCLUDE
  }
-->
<!--- SUFFIX
}
-->
<!--- KNIT example-mokksy-stubbing-01.kt -->
