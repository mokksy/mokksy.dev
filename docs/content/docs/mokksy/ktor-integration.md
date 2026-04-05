---
title: "Ktor integration"
slug: ktor
weight: 50
toc: true
summary: |-
  Documentation for embedding Mokksy in Ktor: Run a mock server as a Ktor module. Perfect for local development, internal API simulation, and testing SSE streams.
---
If you already own a [Ktor][ktor] `Application` — a test harness with authentication middleware, custom plugins, or routes that must coexist with stubs — use the `mokksy` extension functions to mount stub handling directly, without allocating a second embedded server.

## Application-level installation

`Application.mokksy(server)` installs [SSE][sse], `DoubleReceive`, and `ContentNegotiation`
automatically, then mounts a catch-all route that dispatches every incoming request through the
stub registry:

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.mokksy
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty

val server = MokksyServer()
server.get { path("/ping") } respondsWith { body = "pong" }

embeddedServer(Netty, port = 8080) {
  mokksy(server)
}.start(wait = true)
```
{{< /tab >}}
{{< /code-tabs >}}

Use this overload when Mokksy owns the entire application and you want the simplest possible setup.

## Route-level installation

`Route.mokksy(server)` mounts the stub handler inside an existing route scope. Unlike the
application-level overload, it does **not** install plugins — you are responsible for installing
`SSE`, `DoubleReceive`, and `ContentNegotiation` on the surrounding application. This makes it
suitable when Mokksy stubs coexist with real routes:

<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.mokksy
import io.ktor.server.application.Application
import io.ktor.server.response.respondText
import io.ktor.server.routing.get
import io.ktor.server.routing.routing

val server = MokksyServer()
fun Application.configure() {
-->
{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
routing {
  get("/health") { call.respondText("OK") }
  mokksy(server)
}
```
{{< /tab >}}
{{< /code-tabs >}}
<!--- SUFFIX
}
-->
<!--- KNIT example-mokksy-ktor-embedding-01.kt -->

To place stubs behind an authentication check, install the required plugins and wrap `mokksy` in
an `authenticate` block:

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
install(SSE)
install(DoubleReceive)
install(ContentNegotiation) { json() }
install(Authentication) {
  basic("auth-basic") {
    validate { credentials ->
      if (credentials.name == "user" && credentials.password == "pass") {
        UserIdPrincipal(credentials.name)
      } else null
    }
  }
}

routing {
  authenticate("auth-basic") {
    mokksy(server)
  }
}
```
{{< /tab >}}
{{< /code-tabs >}}

Both extension functions accept any `path` pattern as a second parameter (default: `"{...}"`,
which matches all routes). Narrow the scope by passing a prefix:

<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.mokksy
import io.ktor.server.application.Application
import io.ktor.server.routing.routing

val server = MokksyServer()
fun Application.configureNarrow() {
    routing {
-->
{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy(server, path = "/api/{...}")
```
{{< /tab >}}
{{< /code-tabs >}}
<!--- SUFFIX
    }
}
-->
<!--- KNIT example-mokksy-ktor-embedding-02.kt -->

[sse]: https://html.spec.whatwg.org/multipage/server-sent-events.html "Server-Side Events Specification"
[ktor]: https://ktor.io
