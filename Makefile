.PHONY: all
all: format lint knit docs

.PHONY: clean
clean:
	@echo "🧽 Cleaning..."
	@./gradlew clean

.PHONY: hugo
hugo:
	(cd docs && hugo server --watch \
			--gc \
			--disableFastRender \
			--cleanDestinationDir \
			--templateMetricsHints \
			--logLevel debug \
			--buildDrafts)

.PHONY: docs
docs:
	git submodule sync && \
  git submodule update --init --depth=1 && \
	cd docs && \
	hugo server -D --watch

.PHONY: knit
knit:
	@echo "🪡🧶 Running Knit..."
	@rm -rf docs/build
	@./gradlew knit test --rerun-tasks
	@echo "✅ Knit completed!"

.PHONY: lint
lint:
	@./gradlew detekt

# https://docs.openrewrite.org/recipes/maven/bestpractices
.PHONY: format
format:
	@./gradlew detekt --auto-correct
