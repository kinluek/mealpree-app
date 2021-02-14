import React, { useState, createContext, useContext } from 'react';
import { useEffect } from 'react';
import { auth } from '../firebase/auth';
import type firebase from 'firebase';
import Models from '../firebase/firestore/models';

type UserState = {
  user: firebase.User;
  userDoc: Models.User | null;
};

type UserContextValues = {
  userState: UserState | null;
  setUserState: React.Dispatch<React.SetStateAction<UserState | null>>;
};

export const UserContext = createContext<UserContextValues>({} as UserContextValues);

export const useUserContext = () => useContext(UserContext);

/**
 * Provides the context for an authed user.
 */
const UserProvider: React.FunctionComponent = ({ children }) => {
  const [userState, setUserState] = useState<UserState | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserState((preState) => (preState ? { ...preState, user } : { user, userDoc: null }));
      } else {
        setUserState(null);
      }
    });
    return unsubscribe;
  }, []);

  return <UserContext.Provider value={{ userState, setUserState }}>{children}</UserContext.Provider>;
};

export default UserProvider;
