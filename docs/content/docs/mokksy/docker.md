---
title: "Docker"
weight: 60
toc: true
summary: |-
  Run Mokksy as a standalone mock server in Docker. Mount a YAML stubs file and the server loads it before accepting the first connection — no code required.
---

The `mokksy/server-jvm` image runs Mokksy as a standalone HTTP mock server. Stubs are loaded from a YAML file at startup, before the server begins accepting connections.

## Quick start

Create a stubs file:

```yaml
stubs:
  - name: ping
    method: GET
    path: /ping
    response:
      body: '{"response":"Pong"}'
      status: 200
```

Start the container, mounting the file to the default config path:

```bash
docker run -p 8080:8080 \
  -v ./stubs.yaml:/config/stubs.yaml \
  mokksy/server-jvm:snapshot
```

The image sets `MOKKSY_CONFIG=/config/stubs.yaml` by default, so mounting the file there requires no extra environment variables.

## Docker Compose

```yaml
services:
  mokksy:
    image: mokksy/server-jvm
    ports:
      - "8080:8080"
    volumes:
      - ./stubs.yaml:/config/stubs.yaml
```

To use a different path, override `MOKKSY_CONFIG`:

```yaml
services:
  mokksy:
    image: mokksy/server-jvm
    ports:
      - "8080:8080"
    volumes:
      - ./stubs.yaml:/app/stubs.yaml
    environment:
      MOKKSY_CONFIG: /app/stubs.yaml
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MOKKSY_CONFIG` | `/config/stubs.yaml` | Path to the YAML stubs file inside the container |
| `JAVA_OPTS` | `-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError` | JVM flags passed to the server process |

## Startup behaviour

Stubs are loaded from `MOKKSY_CONFIG` **before** the server binds its port. Every request is matchable from the first connection — there is no window where a request can arrive before stubs are registered.

If `MOKKSY_CONFIG` is unset or the file is absent, the server starts with an empty stub registry and returns `404` for all requests.

## Stubs file format

See [File-based configuration](../file-config/) for the full YAML schema, supported response types, and matching options.
