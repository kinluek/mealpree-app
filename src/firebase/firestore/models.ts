import firebase from 'firebase';

namespace Models {
  /**
   * Represents the Users collection schema.
   */
  export type User = {
    displayName?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    createdAt: Date | string;
    orders?: UserOrder[];
  };

  /**
   * Represents the UserOrders collection scheme - orders subcollection for Users
   */
  export type UserOrder = {
    venderId: string;
    orderId: string;
    price: string;
    createdAt: Date;
  };

  /**
   * Represents the Vendors collection schema.
   */
  export type Vendor = {
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
    price: number; // price in pennies
    name: string;
    createdAt: Date;
  };

  /**
   * Represents the VendorOrders collection schema - subcollection of Vendor
   */
  export type VendorOrder = {
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
