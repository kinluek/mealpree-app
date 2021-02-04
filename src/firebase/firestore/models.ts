import firebase from 'firebase';

/**
 * Represents the Users collection schema.
 */
type User = {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  orders: UserOrder[];
};

/**
 * Represents the UserOrders collection scheme - orders subcollection for Users
 */
type UserOrder = {
  venderId: string;
  orderId: string;
  price: string;
};

/**
 * Represents the Vendors collection schema.
 */
type Vendor = {
  id: string;
  ownerId: string; // references a user
  businessName: string;
  location: firebase.firestore.GeoPoint;
  address: {
    houseNameNumber: string;
    street: string;
    city: string;
  };
  meals: Meal[];
  orders: VendorOrder;
};

/**
 * Represents the Meals collection schema - subcollection of Vendor
 */
type Meal = {
  id: string;
  price: number; // price in pennies
  name: string;
};

/**
 * Represents the VendorOrders collection schema - subcollection of Vendor
 */
type VendorOrder = {
  customerId: string;
  meals: {
    mealId: string;
    mealName: string;
    quantity: number;
  }[];
  collectionTime: Date;
  total: number;
};

/**
 * Represents the schemas of the top level Orders collection
 */
type Order = {
  venderId: string;
  customId: string;
  meals: {
    mealId: string;
    mealName: string;
    mealPrice: number;
    quantity: number;
  }[];
  total: number;
};
