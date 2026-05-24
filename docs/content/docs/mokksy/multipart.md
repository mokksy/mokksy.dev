---
title: "Multipart and file uploads"
weight: 35
toc: true
summary: |-
  Match multipart/form-data, uploaded files, and multipart/mixed bodies in Mokksy. Verify fields, filenames, content types, and raw bytes with the request body DSL.
---
This page covers Mokksy's multipart body-matching APIs: `body { form { ... } }`, file-part matchers, `FormEncoding`, and `multipart(...)` for non-form bodies.

Use these matchers when your client sends more than JSON. File uploads, mixed metadata-plus-binary requests, and strict form-encoding checks all work through the same request DSL.

## Match multipart form fields and file uploads

`body { form { ... } }` matches both `application/x-www-form-urlencoded` and `multipart/form-data` by default. Add `field(...)` matchers for text parts and `file(...)` matchers for uploaded files.

<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.Mokksy
import dev.mokksy.mokksy.MokksyServer
import dev.mokksy.mokksy.start
import dev.mokksy.mokksy.request.FormEncoding
import io.kotest.matchers.shouldBe
import io.ktor.client.HttpClient
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.request.forms.MultiPartFormDataContent
import io.ktor.client.request.forms.append
import io.ktor.client.request.forms.formData
import io.ktor.client.request.forms.submitForm
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.parameters
import org.junit.jupiter.api.Test
import kotlin.io.path.createTempFile
import kotlin.io.path.readBytes
import kotlin.io.path.writeText

