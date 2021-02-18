import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import type { NewMealRequestData, MealDoc, UserDocData } from './types';

admin.initializeApp();

const db = admin.firestore();

/**
 * Configure the global function builder.
 */
const functionBuilder = functions.region('europe-west2');

/**
 * Creates a user doc for an authenticated user.
 */
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
    createdAt: admin.firestore.Timestamp.now(),
  };
  if (data.firstName && data.lastName) {
    doc.firstName = data.firstName;
    doc.lastName = data.lastName;
  }
  return doc;
};

/**
 * Adds a new meal for a vendor admin.
 */
export const addNewMeal = functionBuilder.https.onCall(
  async (data: any | NewMealRequestData, context): Promise<void> => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'user not authenticated');
    }
    if (!data.vendorId) {
      throw new functions.https.HttpsError('invalid-argument', 'missing vendor id');
    }

    console.log('DATA', data);

    const vendorDoc = await db.doc(`vendors/${data.vendorId}`).get();
    if (!vendorDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'vendor not found');
    }

    const ownerId = vendorDoc.get('ownerId');
    if (ownerId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'permission defied');
    }

    const newMeal = parseMealDoc(data);

    await db.collection(`vendors/${data.vendorId}/meals`).add(newMeal);
  }
);

const parseMealDoc = (data: any): MealDoc => {
  if (!data.name) {
    throw new functions.https.HttpsError('invalid-argument', 'missing or invalid name');
  }
  if (!data.description) {
    throw new functions.https.HttpsError('invalid-argument', 'missing or invalid orderBefore');
  }
  if (!data.price) {
    throw new functions.https.HttpsError('invalid-argument', 'missing or invalid price');
  }
  if (!data.quantity) {
    throw new functions.https.HttpsError('invalid-argument', 'missing or invalid quantity');
  }
  if (!data.collectionDate) {
    throw new functions.https.HttpsError('invalid-argument', 'missing or invalid collectionDate');
  }
  if (!data.collectionTimeFrom && typeof data.collectionTimeFrom !== 'number') {
    throw new functions.https.HttpsError('invalid-argument', 'missing or invalid collectionTimeFrom');
  }
  if (!data.collectionTimeTo && typeof data.collectionTimeTo !== 'number') {
    throw new functions.https.HttpsError('invalid-argument', 'missing or invalid collectionTimeTo');
  }
  if (!data.orderBefore) {
    throw new functions.https.HttpsError('invalid-argument', 'missing or invalid orderBefore');
  }

  return {
    name: data.name,
    description: data.description,
    price: data.price,
    quantity: data.quantity,
    collectionDate: admin.firestore.Timestamp.fromDate(new Date(data.collectionDate)),
    collectionTimeFrom: data.collectionTimeFrom,
    collectionTimeTo: data.collectionTimeTo,
    orderBefore: admin.firestore.Timestamp.fromDate(new Date(data.orderBefore)),
    createdAt: admin.firestore.Timestamp.now(),
  };
};
