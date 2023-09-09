DEPCRUISE_CONFIG := .dependency-cruiser.cjs
GRAPHS_DIR := graphs
MK_COMPILED := .mk-compiled
MK_LINTED := .mk-linted
MK_PROD := .mk-prod
MK_TESTED := .mk-tested
TS_SOURCES := $(shell find src test -name '*.ts')
LINT_CACHE := .eslint-cache

depcruise := npx depcruise --config $(DEPCRUISE_CONFIG)
jest := npx jest --reporters `pwd`
tsc := npx tsc -p tsconfig.json --noEmit

.PHONY: all clean clobber prod

# Software development - - - - - - - - - - - - - - - - - - - - - - - - - - - -

all: $(GRAPHS_DIR)/modules.svg $(MK_COMPILED) $(MK_TESTED) $(MK_LINTED)

render-test: all prod
	JWR_PROGRESS=tree npx jest --reporters `pwd`
	npx jest --reporters `pwd`

$(MK_COMPILED): node_modules $(TS_SOURCES)
	$(tsc)
	@touch $@

node_modules: package.json package-lock.json
	npm ci

$(MK_LINTED): node_modules $(TS_SOURCES)
	npx eslint src test \
		--ext .js,.ts \
		--cache --cache-location $(LINT_CACHE) \
		--color --max-warnings 0
	$(depcruise) src
	@touch $@

$(MK_TESTED): node_modules $(TS_SOURCES)
	$(jest)
	@touch $@

tsc-watch: node_modules
	$(tsc) --watch

jest-watch: node_modules prod
	$(jest) --watch

$(GRAPHS_DIR)/modules.svg: $(TS_SOURCES) $(GRAPHS_DIR) node_modules $(DEPCRUISE_CONFIG)
	$(depcruise) --validate -T dot src | dot -Tsvg > $@

$(GRAPHS_DIR):
	mkdir -p $@

# Production build - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

prod: $(MK_PROD)

$(MK_PROD): $(MK_COMPILED) $(MK_LINTED)
	npx tsc -p tsconfig-prod.json
	@touch $@

publish: prod
	npm publish

# CI - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

ci-checks: $(MK_PROD) $(MK_TESTED)

# Utilities - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

clean:
	rm -rf .mk-*
	rm -rf .jest
	rm -f $(LINT_CACHE)
	rm -rf $(GRAPHS_DIR)

clobber: clean
	rm -rf dist
	rm -rf node_modules

