.PHONY: clobber compile

compile: node_modules
	npx tsc

node_modules: package.json package-lock.json
	npm ci

clobber:
	rm -rf dist

