---
title: "Verification and request journal"
weight: 40
toc: true
summary: |-
  Verify your tests with Mokksy. Learn how to catch unmatched requests and unused stubs using the Request Journal to ensure your integration tests are 100% accurate.
---
Mokksy provides two complementary verification methods that check opposite sides of the stub/request contract.

## Verify all stubs were triggered

`verifyNoUnmatchedStubs()` fails if any registered stub was never matched by an incoming request.
Use this to catch stubs you set up but that were never actually called — a sign the code under test took
a different path than expected.

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
// Fails if any stub has never been matched
mokksy.verifyNoUnmatchedStubs()
```
{{< /tab >}}
{{< /code-tabs >}}

> **Note:** Be careful when running tests in parallel against a single `MokksyServer` instance.
> Some stubs might be unmatched when one test completes. Avoid calling this in `@AfterEach`/`@AfterTest`
> unless each test owns its own server instance.

## Verify no unexpected requests arrived

`verifyNoUnexpectedRequests()` fails if any HTTP request arrived at the server but no stub matched it.
These requests are recorded in the `RequestJournal` and reported together.

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
// Fails if any request arrived with no matching stub
mokksy.verifyNoUnexpectedRequests()
```
{{< /tab >}}
{{< /code-tabs >}}

## Recommended AfterEach setup

Always run `verifyNoUnexpectedRequests()` in `@AfterEach` to catch requests that arrived but
matched no stub. For `verifyNoUnmatchedStubs()`, the right placement depends on your fixture strategy:

- **Per-test instance** (`@TestInstance(Lifecycle.PER_METHOD)` or a fresh server per test): call
  both checks in `@AfterEach` — every stub registered during that test should have been matched
  before the server is torn down.
- **Shared instance** (`@TestInstance(Lifecycle.PER_CLASS)` or a companion-object server): call
  `verifyNoUnmatchedStubs()` in `@AfterAll`, immediately before `shutdown()`. Calling it after
  each individual test would falsely report stubs registered for _later_ tests as unmatched.

<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.Mokksy
import io.kotest.matchers.equals.beEqual
import io.kotest.matchers.shouldBe
import io.ktor.client.HttpClient
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.delay
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
-->

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class MyTest {

  val mokksy = Mokksy.create()
  lateinit var client: HttpClient

  @BeforeAll
  suspend fun setup() {
    mokksy.startSuspend()
    mokksy.awaitStarted() // port() and baseUrl() are safe after this point
    client = HttpClient {
      install(DefaultRequest) {
        url(mokksy.baseUrl())
      }
    }
  }

  @Test
  suspend fun testSomething() {
    mokksy.get {
      path("/hi")
    } respondsWith {
      delay = 100.milliseconds // wait 100ms, then reply
      body = "Hello"
    }

    // when
    val response = client.get("/hi")

    // then
    response.status shouldBe HttpStatusCode.OK
    response.bodyAsText() shouldBe "Hello"
  }

  @AfterEach
  fun afterEach() {
    mokksy.verifyNoUnexpectedRequests()
  }

  @AfterAll
  suspend fun afterAll() {
    client.close()
    mokksy.verifyNoUnmatchedStubs() // shared instance: check once, after all tests ran
    mokksy.shutdownSuspend()
  }
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class MyTest {

    private final Mokksy mokksy = Mokksy.create();
    private HttpClient httpClient;

    @BeforeAll
    void setUp() {
        mokksy.start();
        httpClient = HttpClient.newHttpClient();
    }

    @Test
    void testSomething() throws Exception {
        mokksy.get(spec -> spec.path("/hi"))
            .respondsWith(builder -> builder
                .body("Hello")
                .delayMillis(100L));

        var response = httpClient.send(
            HttpRequest.newBuilder()
                .uri(URI.create(mokksy.baseUrl() + "/hi"))
                .GET()
                .build(),
            HttpResponse.BodyHandlers.ofString()
        );

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).isEqualTo("Hello");
    }

    @AfterEach
    void afterEach() {
        mokksy.verifyNoUnexpectedRequests();
    }

    @AfterAll
    void afterAll() {
        mokksy.verifyNoUnmatchedStubs(); // shared instance: check once, after all tests ran
        mokksy.shutdown();
    }
}
```
{{< /tab >}}
{{< /code-tabs >}}

<!--- KNIT example-mokksy-verification-01.kt -->

## Inspecting unmatched items

Use the `find*` variants to retrieve the unmatched items directly for custom assertions:

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
// List<RecordedRequest> — HTTP requests with no matching stub
val unmatchedRequests: List<RecordedRequest> = mokksy.findAllUnexpectedRequests()

// List<RequestSpecification<*>> — stubs that were never triggered
val unmatchedStubs: List<RequestSpecification<*>> = mokksy.findAllUnmatchedStubs()
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
// List of HTTP requests with no matching stub
var unmatchedRequests = mokksy.findAllUnexpectedRequests();

// List of stubs that were never triggered
var unmatchedStubs = mokksy.findAllUnmatchedStubs();
```
{{< /tab >}}
{{< /code-tabs >}}

`RecordedRequest` is an immutable snapshot that captures `method`, `uri`, and `headers` of the incoming request.

## Request journal

Mokksy records incoming requests in a `RequestJournal`. The recording mode is controlled by `JournalMode` in
`ServerConfiguration`:

- **JournalMode.NONE** - Disables request recording entirely. `findAllUnexpectedRequests()`, `findAllMatchedRequests()`, and `verifyNoUnexpectedRequests()` throw `IllegalStateException`.
- **JournalMode.LEAN** _(default)_ – Records only requests with no matching stub. Lower overhead; sufficient for
  `verifyNoUnexpectedRequests()`.
- **JournalMode.FULL** - Records all incoming requests, both matched and unmatched.

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
val mokksy = MokksyServer(
  configuration = ServerConfiguration(
    journalMode = JournalMode.FULL,
  ),
)
```
{{< /tab >}}
{{< /code-tabs >}}

Call `resetMatchState()` between scenarios to clear stub match state and the journal:

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
@AfterTest
fun afterEach() {
  mokksy.resetMatchState()
}
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
@AfterEach
void afterEach() {
    mokksy.resetMatchState();
}
```
{{< /tab >}}
{{< /code-tabs >}}

> **Note:** Stubs configured with `eventuallyRemove = true` are permanently removed from the registry
> on first match and cannot be re-armed by `resetMatchState()`. Re-register them before the next scenario.
