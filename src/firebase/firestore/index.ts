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
