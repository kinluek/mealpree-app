import React, { useState, createContext, useContext } from 'react';
import { useEffect } from 'react';
import { auth } from '../firebase/auth';
import type firebase from 'firebase';

type UserContextValues = {
  user: firebase.User | null;
  setUser: React.Dispatch<React.SetStateAction<firebase.User | null>>;
};

export const UserContext = createContext<UserContextValues>({} as UserContextValues);

export const useUserContext = () => useContext(UserContext);

/**
 * Provides the context for an authed user.
 * @param param0
 */
const UserProvider: React.FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('signed in');
        setUser(user);
      } else {
        console.log('not signed in');
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
