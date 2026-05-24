---
title: "First integration test"
weight: 6
toc: true
summary: |-
  Replace a real external HTTP service with Mokksy and verify your application behavior through a real client call.
---

Use Mokksy when your code normally calls an external HTTP API: payments, customer data, fraud scoring, telecom provisioning, document processing, or internal platform services.

```text
Application under test -> Mokksy -> Stubbed external HTTP API
```

## Test shape

1. Start Mokksy on a random local port.
2. Configure the application under test to use `mokksy.baseUrl()`.
3. Stub the external endpoint and response.
4. Execute the real application behavior.
5. Verify the response and the request journal.

## Example

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
val mokksy = Mokksy(verbose = true).start()
val client = HttpClient {
  install(DefaultRequest) {
    url(mokksy.baseUrl())
  }
}

mokksy.post {
  path("/risk/check")
  bodyContains("customer-123")
} respondsWith {
  httpStatus = HttpStatusCode.Accepted
  body = """{"decision":"review"}"""
}

val response = client.post("/risk/check") {
  contentType(ContentType.Application.Json)
  setBody("""{"customerId":"customer-123","amount":2500}""")
}

response.status shouldBe HttpStatusCode.Accepted
response.bodyAsText() shouldBe """{"decision":"review"}"""

mokksy.verifyNoUnexpectedRequests()
mokksy.verifyNoUnmatchedStubs()
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
var mokksy = Mokksy.create().start();
var httpClient = HttpClient.newHttpClient();

try {
    mokksy.post(spec -> spec
        .path("/risk/check")
        .bodyContains("customer-123")
    ).respondsWith(response -> response
        .status(202)
        .body("{\"decision\":\"review\"}"));

    var response = httpClient.send(
        HttpRequest.newBuilder()
            .uri(URI.create(mokksy.baseUrl() + "/risk/check"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(
                "{\"customerId\":\"customer-123\",\"amount\":2500}"
            ))
            .build(),
        HttpResponse.BodyHandlers.ofString()
    );

    assertThat(response.statusCode()).isEqualTo(202);
    assertThat(response.body()).isEqualTo("{\"decision\":\"review\"}");

    mokksy.verifyNoUnexpectedRequests();
} finally {
    mokksy.shutdown();
}
```
{{< /tab >}}
{{< /code-tabs >}}

This catches two important integration failures: your code sent the wrong request, or it did not call the dependency at all.
