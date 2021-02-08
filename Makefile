.PHONY: build

build:
	npm run build 
	cd functions; npm run build

test:
	firebase emulators:exec --only firestore 'npm run test:ci'

export:
	firebase emulators:export seed

