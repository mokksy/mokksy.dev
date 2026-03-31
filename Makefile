.PHONY: all
all: format lint docs

.PHONY: clean
clean:
	@echo "🧽 Cleaning..."
	@./gradlew clean

.PHONY: docs
docs:
	git submodule sync && \
  git submodule update --init --depth=1 && \
	cd docs && \
	(cd themes/docsy && npm install)
	hugo server -D --watch

.PHONY: knit
knit:
	@echo "🪡🧶 Running Knit..."
	@rm -rf docs/build
	@./gradlew knit :docs:test
	@echo "✅ Knit completed!"

.PHONY: lint
lint:
	@./gradlew detekt

# https://docs.openrewrite.org/recipes/maven/bestpractices
.PHONY: format
format:
	@./gradlew detekt --auto-correct
