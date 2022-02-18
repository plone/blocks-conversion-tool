### Defensive settings for make:
#     https://tech.davis-hansson.com/p/make/
SHELL:=bash
.ONESHELL:
.SHELLFLAGS:=-xeu -o pipefail -O inherit_errexit -c
.SILENT:
.DELETE_ON_ERROR:
MAKEFLAGS+=--warn-undefined-variables
MAKEFLAGS+=--no-builtin-rules

define GetFromPkg
$(shell node -p "require('./package.json').$(1)")
endef

IMAGE_TAG:=$(call GetFromPkg,version)
IMAGE_NAME=plone/blocks-conversion-tool

# Add the following 'help' target to your Makefile
# And add help text after each target name starting with '\#\#'
.PHONY: help
help: ## This help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## Install the frontend
	@echo "Install frontend"
	yarn install

.PHONY: start
start: ## Start Frontend
	yarn start

.PHONY: format-prettier
format-prettier: ## Format Code with Prettier
	yarn run prettier:fix

.PHONY: format-lint
format-lint: ## Format Code with Lint
	yarn run lint:fix

.PHONY: format
format: format-prettier format-lint ## Format the codebase according to our standards

.PHONY: check-prettier
check-prettier: ## Check if code was not prettified
	yarn run prettier

.PHONY: check-lint
check-lint: ## Check if code needs to be linted
	yarn run lint

.PHONY: test
test: ## Test code
	yarn test

.PHONY: test-all
test-all: check-prettier check-lint test  ## Check lint and test code

.PHONY: release-package-dry-run
release-package-dry-run:  ## Dry run of releasing this package to npm and Github
	@echo "Release package @plone/blocks-conversion-tool (DRY RUN)"
	@npx release-it --dry-run

.PHONY: release-package
release-package:  ## Release this package to npm and Github
	@echo "Release package @plone/blocks-conversion-tool"
	@npx release-it

.PHONY: build-image
build-image:  ## Build Docker Image
	@echo "Building $(IMAGE_NAME):$(IMAGE_TAG)"
	@docker build . -t $(IMAGE_NAME):$(IMAGE_TAG) -f Dockerfile

.PHONY: push-image
push-image:  ## Publish Docker Image
	@echo "Pushing $(IMAGE_NAME):$(IMAGE_TAG)"
	@docker push $(IMAGE_NAME):$(IMAGE_TAG)
	@docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(IMAGE_NAME):latest
	@echo "Pushing $(IMAGE_NAME):latest"
	@docker push $(IMAGE_NAME):latest

.PHONY: release-image
release-image: build-image push-image ## Build and push the image to docker hub
	@echo "Released $(IMAGE_NAME)"
