---
title: "Mokksy: Multipart File Upload"
weight: 15
build:
  render: never
---

<!--- CLEAR -->
<!--- INCLUDE
import dev.mokksy.mokksy.Mokksy
import dev.mokksy.mokksy.start
import io.ktor.client.HttpClient
import io.ktor.client.engine.java.Java
import io.ktor.client.request.forms.MultiPartFormDataContent
import io.ktor.client.request.forms.append
import io.ktor.client.request.forms.formData
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import kotlinx.coroutines.runBlocking
import kotlin.io.path.createTempFile
import kotlin.io.path.readBytes
import kotlin.io.path.writeText

val client = HttpClient(Java)
val avatarFile = createTempFile("avatar", ".bin").apply {
    writeText("expected")
}
fun main() = runBlocking {
-->
```kotlin
val mokksy = Mokksy().start()

mokksy.post {
    path("/upload")
    body {
        form {
            field("description", "Mokksy upload")
            file("avatar") {
                filename("photo.bin")
                contentType("application/octet-stream")
                bytes { it?.contentEquals(avatarFile.readBytes()) == true }
            }
        }
    }
} respondsWith {
    body = "file-upload-ok"
}

val response = client.post(mokksy.baseUrl() + "/upload") {
    setBody(
        MultiPartFormDataContent(
            formData {
                append("description", "Mokksy upload")
                append(
                    "avatar",
                    avatarFile.readBytes(),
                    Headers.build {
                        append(
                            HttpHeaders.ContentDisposition,
                            """form-data; name="avatar"; filename="photo.bin"""",
                        )
                        append(HttpHeaders.ContentType, "application/octet-stream")
                    },
                )
            },
        ),
    )
}

check(response.status == HttpStatusCode.OK)
println(response.bodyAsText()) // file-upload-ok
```
<!--- SUFFIX
}
-->
<!--- KNIT example-home-multipart-file-upload-01.kt -->
```java
var mokksy = Mokksy.create().start();
var avatarFile = Files.createTempFile("ktor_logo", ".png");

Files.writeString(avatarFile, "dummy-content");

mokksy.post(spec -> spec
    .path("/upload")
    .body(body -> body.form(form -> form
        .field("description", "Ktor logo")
        .file("image", file -> file
            .filename("ktor_logo.png")
            .contentType("image/png")
            .bytesMatches(bytes -> {
                try {
                    return Arrays.equals(bytes, Files.readAllBytes(avatarFile));
                } catch (IOException e) {
                    throw new UncheckedIOException(e);
                }
            })
        )
    ))
).respondsWith(rb -> rb.body("OK"));

var boundary = "----TestBoundary" + System.nanoTime();
var head = (
    "--" + boundary + "\r\n"
        + "Content-Disposition: form-data; name=\"description\"\r\n"
        + "\r\n"
        + "Ktor logo\r\n"
        + "--" + boundary + "\r\n"
        + "Content-Disposition: form-data; name=\"image\"; filename=\"ktor_logo.png\"\r\n"
        + "Content-Type: image/png\r\n"
        + "\r\n"
).getBytes(StandardCharsets.UTF_8);
var tail = ("\r\n--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8);
var body = new ByteArrayOutputStream();
body.write(head);
body.write(Files.readAllBytes(avatarFile));
body.write(tail);

var response = httpClient.send(
    HttpRequest.newBuilder()
        .uri(URI.create(mokksy.baseUrl() + "/upload"))
        .header("Content-Type", "multipart/form-data; boundary=" + boundary)
        .POST(HttpRequest.BodyPublishers.ofByteArray(body.toByteArray()))
        .build(),
    HttpResponse.BodyHandlers.ofString()
);

System.out.println(response.body()); // OK
```
