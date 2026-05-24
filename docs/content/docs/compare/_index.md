---
title: "Compare and migrate"
weight: 40
description: Compare Mokksy with other HTTP mocking tools and evaluate migration paths for streaming, SSE, and failure simulation.
summary: |-
  Evaluation content for teams comparing Mokksy with existing HTTP mocking tools and planning adoption.
---

Use this section when you are evaluating Mokksy against an existing test stack. These pages focus
on decision criteria such as streaming support, SSE behavior, failure simulation, and Kotlin or
Java ergonomics.

## Comparisons

- [Mokksy vs WireMock](./wiremock/) for SSE, chunked streaming, delays between chunks, and failure-path coverage

## Migration focus

When your current mocks mostly serve static JSON, a migration may not be urgent. When you need
streaming APIs, hanging responses, retry tests, or provider-compatible AI mocks, these comparison
pages show where Mokksy changes the tradeoff.
