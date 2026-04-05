---
title: OpenAI Chat Completion
weight: 30
build:
  render: never
---

<!--- CLEAR -->
<!--- INCLUDE
import com.openai.client.okhttp.OpenAIOkHttpClient
import com.openai.models.ChatModel
import com.openai.models.chat.completions.ChatCompletionCreateParams
import com.openai.models.chat.completions.ChatCompletionMessageParam
import com.openai.models.chat.completions.ChatCompletionUserMessageParam
import dev.mokksy.aimocks.openai.MockOpenai

fun main() {
-->
```kotlin
// Create a mock OpenAI server
val openai = MockOpenai()

// Stub a chat completion
openai.completion {
    model = "gpt-4o-mini"
    userMessageContains("say 'Hello!'")
} responds {
    assistantContent = "Hello!"
    finishReason = "stop"
}

// Use the official OpenAI SDK
val client = OpenAIOkHttpClient.builder()
    .apiKey("test-key")
    .baseUrl(openai.baseUrl())
    .build()

val result = client.chat().completions().create(
    ChatCompletionCreateParams.builder()
        .model(ChatModel.GPT_4O_MINI)
        .messages(listOf(
            ChatCompletionMessageParam.ofUser(
                ChatCompletionUserMessageParam.builder()
                    .content("Just say 'Hello!'")
                    .build())))
        .build())

println(result.choices().first().message().content()) // Hello!
```
<!--- SUFFIX
}
-->
<!--- KNIT example-home-chat-completion-01.kt -->

```java
// Create a mock OpenAI server
var mockOpenai = new MockOpenai();

// Stub a chat completion
mockOpenai.completion(req -> {
    req.model("gpt-4o-mini");
    req.requestBodyContains("say 'Hello!'");
}).responds(response -> {
    response.assistantContent("Hello!");
    response.finishReason("stop");
});

// Use the official OpenAI SDK
var client = OpenAIOkHttpClient.builder()
    .apiKey("test-key")
    .baseUrl(mockOpenai.baseUrl())
    .build();

var result = client.chat().completions().create(
    ChatCompletionCreateParams.builder()
        .model(ChatModel.GPT_4O_MINI)
        .messages(List.of(
            ChatCompletionMessageParam.ofUser(
                ChatCompletionUserMessageParam.builder()
                    .content("Just say 'Hello!'")
                    .build())))
        .build());

System.out.println(result.choices().get(0).message().content()); // Hello!
```
