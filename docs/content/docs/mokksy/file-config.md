---
title: "File-based configuration"
weight: 50
toc: true
summary: |-
  Load mock stubs from a YAML file instead of writing Kotlin DSL code. Useful for Docker environments, shared test fixtures, and teams that prefer configuration over code.
---

File-based configuration lets you define stubs in a YAML file and load them at startup — without writing any Kotlin code.

## Minimal example

```yaml
stubs:
  - name: ping
    method: GET
    path: /ping
    response:
      body: '{"response":"Pong"}'
      status: 200
```

Load the file and start the server:

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
val mokksy = Mokksy().start()
mokksy.loadStubsFromFile("/path/to/stubs.yaml")
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
Mokksy mokksy = Mokksy.create().start();
mokksy.loadStubsFromFile("/path/to/stubs.yaml");
```
{{< /tab >}}
{{< /code-tabs >}}

## Stub fields

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `name` | no | — | Optional identifier shown in logs and error messages |
| `method` | no | `GET` | HTTP method: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS` |
| `path` | **yes** | — | Exact request path to match |
| `match` | no | — | Additional matching criteria (see below) |
| `response` | **yes** | — | Response definition |

### Matching criteria

```yaml
match:
  bodyContains:
    - '"userId":"42"'       # request body must contain this string
    - '"type":"order"'      # multiple strings — all must match
  headers:
    Authorization: Bearer token123   # request must carry this header value
    Content-Type: application/json
```

### Response fields

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `type` | no | `plain` | `plain`, `sse`, or `stream` |
| `body` | no | — | Response body (`plain` type only) |
| `status` | no | `200` | HTTP status code |
| `headers` | no | — | Response headers as a map |
| `delayMs` | no | `0` | Delay before the response is sent (milliseconds) |
| `chunks` | yes\* | — | Ordered list of chunks (`sse` and `stream` types) |
| `delayBetweenChunksMs` | no | `0` | Delay between chunks (milliseconds) |
| `contentType` | no | — | Override content type for `stream` responses |

\* Required when `type` is `sse` or `stream`.

## Response types

### Plain response

```yaml
stubs:
  - name: create-order
    method: POST
    path: /orders
    match:
      bodyContains:
        - '"product":"widget"'
    response:
      body: '{"orderId":"abc-123"}'
      status: 201
      headers:
        Location: /orders/abc-123
      delayMs: 50
```

### Server-Sent Events (SSE)

```yaml
stubs:
  - name: order-updates
    method: POST
    path: /orders/stream
    response:
      type: sse
      chunks:
        - '{"status":"processing"}'
        - '{"status":"shipped"}'
        - '{"status":"delivered"}'
      delayBetweenChunksMs: 100
```

The response content type is automatically set to `text/event-stream; charset=UTF-8`.

### Plain text stream

```yaml
stubs:
  - name: data-feed
    method: GET
    path: /feed
    response:
      type: stream
      chunks:
        - "chunk-one\n"
        - "chunk-two\n"
        - "chunk-three\n"
      contentType: text/plain; charset=UTF-8
      delayBetweenChunksMs: 50
```

## Loading the config

### Explicit path

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
val mokksy = Mokksy().start()
mokksy.loadStubsFromFile("/app/stubs.yaml")  // absolute path
mokksy.loadStubsFromFile("stubs.yaml")       // relative to working directory
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
Mokksy mokksy = Mokksy.create().start();
mokksy.loadStubsFromFile("/app/stubs.yaml");  // absolute path
mokksy.loadStubsFromFile("stubs.yaml");       // relative to working directory
```
{{< /tab >}}
{{< /code-tabs >}}

### Environment variable or system property

`loadStubsFromEnv()` checks `MOKKSY_CONFIG` first, then the `-Dmokksy.config` system property.
When either is set, `start()` loads the stubs automatically — you do not need to call `loadStubsFromEnv()` explicitly in that case.

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
// explicit load — useful when MOKKSY_CONFIG is not in the environment
val mokksy = Mokksy().start()
mokksy.loadStubsFromEnv()
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
// explicit load — useful when MOKKSY_CONFIG is not in the environment
Mokksy mokksy = Mokksy.create().start();
mokksy.loadStubsFromEnv();
```
{{< /tab >}}
{{< /code-tabs >}}

```bash
# via environment variable — stubs are loaded automatically on start()
MOKKSY_CONFIG=/app/stubs.yaml java -jar app.jar

# via system property
java -Dmokksy.config=/app/stubs.yaml -jar app.jar
```

## Validation errors

Mokksy validates the config at load time and reports clear errors when something is wrong:

| Problem | Error message |
|---------|---------------|
| File not found | `Mokksy config file not found: /path/to/stubs.yaml` |
| Malformed YAML | `Invalid YAML in Mokksy config file '/path/...': <parser message>` |
| Unknown HTTP method | `<name>: unknown HTTP method 'BREW'. Valid methods: GET, POST, ...` |
| Stream with no chunks | `<name>: response type 'sse' requires at least one chunk` |

## Combining file config with code stubs

File-based configuration and the code API can be used together — they register stubs on the same server:

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
val mokksy = Mokksy().start()

// load shared stubs from file
mokksy.loadStubsFromFile("shared-stubs.yaml")

// add test-specific stubs via DSL
mokksy.get { path("/health") } respondsWithStatus HttpStatusCode.OK
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
Mokksy mokksy = Mokksy.create().start();

// load shared stubs from file
mokksy.loadStubsFromFile("shared-stubs.yaml");

// add test-specific stubs via Java API
mokksy.get("/health").respondsWith(builder -> builder.body("OK"));
```
{{< /tab >}}
{{< /code-tabs >}}
