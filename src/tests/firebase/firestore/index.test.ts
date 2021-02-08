/**
 * @jest-environment node
 */

import * as firebase from '@firebase/rules-unit-testing';
import Models from '../../../firebase/firestore/models';

const TEST_FIREBASE_PROJECT_ID = 'test-firestore-rules-project';

const aliceAuth = {
  uid: 'alice-id',
};

const tomAuth = {
  uid: 'tom-id',
};

describe('users', () => {
  const db = firebase
    .initializeTestApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
      auth: aliceAuth,
    })
    .firestore();

  afterEach(async () => {
    await firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  afterAll(async () => {
    await db.terminate();
    await db.clearPersistence();
  });

  test('authed users can create and get their own document', async () => {
    const doc: Models.User = {
      displayName: 'alice',
      email: 'alice@gmail.com',
      firstName: 'alice',
      lastName: 'test',
      createdAt: new Date(),
    };

    await firebase.assertSucceeds(db.doc(`users/${aliceAuth.uid}`).set(doc));
    await firebase.assertSucceeds(db.doc(`users/${aliceAuth.uid}`).get());
  });

  test('authed users should not be able to create other peoples user docs', async () => {
    const doc: Models.User = {
      displayName: 'tom',
      email: 'tom@gmail.com',
      createdAt: new Date(),
    };
    await firebase.assertFails(db.doc(`users/${tomAuth.uid}`).set(doc));
  });

  test('user cannot create fields out of schema', async () => {
    const doc = {
      displayName: 'alice',
      email: 'alice@gmail.com',
      firstName: 'alice',
      lastName: 'test',
      createdAt: new Date(),
      invalid: 'hello',
    };
    await firebase.assertFails(db.doc(`users/${aliceAuth.uid}`).set(doc));
  });
});
