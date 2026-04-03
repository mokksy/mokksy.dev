---
title: "Request matching"
weight: 30
toc: true
---

## Request specification matchers

Mokksy provides various matcher types to specify conditions for matching incoming HTTP requests:

- **Path matchers** — `path("/things")` or `path = beEqual("/things")`
- **Header matchers** — `containsHeader("X-Request-ID", "abc")` checks for a header with an exact value
- **Content matchers** — `bodyContains("value")` checks if the raw body string contains a substring;
  `bodyString += contain("value")` adds a Kotest matcher directly
- **Predicate matchers** — `bodyMatchesPredicate { it?.name == "foo" }` matches against the typed,
  deserialized request body — see [Typed request body](../stubbing/#typed-request-body) for the full API
- **Call matchers** — `successCallMatcher` matches if a function called with the body does not throw
- **Priority** — `priority = 10` on `RequestSpecificationBuilder` sets the `RequestSpecification.priority`
  of the stub; higher values indicate higher priority. Default is `0`.
  Use negative values (e.g. `priority = -1`) for catch-all / fallback stubs.
  Priority is a tiebreaker: it applies only when two stubs match with an equal number of conditions satisfied.
  For most cases, specificity-based matching (see below) selects the right stub automatically.

## Stub specificity

When multiple stubs could match the same request, Mokksy scores each one by counting how many conditions
it satisfies, then selects the highest-scoring stub. A stub with two matching conditions beats a stub with one,
regardless of registration order.

<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.Mokksy
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.post
import dev.mokksy.mokksy.start
import io.kotest.matchers.equals.beEqual
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.contain
import io.ktor.client.HttpClient
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import org.junit.jupiter.api.Test

class MatchingTest {
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
  suspend fun testSpecificity() {
-->

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
// Generic: matches any POST to /users
mokksy.post {
  path("/users")
} respondsWith {
  body = "any user"
}

// Specific: matches only requests whose body contains "admin" — two conditions
mokksy.post {
  path("/users")
  bodyContains("admin")
} respondsWith {
  body = "admin user"
}

// Admin request → specific stub wins (score 2 beats score 1)
val adminResult = client.post("/users") { setBody("admin") }
adminResult.bodyAsText() shouldBe "admin user"

// Other request → only the generic stub matches
val genericResult = client.post("/users") { setBody("regular") }
genericResult.bodyAsText() shouldBe "any user"
```
{{< /tab >}}
{{< /code-tabs >}}

<!--- INCLUDE
  }
-->

## Priority example

If multiple stubs match with the same specificity score, the one with the higher `priority` value wins:

<!--- INCLUDE
  @Test
  suspend fun testPriority() {
-->

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
// Catch-all stub with low priority (negative value)
mokksy.get {
  path = contain("/things")
  priority = -1
} respondsWith {
  body = "Generic Thing"
}

// Specific stub with high priority (positive value)
mokksy.get {
  path = beEqual("/things/special")
  priority = 1
} respondsWith {
  body = "Special Thing"
}

// when
val generic = client.get("/things/123")
val special = client.get("/things/special")

// then
generic.bodyAsText() shouldBe "Generic Thing"
special.bodyAsText() shouldBe "Special Thing"
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
// Catch-all stub: matches any POST, returns 400
mokksy.post(spec -> {
    spec.path("/v1/chat/completions");
    spec.bodyMatchesPredicate(body -> true);
    spec.priority(-1);
}).respondsWith(builder -> builder
    .body("{\"error\":\"unsupported request\"}")
    .status(400));

// Specific stub: matches only when body contains "gpt-4", returns 200
mokksy.post(spec -> {
    spec.path("/v1/chat/completions");
    spec.bodyContains("gpt-4");
    spec.priority(1);
}).respondsWith(builder -> builder
    .body("{\"model\":\"gpt-4\"}")
    .status(200));

// Specific request → specific stub wins
var specific = httpClient.send(
    HttpRequest.newBuilder()
        .uri(URI.create(mokksy.baseUrl() + "/v1/chat/completions"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString("{\"model\":\"gpt-4\"}"))
        .build(),
    HttpResponse.BodyHandlers.ofString()
);
assertThat(specific.statusCode()).isEqualTo(200);

// Unmatched request → catch-all fallback kicks in
var fallback = httpClient.send(
    HttpRequest.newBuilder()
        .uri(URI.create(mokksy.baseUrl() + "/v1/chat/completions"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString("{\"model\":\"other\"}"))
        .build(),
    HttpResponse.BodyHandlers.ofString()
);
assertThat(fallback.statusCode()).isEqualTo(400);
```
{{< /tab >}}
{{< /code-tabs >}}

<!--- INCLUDE
  }
-->
<!--- SUFFIX
}
-->
<!--- KNIT example-mokksy-matching-01.kt -->
