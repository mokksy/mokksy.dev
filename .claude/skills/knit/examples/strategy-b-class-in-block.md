# Strategy B — Complete class inside the visible code block

**When:** The code block is a self-contained, complete class declaration. The INCLUDE provides only imports. No SUFFIX needed because the class `}` is in the visible block itself.

**Source markdown:**

```markdown
<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.Mokksy
import io.ktor.client.HttpClient
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
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
    client = HttpClient {
      install(DefaultRequest) { url(mokksy.baseUrl()) }
    }
  }

  @Test
  suspend fun testSomething() {
    mokksy.get { path("/hi") } respondsWith { body = "Hello" }
    val response = client.get("/hi")
    response.status shouldBe HttpStatusCode.OK
    response.bodyAsText() shouldBe "Hello"
  }

  @AfterEach fun afterEach() { mokksy.verifyNoUnexpectedRequests() }

  @AfterAll
  suspend fun afterAll() {
    mokksy.verifyNoUnmatchedStubs()
    mokksy.shutdownSuspend()
  }
}
```
{{< /tab >}}
{{< /code-tabs >}}

<!--- KNIT example-mokksy-verification-01.kt -->
```

**Generated `.kt` file:**

```kotlin
// This file was automatically generated from verification.md by Knit tool. Do not edit.
package com.example.exampleMokksyVerification01

import dev.mokksy.Mokksy
import io.ktor.client.HttpClient
...

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class MyTest {
  ...
}
```

**Key points:**
- No `SUFFIX` — the class `}` is the last line of the visible code block.
- The INCLUDE is separated from the shortcode by a blank line (the blank line is preserved in the output but doesn't affect compilation).
- Real example: see `docs/build/generated/knit/test/kotlin/example-mokksy-verification-01.kt`.
