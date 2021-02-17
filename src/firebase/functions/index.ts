import firebase from '../';
import 'firebase/functions';
import Models from '../firestore/models';

const functions = firebase.app().functions('europe-west2');

if (window.location.hostname === 'localhost') {
  functions.useEmulator('localhost', 5001);
}

type CreatUserDocInput = {
  email: string | null;
  displayName: string | null;
  firstName?: string;
  lastName?: string;
};

export const createUserDocFunction = async (input: CreatUserDocInput): Promise<Models.User> => {
  const { data } = await functions.httpsCallable('createUserDoc')(input);
  return {
    email: data.email,
    displayName: data.displayName,
    firstName: data.firstName,
    lastName: data.lastName,
    associatedVendorId: data.associatedVendorId,
    createdAt: new firebase.firestore.Timestamp(data.createdAt._seconds, data.createdAt._nanoseconds),
  };
};
