import firebase from '../';
import 'firebase/functions';

const functions = firebase.functions();

if (window.location.hostname === 'localhost') {
  functions.useEmulator('localhost', 5001);
}

type CreatUserDocData = {
  email: string | null;
  displayName: string | null;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
};

export const createUserDocFunction = async (data: CreatUserDocData) => functions.httpsCallable('createUserDoc')(data);
