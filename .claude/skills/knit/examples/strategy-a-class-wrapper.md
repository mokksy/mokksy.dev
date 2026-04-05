# Strategy A — Class wrapper with multiple test methods

**When:** Multiple code blocks share a `mokksy` server + `client`, each block is a test body.

**Source markdown (what you write in the .md file):**

```markdown
<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.Mokksy
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.start
import io.kotest.matchers.shouldBe
import io.ktor.client.HttpClient
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.request.post
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import org.junit.jupiter.api.Test

class ReadmeTest {
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
  suspend fun testPost() {
-->

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.post {
  path("/items")
  bodyContains("widget")
} respondsWith {
  body = """{"id":"42"}"""
  httpStatus = HttpStatusCode.Created
}

val result = client.post("/items") {
  setBody("""{"name":"widget"}""")
}

result.status shouldBe HttpStatusCode.Created
```
{{< /tab >}}
{{< /code-tabs >}}

<!--- INCLUDE
  }
-->
<!--- SUFFIX
}
-->
<!--- KNIT example-mokksy-topic-01.kt -->
```

**Generated `.kt` file (what knit produces):**

```kotlin
// This file was automatically generated from topic.md by Knit tool. Do not edit.
package com.example.exampleMokksyTopic01

import dev.mokksy.mokksy.Mokksy
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.start
import io.kotest.matchers.shouldBe
import io.ktor.client.HttpClient
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.request.post
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import org.junit.jupiter.api.Test

class ReadmeTest {
    val mokksy: MokksyServer = Mokksy(verbose = true).start()
    val client: HttpClient =
        HttpClient {
            install(DefaultRequest) {
                url(mokksy.baseUrl())
            }
        }
  @Test
  suspend fun testPost() {

mokksy.post {
  path("/items")
  bodyContains("widget")
} respondsWith {
  body = """{"id":"42"}"""
  httpStatus = HttpStatusCode.Created
}

val result = client.post("/items") {
  setBody("""{"name":"widget"}""")
}

result.status shouldBe HttpStatusCode.Created
  }
}
```

**Key points:**
- `<!--- CLEAR -->` resets the knit state — mandatory for the first file in a markdown document.
- The class header is in the first `INCLUDE`; the test function opens in a second `INCLUDE`.
- Each block has its own `INCLUDE` block opening the method; closing happens in the next `INCLUDE`.
- The final `INCLUDE` closes the last method; `SUFFIX` closes the class; then `KNIT` emits the file.
- Real example: see `docs/build/generated/knit/test/kotlin/example-mokksy-stubbing-01.kt`.
