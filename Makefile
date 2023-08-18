MK_COMPILED := .mk-compiled
MK_LINTED := .mk-linted
MK_PROD := .mk-prod
MK_TESTED := .mk-tested
TS_SOURCES := $(shell find src test -name '*.ts')
LINT_CACHE := .eslint-cache

.PHONY: check clean clobber prod

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
	npx madge --circular --extensions ts src
	@touch $@

$(MK_TESTED): node_modules $(MK_PROD)
	npx jest --reporters `pwd`
	@touch $@

prod: $(MK_PROD)

$(MK_PROD): $(MK_COMPILED) $(MK_LINTED)
	npx tsc -p tsconfig-prod.json
	@touch $@

clean:
	rm -rf $(MK_LINTED) $(MK_COMPILED)
	rm -f $(LINT_CACHE)

clobber: clean
	rm -rf dist
	rm -rf node_modules

