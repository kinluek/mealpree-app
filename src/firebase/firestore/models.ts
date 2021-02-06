import firebase from 'firebase';

namespace Models {
  /**
   * Represents the Users collection schema.
   */
  export type User = {
    id?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    createdAt: Date;
    orders?: UserOrder[];
  };

  /**
   * Represents the UserOrders collection scheme - orders subcollection for Users
   */
  export type UserOrder = {
    id?: string;
    venderId: string;
    orderId: string;
    price: string;
    createdAt: Date;
  };

  /**
   * Represents the Vendors collection schema.
   */
  export type Vendor = {
    id?: string;
    ownerId: string; // references a user
    businessName: string;
    location: firebase.firestore.GeoPoint;
    address: {
      houseNameNumber: string;
      street: string;
      city: string;
    };
    createdAt: Date;
    meals?: Meal[];
    orders?: VendorOrder[];
  };

  /**
   * Represents the Meals collection schema - subcollection of Vendor
   */
  export type Meal = {
    id?: string;
    price: number; // price in pennies
    name: string;
    createdAt: Date;
  };

  /**
   * Represents the VendorOrders collection schema - subcollection of Vendor
   */
  export type VendorOrder = {
    id?: string;
    customerId: string;
    meals: {
      mealId: string;
      mealName: string;
      quantity: number;
    }[];
    collectionTime: Date;
    total: number;
    createdAt: Date;
  };

  /**
   * Represents the schemas of the top level Orders collection
   */
  export type Order = {
    id?: string;
    venderId: string;
    customId: string;
    meals: {
      mealId: string;
      mealName: string;
      mealPrice: number;
      quantity: number;
    }[];
    total: number;
    createdAt: Date;
  };
}

export default Models;
