# Makefile for @chaoqing/jsonforms-vue-primevue
# Quick commands: lint, build, test, publish

.PHONY: help install lint lint-fix build build-only type-check test clean dev publish publish-dry version-patch version-minor version-major check

# Default target
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─── Dependencies ───────────────────────────────────────────────

install: ## Install dependencies (from monorepo root)
	cd ../.. && pnpm install

# ─── Code Quality ───────────────────────────────────────────────

lint: ## Run ESLint
	pnpm run lint

lint-fix: ## Run ESLint with auto-fix
	pnpm run lint:fix

# ─── Build ──────────────────────────────────────────────────────

build: ## Full build (type-check + build)
	pnpm run build

build-only: ## Build only (skip type-check)
	pnpm run build-only

type-check: ## Run TypeScript type-check
	pnpm run type-check

clean: ## Remove build artifacts
	pnpm run clean

# ─── Testing ────────────────────────────────────────────────────

test: ## Run unit tests
	pnpm run test

# ─── Development ────────────────────────────────────────────────

dev: ## Start dev server
	pnpm run dev

# ─── Publish ────────────────────────────────────────────────────

# NPM_TOKEN must be set in the environment, e.g.:
#   export NPM_TOKEN=npm_xxxx
# Or pass it inline:
#   make publish NPM_TOKEN=npm_xxxx

check: ## Verify npm auth and package readiness
	@echo "=== Checking npm authentication ==="
	@npm whoami --registry https://registry.npmjs.org/ || (echo "ERROR: Not authenticated. Set NPM_TOKEN first." && exit 1)
	@echo "=== Checking package name ==="
	@node -e "const pkg=require('./package.json'); console.log('Package:', pkg.name, 'v' + pkg.version)"
	@echo "=== Checking build output ==="
	@test -d lib || (echo "ERROR: lib/ not found. Run 'make build' first." && exit 1)
	@echo "=== Checking files to be published ==="
	@npm pack --dry-run 2>&1 | tail -20
	@echo "=== All checks passed ==="

publish-dry: build ## Dry-run publish (build + pack, no upload)
	@echo "=== Publishing dry run ==="
	npm publish --dry-run --access public

publish: build ## Build and publish to npm
	@echo "=== Publishing @chaoqing/jsonforms-vue-primevue ==="
	npm publish --access public
	@echo "=== Published successfully ==="

# ─── Version Bump ───────────────────────────────────────────────

version-patch: ## Bump patch version (3.7.0 -> 3.7.1)
	npm version patch -m "chore: release v%s"

version-minor: ## Bump minor version (3.7.0 -> 3.8.0)
	npm version minor -m "chore: release v%s"

version-major: ## Bump major version (3.7.0 -> 4.0.0)
	npm version major -m "chore: release v%s"