class MultipartDocsTest {
    val mokksy: MokksyServer = Mokksy(verbose = true).start()
    val client: HttpClient =
        HttpClient {
            install(DefaultRequest) {
                url(mokksy.baseUrl())
            }
        }
    val uploadFile = createTempFile("avatar", ".bin").apply {
        writeText("expected")
    }
-->
<!--- INCLUDE
  @Test
  suspend fun testMultipartFileUpload() {
-->

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.post {
  path("/upload")
  body {
    form {
      field("description", "Mokksy upload")
      file("avatar") {
        filename("photo.bin")
        contentType("application/octet-stream")
        bytes { it?.contentEquals(uploadFile.readBytes()) == true }
      }
    }
  }
} respondsWith {
  body = "file-upload-ok"
}

val response = client.post("/upload") {
  setBody(
    MultiPartFormDataContent(
      formData {
        append("description", "Mokksy upload")
        append(
          "avatar",
          uploadFile.readBytes(),
          Headers.build {
            append(
              HttpHeaders.ContentDisposition,
              "form-data; name=\"avatar\"; filename=\"photo.bin\"",
            )
            append(HttpHeaders.ContentType, "application/octet-stream")
          },
        )
      },
    ),
  )
}

response.status shouldBe HttpStatusCode.OK
response.bodyAsText() shouldBe "file-upload-ok"
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
var uploadFile = Files.createTempFile("avatar", ".bin");
Files.writeString(uploadFile, "expected");

mokksy.post(spec -> spec
    .path("/upload")
    .body(body -> body.form(form -> form
        .field("description", "Mokksy upload")
        .file("avatar", file -> file
            .filename("photo.bin")
            .contentType("application/octet-stream")
            .bytesMatches(bytes -> {
                try {
                    org.assertj.core.api.Assertions.assertThat(bytes)
                        .containsExactly(Files.readAllBytes(uploadFile));
                    return true;
                } catch (IOException e) {
                    throw new UncheckedIOException(e);
                }
            })
        )
    ))
).respondsWith(rb -> rb.body("file-upload-ok"));
```
{{< /tab >}}
{{< /code-tabs >}}

For file parts, Mokksy supports `filename(...)`, `contentType(...)`, `text(...)`, and `bytes(...)`. Each matcher adds specificity, so a stub that checks field values and file content automatically outranks a looser fallback stub.

<!--- INCLUDE
  }
-->

## Restrict accepted form encoding

Use `FormEncoding.MULTIPART` or `FormEncoding.URL_ENCODED` when a stub must reject the other form style. Leave the default `AUTO` when either encoding is acceptable.

<!--- INCLUDE
  @Test
  suspend fun testMultipartOnlyEncoding() {
-->

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.post {
  path("/multipart-only")
  body {
    form(FormEncoding.MULTIPART) {
      field("key", "value")
    }
  }
} respondsWith {
  body = "multipart-only-ok"
}

val multipartResult = client.post("/multipart-only") {
  setBody(
    MultiPartFormDataContent(
      formData { append("key", "value") },
    ),
  )
}

val urlEncodedResult =
  client.submitForm(
    url = "/multipart-only",
    formParameters = parameters { append("key", "value") },
  )

multipartResult.status shouldBe HttpStatusCode.OK
urlEncodedResult.status shouldBe HttpStatusCode.NotFound
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.post(spec -> spec
    .path("/multipart-only")
    .body(body -> body.form(FormEncoding.MULTIPART, form -> form
        .field("key", "value")
    ))
).respondsWith(rb -> rb.body("multipart-only-ok"));
```
{{< /tab >}}
{{< /code-tabs >}}

<!--- INCLUDE
  }
-->

## Match non-form multipart bodies

Not every multipart request is `multipart/form-data`. Use `body { multipart(...) { ... } }` for payloads such as `multipart/mixed`, where each part has its own content type and semantic role.

<!--- INCLUDE
  @Test
  suspend fun testMultipartMixed() {
-->

{{< code-tabs >}}
{{< tab lang="kotlin" >}}
```kotlin
mokksy.post {
  path("/multipart-mixed")
  body {
    multipart("multipart/mixed") {
      boundary("WebAppBoundary")
      part("metadata") {
        contentType("application/json")
        text { it?.contains("Ktor logo") == true }
      }
      part("image") {
        contentType("image/png")
        bytes { it?.isNotEmpty() == true }
      }
    }
  }
} respondsWith {
  body = "multipart-mixed-ok"
}

val response = client.post("/multipart-mixed") {
  setBody(
    MultiPartFormDataContent(
      formData {
        append(
          "metadata",
          """{"description":"Ktor logo"}""".encodeToByteArray(),
          Headers.build {
            append(HttpHeaders.ContentDisposition, "form-data; name=\"metadata\"")
            append(HttpHeaders.ContentType, "application/json")
          },
        )
        append(
          "image",
          "png-data".encodeToByteArray(),
          Headers.build {
            append(HttpHeaders.ContentDisposition, "form-data; name=\"image\"")
            append(HttpHeaders.ContentType, "image/png")
          },
        )
      },
      boundary = "WebAppBoundary",
      contentType =
        ContentType.MultiPart.Mixed.withParameter(
          "boundary",
          "WebAppBoundary",
        ),
    ),
  )
}

response.status shouldBe HttpStatusCode.OK
response.bodyAsText() shouldBe "multipart-mixed-ok"
```
{{< /tab >}}
{{< tab lang="java" >}}
```java
mokksy.post(spec -> spec
    .path("/multipart-mixed")
    .body(body -> body.multipart("multipart/mixed", multipart -> multipart
        .boundary("WebAppBoundary")
        .part("metadata", part -> part
            .contentType("application/json")
            .textMatches(text -> text != null && text.contains("Ktor logo"))
        )
        .part("image", part -> part
            .contentType("image/png")
            .bytesMatches(bytes -> bytes != null && bytes.length > 0)
        )
    ))
).respondsWith(rb -> rb.body("multipart-mixed-ok"));
```
{{< /tab >}}
{{< /code-tabs >}}

<!--- INCLUDE
  }
-->
<!--- SUFFIX
}
-->
<!--- KNIT example-mokksy-multipart-01.kt -->
