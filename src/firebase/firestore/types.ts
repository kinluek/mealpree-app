import firebase from 'firebase';
import Models from './models';

export type ExtraUserDetails = {
  firstName: string;
  lastName: string;
  email: string;
};

export type UserResponse = {
  userRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  userDoc: Models.User;
};
