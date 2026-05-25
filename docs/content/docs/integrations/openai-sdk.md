---
title: "OpenAI Java SDK"
weight: 50
toc: true
description: Use AI-Mocks OpenAI with the official openai-java SDK for deterministic chat, streaming, embeddings, moderation, and error-path integration tests.
summary: |-
  Configure the official OpenAI Java SDK to call AI-Mocks OpenAI in Kotlin and Java integration tests.
---

Use [AI-Mocks OpenAI](../../ai-mocks/openai/) when production code calls the official
[`openai-java`](https://github.com/openai/openai-java) SDK. Your test runs the real SDK client
against a local OpenAI-compatible endpoint by replacing only the base URL and using a dummy
credential.

```text
Integration test -> openai-java client -> AI-Mocks OpenAI -> Mokksy HTTP/SSE server
```

The examples below follow the official SDK integration tests in the AI-Mocks repository:
[Kotlin chat and streaming tests](https://github.com/mokksy/ai-mocks/tree/main/ai-mocks-openai/src/jvmTest/kotlin/dev/mokksy/aimocks/openai/official)
and the [Java chat test](https://github.com/mokksy/ai-mocks/blob/main/ai-mocks-openai/src/jvmTest/java/dev/mokksy/aimocks/openai/MockOpenaiJavaTest.java).

## Configure the client

Point the official SDK client to `openai.baseUrl()`. The API key is required by the SDK builder,
but no live OpenAI credential is used because requests go to the local mock server.

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
import com.openai.client.OpenAIClient
import com.openai.client.okhttp.OpenAIOkHttpClient
import dev.mokksy.aimocks.openai.MockOpenai

val openai = MockOpenai(verbose = true)

val client: OpenAIClient =
  OpenAIOkHttpClient.builder()
    .apiKey("dummy-key-for-tests")
    .baseUrl(openai.baseUrl())
    .responseValidation(true)
    .build()
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import dev.mokksy.aimocks.openai.MockOpenai;

var openai = new MockOpenai();
OpenAIClient client = OpenAIOkHttpClient.builder()
    .apiKey("dummy-key-for-tests")
    .baseUrl(openai.baseUrl())
    .build();
```
{{< /tab >}}
{{< /code-tabs >}}

## Test a chat completion

Register the expected provider request with AI-Mocks, then make the SDK call through the configured
client. The test fails if application code sends a request that does not match the stub.

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
import com.openai.models.chat.completions.ChatCompletionCreateParams
import com.openai.models.chat.completions.ChatCompletionMessageParam
import com.openai.models.chat.completions.ChatCompletionUserMessageParam
import io.kotest.matchers.shouldBe

openai.completion {
  model = "gpt-4o-mini"
  userMessageContains("say 'Hello!'")
} responds {
  assistantContent = "Hello"
  finishReason = "stop"
}

val params =
  ChatCompletionCreateParams.builder()
    .messages(
      listOf(
        ChatCompletionMessageParam.ofUser(
          ChatCompletionUserMessageParam.builder()
            .content("Just say 'Hello!' and nothing else")
            .build()
        )
      )
    )
    .model("gpt-4o-mini")
    .build()

val result = client.chat().completions().create(params)
result.choices().first().message().content().orElseThrow() shouldBe "Hello"
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
import com.openai.core.JsonValue;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import com.openai.models.chat.completions.ChatCompletionMessageParam;
import com.openai.models.chat.completions.ChatCompletionUserMessageParam;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

openai.completion(req -> {
    req.model("gpt-4o-mini");
    req.requestBodyContains("say 'Hey!'");
}).responds(response -> {
    response.assistantContent("Hey!");
    response.finishReason("stop");
});

var params = ChatCompletionCreateParams.builder()
    .messages(List.of(ChatCompletionMessageParam.ofUser(
        ChatCompletionUserMessageParam.builder()
            .role(JsonValue.from("user"))
            .content("Just say 'Hey!'").build())))
    .model(ChatModel.GPT_4O_MINI)
    .build();

var result = client.chat().completions().create(params);
assertThat(result.choices().get(0).message().content()).hasValue("Hey!");
```
{{< /tab >}}
{{< /code-tabs >}}

## Test streaming behavior

The repository also tests `client.chat().completions().createStreaming(...)` against
`openai.completion { ... } respondsStream { ... }`, including delays before the first response and
between chunks. Use that path when application behavior depends on incremental delivery rather
than only the final message.

See the runnable [OpenAI streaming examples](../../ai-mocks/openai/#stream-responses) for the
complete Kotlin setup.

## Covered provider surfaces

The AI-Mocks OpenAI integration tests exercise the official SDK with:

- Chat Completions, including streaming completions
- Responses inputs
- Embeddings
- Moderations
- HTTP error responses

## Next steps

- [OpenAI provider reference](../../ai-mocks/openai/) for the mock DSL and supported endpoint examples
- [Spring AI](../spring-ai/) if the SDK is hidden behind Spring AI
- [LangChain4j](../langchain4j/) if the SDK is hidden behind LangChain4j
- [Spring Boot](../spring-boot/) or [Quarkus](../quarkus/) for application-level base URL configuration
- [Integrations overview](../) for all client and framework guides
