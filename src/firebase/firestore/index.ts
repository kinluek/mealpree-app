import firebase from '../';
import { ExtraUserDetails, UserResponse } from './types';
import Models from './models';

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
    let { displayName, email } = user;
    if (!email) {
      if (!extra) throw new Error('missing email when setting user');
      email = extra.email;
    }
    if (!displayName) {
      if (!extra) throw new Error('missing email when setting user');
      displayName = extra.firstName;
    }
    userDoc = {
      email,
      displayName: displayName,
      createdAt: new Date(),
      ...extra,
    };
    await userRef.set(userDoc);
  }
  return { userRef, userDoc };
};
