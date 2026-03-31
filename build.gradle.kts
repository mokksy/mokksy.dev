import dev.detekt.gradle.extensions.FailOnSeverity

plugins {
    base
    alias(libs.plugins.detekt)
    alias(libs.plugins.openrewrite)
    kotlin("plugin.serialization") version libs.versions.kotlin apply false
    signing
}

allprojects {
    repositories {
        mavenCentral()
        mavenLocal()
    }
}

// Common configuration for subprojects
subprojects {
    apply(plugin = "dev.detekt")

    detekt {
        config.from(rootProject.file("detekt.yml"))
        buildUponDefaultConfig = true
        parallel = true
        debug = false
        failOnSeverity = FailOnSeverity.Warning
    }
}



rewrite {
    activeRecipe(
//        "org.openrewrite.kotlin.format.AutoFormat",
        "org.openrewrite.gradle.RemoveRedundantDependencyVersions",
        "org.openrewrite.kotlin.cleanup.RemoveLambdaArgumentParentheses",
        "org.openrewrite.kotlin.cleanup.UnnecessaryTypeParentheses",
    )
    isExportDatatables = true
}
