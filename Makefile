.PHONY: doctor install verify dev test test-rust format

doctor:
	pnpm doctor

install:
	pnpm install

verify:
	pnpm verify

dev:
	pnpm dev

test:
	pnpm test

test-rust:
	cargo test --workspace

format:
	pnpm format
