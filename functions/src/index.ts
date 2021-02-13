import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import type { CreatUserDocData } from './types';

admin.initializeApp();

const db = admin.firestore();

/**
 * Configure the global function builder.
 */
const functionBuilder = functions.region('europe-west2');

export const createUserDoc = functionBuilder.https.onCall(async (data: any | CreatUserDocData, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'user not authenticated');
  }

  const doc = await db.doc(`users/${context.auth.uid}`).get();
  if (doc.exists) {
    throw new functions.https.HttpsError('already-exists', 'user doc already exists');
  }

  if (!data.displayName) {
    data.displayName = data.firstName;
  }

  await doc.ref.set(parseCreatUserDocData(data));
});

const parseCreatUserDocData = (data: any): CreatUserDocData => {
  if (!data.email) {
    throw new functions.https.HttpsError('invalid-argument', 'missing email');
  }
  if (!data.displayName && (!data.firstName || !data.lastName)) {
    throw new functions.https.HttpsError('invalid-argument', 'incomplete name set');
  }
  const doc: CreatUserDocData = {
    email: data.email,
    displayName: data.displayName ? data.displayName : data.firstName,
    createdAt: data.createdAt ? data.createdAt : new Date(),
  };
  if (data.firstName && data.lastName) {
    doc.firstName = data.firstName;
    doc.lastName = data.lastName;
  }
  return doc;
};
