MK_COMPILED := .mk-compiled
MK_LINTED := .mk-linted-ts
TS_SOURCES := $(shell find src test -name '*.ts')
LINT_CACHE := .eslint-cache

.PHONY: check clean clobber prod

check: $(MK_COMPILED) $(MK_LINTED)

$(MK_COMPILED): node_modules $(TS_SOURCES)
	npx tsc -p tsconfig.json
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

prod: check
	npx tsc -p tsconfig-prod.json

clean:
	rm -rf $(MK_LINTED) $(MK_COMPILED)
	rm -f $(LINT_CACHE)
	rm -rf build

clobber: clean
	rm -rf dist
	rm -rf node_modules

