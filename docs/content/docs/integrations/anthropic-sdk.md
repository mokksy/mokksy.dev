---
title: "Anthropic Java SDK"
weight: 60
toc: true
description: Use AI-Mocks Anthropic with the official Anthropic Java SDK for deterministic Messages API and streaming integration tests.
summary: |-
  Configure the official Anthropic Java SDK to call AI-Mocks Anthropic from Kotlin integration tests.
---

Use [AI-Mocks Anthropic](../../ai-mocks/anthropic/) when production code calls the official
Anthropic Java SDK. Point the real SDK client at `anthropic.baseUrl()` so tests execute
provider-shaped HTTP and streaming requests locally.

```text
Integration test -> Anthropic Java SDK -> AI-Mocks Anthropic -> Mokksy HTTP/SSE server
```

The official SDK API shapes shown below are backed by
[Anthropic SDK integration tests](https://github.com/mokksy/ai-mocks/tree/main/ai-mocks-anthropic/src/jvmTest/kotlin/dev/mokksy/aimocks/anthropic/official).
This repository currently verifies the official Anthropic SDK from Kotlin; it also verifies
LangChain4j usage separately.

## Configure the client

The SDK requires an API key value during construction. Because `baseUrl()` routes the request to
the local mock server, use a dummy value in tests rather than a live provider credential.

```kotlin
import com.anthropic.client.AnthropicClient
import com.anthropic.client.okhttp.AnthropicOkHttpClient
import dev.mokksy.aimocks.anthropic.MockAnthropic

val anthropic = MockAnthropic(verbose = true)

val client: AnthropicClient =
  AnthropicOkHttpClient.builder()
    .apiKey("dummy-key-for-tests")
    .baseUrl(anthropic.baseUrl())
    .responseValidation(true)
    .build()
```

## Test the Messages API

Register the request criteria and deterministic reply before invoking `client.messages().create(...)`.

```kotlin
import com.anthropic.models.messages.MessageCreateParams
import io.kotest.matchers.shouldBe
import kotlin.jvm.optionals.getOrNull

anthropic.messages {
  model = "claude-3-7-sonnet-latest"
  maxTokens = 100
  systemMessageContains("helpful assistant")
  userMessageContains("say 'Hello!'")
} responds {
  messageId = "msg_test"
  assistantContent = "Hello"
}

val params =
  MessageCreateParams.builder()
    .model("claude-3-7-sonnet-latest")
    .maxTokens(100)
    .system("You are a helpful assistant.")
    .addUserMessage("Just say 'Hello!' and nothing else")
    .build()

val result = client.messages().create(params)
result.content().mapNotNull { it.text().getOrNull() }.first().text() shouldBe "Hello"
```

## Test streaming Messages

The official SDK tests also configure streamed message content and consume it through
`client.messages().createStreaming(...)`:

```kotlin
import com.anthropic.models.messages.MessageCreateParams
import io.kotest.matchers.collections.shouldContainExactly
import kotlin.time.Duration.Companion.milliseconds

val tokens = listOf("All", " we", " need", " is", " Love")

anthropic.messages {
  model = "claude-3-7-sonnet-latest"
  userMessageContains("What do we need?")
} respondsStream {
  responseChunks = tokens
  delay = 50.milliseconds
  delayBetweenChunks = 10.milliseconds
  stopReason = "end_turn"
}

val params =
  MessageCreateParams.builder()
    .model("claude-3-7-sonnet-latest")
    .maxTokens(100)
    .addUserMessage("What do we need?")
    .build()

val received = mutableListOf<String>()
client.messages().createStreaming(params).use { response ->
  response.stream()
    .filter { it.isContentBlockDelta() }
    .forEachOrdered { chunk ->
      received += chunk.asContentBlockDelta().delta().asText().text()
    }
}

received shouldContainExactly tokens
```

## Next steps

- [Anthropic provider reference](../../ai-mocks/anthropic/) for the mock DSL, streaming options, and error responses
- [LangChain4j](../langchain4j/) if your application uses Anthropic through LangChain4j
- [Spring Boot](../spring-boot/) or [Quarkus](../quarkus/) for application-level base URL configuration
- [Integrations overview](../) for all client and framework guides
