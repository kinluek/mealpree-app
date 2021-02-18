import firebase from '../';
import { ExtraUserDetails, UserResponse } from './types';
import Models from './models';
import { createUserDocFunction } from '../functions';

const firestore = firebase.firestore();

if (window.location.hostname === 'localhost') {
  firestore.useEmulator('localhost', 8080);
}

/**
 * Creates a new user using the firebase.User and extra details provided. Should be called on
 * user sign up and oauth sign in. It only creates a new user document if one does not already
 * exist. The user document is returned
 * @param user
 * @param extra
 */
export const setAndGetUser = async (user: firebase.User, extra?: ExtraUserDetails): Promise<UserResponse> => {
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapShot = await userRef.get();
  let userDoc = snapShot.data() as Models.User;
  if (!snapShot.exists) {
    userDoc = await createUserDocFunction({
      email: user.email,
      displayName: user.displayName,
      ...extra,
    });
  }
  return { userRef, userDoc };
};

export const getUser = (userId: string): firebase.firestore.DocumentReference<firebase.firestore.DocumentData> => {
  return firestore.doc(`users/${userId}`);
};

export const getVendor = async (vendorId: string): Promise<Models.Vendor> => {
  const snapshot = await firestore.doc(`vendors/${vendorId}`).get();
  if (!snapshot.exists) throw new Error(`vendor ${vendorId} does not exist`);
  return { id: snapshot.id, ...snapshot.data() } as Models.Vendor;
};

export const getMealsForVendor = async (vendorId: string): Promise<Models.Meal[]> => {
  const collectionSnapshot = await firestore.collection(`vendors/${vendorId}/meals`).get();
  const meals = collectionSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Models.Meal[];
  return meals;
};
