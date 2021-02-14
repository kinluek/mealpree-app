import firebase from '../';
import 'firebase/functions';
import Models from '../firestore/models';

const functions = firebase.app().functions('europe-west2');


if (window.location.hostname === 'localhost') {
  functions.useEmulator('localhost', 5001);
}

type CreatUserDocData = {
  email: string | null;
  displayName: string | null;
  firstName?: string;
  lastName?: string;
};

export const createUserDocFunction = async (data: CreatUserDocData): Promise<Models.User> => {
  const result = await functions.httpsCallable('createUserDoc')(data);
  return result.data;
};
