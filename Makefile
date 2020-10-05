install: install-deps

install-deps:
	npm ci

lint:
	npx eslint .

test:
	npm test
