---
title: "Quick Start (5 minutes)"
weight: 5
slug: quick-start
toc: true
summary: |-
  Install Mokksy, start a local HTTP mock server, and run a first deterministic integration test in minutes.
---

This guide gets you from an empty test to a local HTTP mock server. You will stub one endpoint, call it through a real HTTP client, and verify the response.

## Add the test dependency

{{< code-tabs >}}
{{< tab lang="kotlin" filename="build.gradle.kts" >}}
```kotlin
dependencies {
  testImplementation("dev.mokksy:mokksy-jvm:$latestVersion")
}
```
{{< /tab >}}
{{< tab lang="xml" filename="pom.xml" >}}
```xml
<dependency>
  <groupId>dev.mokksy</groupId>
  <artifactId>mokksy-jvm</artifactId>
  <version>[LATEST_VERSION]</version>
  <scope>test</scope>
</dependency>
```
{{< /tab >}}
{{< /code-tabs >}}

## Stub and call an HTTP endpoint

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
// before SUT starts
val mokksy = Mokksy(verbose = true).start()

// SUT setup
val client = HttpClient {
  install(DefaultRequest) {
    url(mokksy.baseUrl())
  }
}

// Given - before test
mokksy.get {
  path("/accounts/42")
} respondsWith {
  body = """{"id":"42","status":"active"}"""
  httpStatus = HttpStatusCode.OK
}

// When
val response = client.get("/accounts/42")

// Then
response.status shouldBe HttpStatusCode.OK
response.bodyAsText() shouldBe """{"id":"42","status":"active"}"""
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
// before SUT starts
var mokksy = Mokksy.create().start();

// Given - before test
mokksy.get(spec -> spec.path("/accounts/42"))
    .respondsWith(response -> response
        .body("{\"id\":\"42\",\"status\":\"active\"}")
        .status(200));

// When
var httpClient = HttpClient.newHttpClient();
var response = httpClient.send(
    HttpRequest.newBuilder()
        .uri(URI.create(mokksy.baseUrl() + "/accounts/42"))
        .GET()
        .build(),
    HttpResponse.BodyHandlers.ofString()
);

// Then
assertThat(response.statusCode()).isEqualTo(200);
assertThat(response.body()).isEqualTo("{\"id\":\"42\",\"status\":\"active\"}");

// after SUT stop (or never)
mokksy.shutdown();

```
{{< /tab >}}
{{< /code-tabs >}}

## What this proves

- Your test talks to a real HTTP server.
- The external service is replaced by Mokksy.
- The response is deterministic and can run in CI without API keys or network access.

Next, build a complete [first integration test](../first-integration-test/) or test a [streaming API](../streaming-test-example/).
