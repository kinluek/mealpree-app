import React, { useState, createContext, useContext } from "react";
import { useEffect } from "react";
import { auth } from "../firebase";
import type firebase from "firebase";

type User = {
  id: string;
};

type UserContextValues = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  credential: firebase.auth.AuthCredential | null;
  setCredential: React.Dispatch<
    React.SetStateAction<firebase.auth.AuthCredential | null>
  >;
};

export const UserContext = createContext<UserContextValues>(
  {} as UserContextValues
);

export const useUserContext = () => useContext(UserContext);

/**
 * Provides the context for an authed user.
 * @param param0
 */
const UserProvider: React.FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [
    credential,
    setCredential,
  ] = useState<firebase.auth.AuthCredential | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authed) => {
      if (authed) {
        console.log("signed in");
        setUser({ id: authed.uid });
      } else {
        console.log("not signed in");
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, credential, setCredential }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
