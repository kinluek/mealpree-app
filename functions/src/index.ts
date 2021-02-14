import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import type { UserDocData } from './types';

admin.initializeApp();

const db = admin.firestore();

/**
 * Configure the global function builder.
 */
const functionBuilder = functions.region('europe-west2');

export const createUserDoc = functionBuilder.https.onCall(
  async (data: any | UserDocData, context): Promise<UserDocData> => {
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

    const userDoc = parseCreatUserDocData(data);
    await doc.ref.set(userDoc);

    return userDoc;
  }
);

const parseCreatUserDocData = (data: any): UserDocData => {
  if (!data.email) {
    throw new functions.https.HttpsError('invalid-argument', 'missing email');
  }
  if (!data.displayName && (!data.firstName || !data.lastName)) {
    throw new functions.https.HttpsError('invalid-argument', 'incomplete name set');
  }
  const doc: UserDocData = {
    email: data.email,
    displayName: data.displayName ? data.displayName : data.firstName,
    createdAt: new Date().toISOString(),
  };
  if (data.firstName && data.lastName) {
    doc.firstName = data.firstName;
    doc.lastName = data.lastName;
  }
  return doc;
};
