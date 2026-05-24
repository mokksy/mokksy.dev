rootProject.name = "mokksy-site"

enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS")

// When working in the combined mokksy/ai-mocks workspace, prefer local source builds over
// published artifacts so docs knit/tests see a coherent dependency graph.
listOf("../mokksy", "../ai-mocks")
    .map(::file)
    .filter { it.isDirectory }
    .forEach(::includeBuild)

include(
    ":docs",
)
