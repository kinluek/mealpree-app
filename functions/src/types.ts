import type firebase from 'firebase';

export type UserDocData = {
  displayName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  createdAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
};

export type NewMealRequestData = {
  vendorId: string;
  name: string;
  description: string;
  price: number; // price in pennies
  quantity: number;
  collectionDate: string;
  collectionTimeFrom: number;
  collectionTimeTo: number;
  orderBefore: string;
  createdAt: firebase.firestore.Timestamp;
};

export type MealDoc = {
  name: string;
  description: string;
  price: number; // price in pennies
  quantity: number;
  collectionDate: firebase.firestore.Timestamp;
  collectionTimeFrom: number;
  collectionTimeTo: number;
  orderBefore: firebase.firestore.Timestamp;
  createdAt: firebase.firestore.Timestamp;
};
