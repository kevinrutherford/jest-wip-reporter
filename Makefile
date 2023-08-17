MK_COMPILED := .mk-compiled
MK_LINTED := .mk-linted-ts
TS_SOURCES := $(shell find src -name '*.ts')
LINT_CACHE := .eslint-cache

.PHONY: all clobber compile

all: compile $(MK_LINTED)

compile: node_modules
	npx tsc

node_modules: package.json package-lock.json
	npm ci

$(MK_LINTED): node_modules $(TS_SOURCES)
	npx eslint src \
		--ext .js,.ts \
		--cache --cache-location $(LINT_CACHE) \
		--color --max-warnings 0
	npx madge --circular --extensions ts src
	@touch $@

clean:
	rm -rf $(MK_LINTED)

clobber:
	rm -rf dist

