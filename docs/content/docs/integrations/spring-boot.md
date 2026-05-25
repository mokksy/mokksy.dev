---
title: "Spring Boot"
weight: 10
toc: true
description: Use Mokksy as a mock HTTP server in Spring Boot integration tests by pointing application properties, RestClient, or WebClient at mokksy.baseUrl().
summary: |-
  Replace external HTTP services in Spring Boot integration tests with Mokksy and run your real client stack against deterministic local endpoints.
---

Use Mokksy in Spring Boot when your application calls an external HTTP dependency through
configuration, `RestClient`, `WebClient`, or another HTTP client bean.

```text
Spring Boot test -> application HTTP client -> Mokksy -> stubbed external API
```

## Typical setup

1. Start Mokksy in the test fixture.
2. Inject `mokksy.baseUrl()` into the property your application uses for the external base URL.
3. Register stubs before the application code makes the call.
4. Execute the real Spring Boot behavior and verify the request journal.

In practice, step 2 usually means overriding the Spring configuration property that holds the
outbound service URL during test startup, rather than changing production bean wiring by hand.

This works well for payment gateways, fraud or risk APIs, telecom provisioning services, document
pipelines, and internal platform dependencies.

## Where to go next

- [First integration test](../../mokksy/first-integration-test/) for the end-to-end test shape
- [Stubbing responses](../../mokksy/stubbing/) for response DSL examples
- [Request matching](../../mokksy/request-matching/) for path, header, and body matching

If the dependency is OpenAI, Anthropic, Gemini, Ollama, or A2A, use [AI-Mocks](../../ai-mocks/)
instead of raw Mokksy.
