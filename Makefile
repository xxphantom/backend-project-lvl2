install: install-deps

install-deps:
	npm ci

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage

test-watch:
	npm test -- --watch
