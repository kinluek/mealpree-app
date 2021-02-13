.PHONY: build env test

build:
	npm run build 
	cd functions; npm run build

test:
	firebase emulators:exec --only firestore 'npm run test:ci'

env:
	firebase emulators:start --import seed

export:
	firebase emulators:export seed

