DEPCRUISE_CONFIG := .dependency-cruiser.cjs
MK_COMPILED := .mk-compiled
MK_LINTED := .mk-linted
MK_PROD := .mk-prod
MK_TESTED := .mk-tested
TS_SOURCES := $(shell find src test -name '*.ts')
LINT_CACHE := .eslint-cache

depcruise := npx depcruise --config $(DEPCRUISE_CONFIG)

.PHONY: check clean clobber prod

# Software development - - - - - - - - - - - - - - - - - - - - - - - - - - - -

check: $(MK_COMPILED) $(MK_TESTED) $(MK_LINTED)

$(MK_COMPILED): node_modules $(TS_SOURCES)
	npx tsc -p tsconfig.json --noEmit
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

$(MK_TESTED): node_modules $(MK_PROD)
	npx jest --reporters `pwd`
	@touch $@

# Production build - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

prod: $(MK_PROD)

$(MK_PROD): $(MK_COMPILED) $(MK_LINTED)
	npx tsc -p tsconfig-prod.json
	@touch $@

# Utilities - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

clean:
	rm -rf $(MK_LINTED) $(MK_COMPILED)
	rm -f $(LINT_CACHE)

clobber: clean
	rm -rf dist
	rm -rf node_modules

