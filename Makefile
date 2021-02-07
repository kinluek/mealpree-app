.PHONY: build

build:
	npm run build 
	cd functions; npm run build

export:
	firebase emulators:export seed

