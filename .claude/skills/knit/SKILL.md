---
name: knit
description: Add or maintain kotlinx-knit documentation-testing markers (CLEAR/INCLUDE/SUFFIX/KNIT) around Kotlin code blocks in markdown docs. Use when asked to add knit blocks, fix knit markers, or ensure Kotlin snippets in docs can be compiled.
user-invocable: true
---

# Knit Blocks — Mokksy Docs

You are maintaining **kotlinx-knit** markers in markdown documentation files under `docs/content/`. Knit extracts fenced Kotlin code blocks, assembles them into real `.kt` files (see `docs/build/generated/knit/`), and compiles them so documentation code stays correct.

Always read the target markdown file in full before editing. Also read the generated `.kt` files in `docs/build/generated/knit/test/kotlin/` to understand what knit currently produces and what the target output should look like.

## Directive Format

```
<!--- CLEAR -->              Reset: start a new generated file (wipes accumulated INCLUDE state)
<!--- INCLUDE               Hidden preamble added verbatim before the next code block
<content>
-->
<!--- SUFFIX                Hidden postamble added after the last code block in this group
<content>
-->
<!--- KNIT filename.kt -->  Emit the assembled .kt file with this name
```

**Assembly order:** CLEAR → accumulated INCLUDEs → code block content → SUFFIX → emit on KNIT.

**Import placement — critical:** Knit does NOT hoist or move `import` statements. The entire content of a code block is placed verbatim after the INCLUDE content. If the INCLUDE opens `fun main() {` and the code block starts with `import foo.Bar`, those imports land *inside* the function body, causing `Syntax error: Expecting an element`. **All imports must be placed in the INCLUDE block**, never in the visible code fence.

See `examples/` for concrete before/after illustrations of each pattern.

## File Naming

Pattern: `example-{module}-{topic}-{n:02d}.kt`

| Source file | Module | Topic | Example name |
|---|---|---|---|
| `docs/mokksy/stubbing.md` | `mokksy` | `stubbing` | `example-mokksy-stubbing-01.kt` |
| `docs/mokksy/streaming.md` | `mokksy` | `streaming` | `example-mokksy-streaming-01.kt` |
| `docs/mokksy/verification.md` | `mokksy` | `verification` | `example-mokksy-verification-02.kt` (if `-01` already exists) |
| `docs/mokksy/ktor-embedding.md` | `mokksy` | `ktor-embedding` | `example-mokksy-ktor-embedding-01.kt` |
| `docs/ai-mocks/openai.md` | `openai` | *(sequential)* | `example-openai-01.kt` |
| `docs/home/examples/simple-post.md` | `home` | `post` | `example-home-post-01.kt` |

The counter starts at `01` and increments per markdown file. Check existing `<!--- KNIT` markers in the file to find the next free number.

## Placement Rules

