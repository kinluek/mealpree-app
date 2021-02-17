import type firebase from 'firebase';

export type UserDocData = {
  displayName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  createdAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
};
