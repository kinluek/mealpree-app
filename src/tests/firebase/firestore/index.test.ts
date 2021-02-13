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
  const admin = firebase.initializeAdminApp({
    projectId: TEST_FIREBASE_PROJECT_ID,
  });

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

  test('authed read their own user documents', async () => {
    const doc: Models.User = {
      displayName: 'alice',
      email: 'alice@gmail.com',
      firstName: 'alice',
      lastName: 'test',
      createdAt: new Date(),
    };
    await firebase.assertSucceeds(admin.firestore().doc(`users/${aliceAuth.uid}`).set(doc));
    await firebase.assertSucceeds(db.doc(`users/${aliceAuth.uid}`).get());
  });

  test('authed users should not be able to create user documents', async () => {
    const doc: Models.User = {
      displayName: 'alice',
      email: 'alice@gmail.com',
      firstName: 'alice',
      lastName: 'test',
      createdAt: new Date(),
    };
    await firebase.assertFails(db.doc(`users/${aliceAuth.uid}`).set(doc));
    await firebase.assertFails(db.doc(`users/${tomAuth.uid}`).set(doc));
  });
});