- CLEAR and INCLUDE go **before** `{{< code-tabs >}}` (or directly before the code fence if there is no shortcode).
- SUFFIX and KNIT go **after** `{{< /code-tabs >}}` (or directly after the closing ` ``` `).
- Never nest markers inside `{{< tab >}}` / `{{< /tab >}}` shortcodes.
- No blank line between `<!--- CLEAR -->` and `<!--- INCLUDE`.
- No blank line between the closing ` ``` ` / `{{< /code-tabs >}}` and `<!--- SUFFIX` or `<!--- KNIT`.

## Wrapper Strategies

### A — Class with shared server + client (multi-block tests)

Used in `stubbing.md`, `request-matching.md`. The class is opened in the first INCLUDE and closed by SUFFIX. Each code block is a test method body, with INCLUDE blocks opening/closing the method between blocks.

```markdown
<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.Mokksy
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.start
import io.kotest.matchers.shouldBe
import io.ktor.client.HttpClient
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import org.junit.jupiter.api.Test

class TopicTest {
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
    suspend fun test1() {
-->
[code block 1]
<!--- INCLUDE
    }
    @Test
    suspend fun test2() {
-->
[code block 2]
<!--- INCLUDE
    }
-->
<!--- SUFFIX
}
-->
<!--- KNIT example-mokksy-topic-01.kt -->
```

### B — Entire class in the visible code block (no SUFFIX needed)

Used in `verification.md` (the `@TestInstance` example). The INCLUDE provides only imports; the code block itself is a complete class declaration. No SUFFIX because the class closes inside the visible block.

```markdown
<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.Mokksy
import io.ktor.client.HttpClient
...
-->

[code block: @TestInstance ... class MyTest { ... }]

<!--- KNIT example-mokksy-verification-01.kt -->
```

### C — `fun main()` wrapper (simple snippets referencing a top-level `mokksy`)

```markdown
<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.Mokksy
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.start

val mokksy: MokksyServer = Mokksy(verbose = true).start()
fun main() {
-->
[code block]
<!--- SUFFIX
}
-->
<!--- KNIT example-mokksy-topic-01.kt -->
```

### D — No wrapper (purely declarative top-level code)

Used when the code block is already a complete top-level declaration (`val`, `class`, etc.).

```markdown
<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.JournalMode
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.ServerConfiguration
-->
[code block: val mokksy = MokksyServer(configuration = ServerConfiguration(...))]
<!--- KNIT example-mokksy-topic-01.kt -->
```

### E — Class with `mokksy` only (lifecycle callbacks, no HTTP client)

```markdown
<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.Mokksy
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.start
import kotlin.test.AfterTest

class SnippetHost {
    val mokksy: MokksyServer = Mokksy(verbose = true).start()
-->
[code block: @AfterTest fun afterEach() { mokksy.resetMatchState() }]
<!--- SUFFIX
}
-->
<!--- KNIT example-mokksy-topic-01.kt -->
```

### F — Ktor Application extension function (embedding examples)

Used in `ktor-embedding.md` for snippets that call `install(...)`, `routing { }`, etc.

```markdown
<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.mokksy
import io.ktor.server.application.Application
import io.ktor.server.routing.routing

val server = MokksyServer()
fun Application.configure() {
-->
[code block: routing { mokksy(server) } etc.]
<!--- SUFFIX
}
-->
<!--- KNIT example-mokksy-ktor-embedding-01.kt -->
```

### G — Partial expression inside a parent DSL (flow snippets)

Used when the visible code block is a property assignment inside a larger DSL block (e.g., `flow = flow { ... }` inside `respondsWithSseStream { }`). The surrounding context goes in INCLUDE blocks.

```markdown
<!--- INCLUDE
    @Test
    suspend fun testLongLived() {
        mokksy.post { path = beEqual("/sse-ll") } respondsWithSseStream {
-->
[code block: flow = flow { emit(...); awaitCancellation() }]
<!--- INCLUDE
        }
    }
-->
```

## Import Reference

Only include imports that are actually used in the code blocks. Do NOT copy-paste the full import list from another file.

### Mokksy core
```kotlin
import dev.mokksy.mokksy.Mokksy            // factory function
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.ServerConfiguration
import dev.mokksy.mokksy.JournalMode
import dev.mokksy.mokksy.start             // JVM blocking .start() extension
import dev.mokksy.mokksy.mokksy            // Application/Route extension
import dev.mokksy.mokksy.post              // reified typed POST extension
import dev.mokksy.mokksy.request.RecordedRequest
import dev.mokksy.mokksy.request.RequestSpecification
```

### Ktor client
```kotlin
import io.ktor.client.HttpClient
import io.ktor.client.engine.java.Java      // this project uses Java engine, not CIO
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.serialization.kotlinx.json.json
```

### Ktor server (embedding)
```kotlin
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.UserIdPrincipal
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.basic
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.plugins.doublereceive.DoubleReceive
import io.ktor.server.response.respondText
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import io.ktor.server.sse.SSE
```

### Ktor HTTP / SSE
```kotlin
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType             // HttpResponse.contentType() extension
import io.ktor.http.withCharsetIfNeeded
import io.ktor.sse.ServerSentEvent
```

### Coroutines / Flow
```kotlin
import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.awaitCancellation
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.runBlocking
```

### Kotest
```kotlin
import io.kotest.matchers.equals.beEqual
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.contain
```

### JUnit / kotlin.test
```kotlin
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import kotlin.test.AfterTest              // multiplatform, use for @AfterTest
```

### AI-Mocks — OpenAI
```kotlin
import dev.mokksy.aimocks.openai.MockOpenai
import com.openai.client.okhttp.OpenAIOkHttpClient
import com.openai.models.ChatModel
import com.openai.models.chat.completions.ChatCompletionCreateParams
import com.openai.models.chat.completions.ChatCompletionMessageParam
import com.openai.models.chat.completions.ChatCompletionSystemMessageParam
import com.openai.models.chat.completions.ChatCompletionUserMessageParam
```

## Process

1. Read the target markdown file fully.
2. List every ` ```kotlin ` block. Mark each as: ✅ has knit markers, ❌ missing.
3. Group consecutive missing blocks that logically share compilation context.
4. Check `docs/build/generated/knit/test/kotlin/` for existing generated files to find the next counter value.
5. Choose the wrapper strategy (A–G) per group.
6. Collect only the imports actually used.
7. Insert CLEAR + INCLUDE before the first block of each new knit file.
8. Insert transitional INCLUDE blocks between code blocks in a group (open/close test functions).
9. Insert SUFFIX + KNIT after the last block in each group.
10. Verify placement: markers are outside `{{< code-tabs >}}` shortcodes.
